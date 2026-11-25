"""
Experiment 02 -- PCA / SVD Low-Rank Compression of a 2D Physical Field
=======================================================================

MPCE / 05_experiments / linear_algebra / 02_pca_svd_compression

What this script does
---------------------
1. Builds a deterministic 128 x 128 synthetic temperature field T(x, y) on [0,1]^2:
   smooth large-scale components + localized, non-separable features (a rotated
   anisotropic hot spot, a thin circular thermal front, an oblique wave packet)
   + small seeded Gaussian "sensor noise" (seed 42). No external image files.
2. Computes the thin SVD  A = U diag(sigma) V^T  and the truncations
   A_k = sum_{i<=k} sigma_i u_i v_i^T  for every k = 0..r.
3. Verifies the Eckart-Young-Mirsky theorem to machine precision:
      ||A - A_k||_F = sqrt(sum_{i>k} sigma_i^2)      (Frobenius)
      ||A - A_k||_2 = sigma_{k+1}                     (spectral)
   criterion: |explicit - theory| / ||A|| < 1e-12 for all k.
4. Optimality check: A_k is never beaten by another rank-k approximation
   (here: column-pivoted QR truncation).
5. PCA equivalence: eigenvalues of the sample covariance of the centered data
   equal sigma_i^2 / (m - 1) of the centered matrix.
6. Reports compression ratio vs. rank / error, and the noise-filtering effect.

Run:  python experiment.py        (exit code 0 <=> every assertion passed)
Outputs: output/*.png
"""
from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import scipy.linalg as sla  # noqa: E402

SEED = 42
N = 128                 # grid points per direction (m = n = 128)
NOISE_STD = 0.05        # sensor noise standard deviation [K]
TOL_EYM = 1e-12         # Eckart-Young-Mirsky identity tolerance (relative to ||A||)
TOL_PCA = 1e-12         # PCA eigenvalue identity tolerance (relative to lambda_1)
OUT_DIR = Path(__file__).resolve().parent / "output"


# ----------------------------------------------------------------------------
# Synthetic field
# ----------------------------------------------------------------------------
def make_field(n: int, rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Return (X, Y, clean, noisy) temperature RISE above a 300 K ambient, in kelvin.

    The uniform ambient offset is removed on purpose: it is a trivial rank-one
    term that would dominate ||A||_F and make every relative error look tiny.
    """
    x = np.linspace(0.0, 1.0, n)
    X, Y = np.meshgrid(x, x, indexing="xy")      # rows <-> y, columns <-> x

    # (a) smooth large-scale components
    T = 5.0 * X * Y
    T += 30.0 * np.exp(-((X - 0.30) ** 2 + (Y - 0.65) ** 2) / (2 * 0.15 ** 2))
    T += 10.0 * np.sin(2 * np.pi * X) * np.cos(np.pi * Y)

    # (b) rotated anisotropic hot spot (non-separable -> not rank one)
    th = np.deg2rad(35.0)
    xr = (X - 0.72) * np.cos(th) + (Y - 0.30) * np.sin(th)
    yr = -(X - 0.72) * np.sin(th) + (Y - 0.30) * np.cos(th)
    T += 40.0 * np.exp(-(xr ** 2 / (2 * 0.06 ** 2) + yr ** 2 / (2 * 0.015 ** 2)))

    # (c) thin circular thermal front (ring) -- strongly localized, high rank
    R = np.hypot(X - 0.30, Y - 0.25)
    T += 12.0 * np.exp(-((R - 0.12) ** 2) / (2 * 0.01 ** 2))

    # (d) oblique wave packet (e.g. thermo-acoustic ripple)
    T += 3.0 * np.cos(2 * np.pi * 10 * (0.8 * X + 0.6 * Y)) * np.exp(
        -((X - 0.65) ** 2 + (Y - 0.75) ** 2) / (2 * 0.10 ** 2))

    T_noisy = T + NOISE_STD * rng.standard_normal(T.shape)
    return X, Y, T, T_noisy


def truncated(U: np.ndarray, s: np.ndarray, Vt: np.ndarray, k: int) -> np.ndarray:
    return (U[:, :k] * s[:k]) @ Vt[:k, :]


def tail_norms(s: np.ndarray) -> np.ndarray:
    """t[k] = sqrt(sum_{i>=k} s_i^2), k = 0..r (accumulated from the small end)."""
    t2 = np.concatenate([np.cumsum((s ** 2)[::-1])[::-1], [0.0]])
    return np.sqrt(t2)


def main() -> None:
    rng = np.random.default_rng(SEED)
    X, Y, A_clean, A = make_field(N, rng)
    m, n = A.shape
    normA_F = np.linalg.norm(A, "fro")

    U, s, Vt = np.linalg.svd(A, full_matrices=False)
    r = s.size
    print(f"Experiment 02 -- PCA / SVD compression   (seed={SEED}, field {m}x{n}, noise std={NOISE_STD})")
    print(f"||A||_F = {normA_F:.6e},  sigma_1 = {s[0]:.6e},  sigma_r = {s[-1]:.6e},  "
          f"numerical rank (tol=max(m,n)*eps*sigma_1) = {int(np.sum(s > max(m, n) * np.finfo(float).eps * s[0]))}")

    # ---------------- 1. Eckart-Young-Mirsky, Frobenius and spectral --------
    theory_F = tail_norms(s)                         # length r+1
    explicit_F = np.empty(r + 1)
    explicit_2 = np.empty(r)                         # k = 0..r-1
    for k in range(r + 1):
        E = A - truncated(U, s, Vt, k)
        explicit_F[k] = np.linalg.norm(E, "fro")
        if k < r:
            explicit_2[k] = np.linalg.norm(E, 2)
    dev_F = np.abs(explicit_F - theory_F) / normA_F
    dev_2 = np.abs(explicit_2 - s) / s[0]            # sigma_{k+1} is s[k] (0-based)

    print("\n=== Eckart-Young-Mirsky verification ===")
    print(f"{'k':>4}{'||A-A_k||_F explicit':>22}{'sqrt(sum sigma^2)':>20}{'|diff|/||A||_F':>16}"
          f"{'||A-A_k||_2':>14}{'sigma_k+1':>14}{'rel err F':>11}")
    for k in (0, 1, 2, 5, 10, 20, 40, 80, 127):
        print(f"{k:>4}{explicit_F[k]:>22.12e}{theory_F[k]:>20.12e}{dev_F[k]:>16.2e}"
              f"{explicit_2[k]:>14.6e}{s[k]:>14.6e}{explicit_F[k] / normA_F:>11.2e}")
    print(f"max_k |diff_F| / ||A||_F   = {dev_F.max():.2e}   (criterion < {TOL_EYM:.0e})")
    print(f"max_k |diff_2| / sigma_1   = {dev_2.max():.2e}   (criterion < {TOL_EYM:.0e})")
    assert dev_F.max() < TOL_EYM, "Frobenius Eckart-Young-Mirsky identity violated"
    assert dev_2.max() < TOL_EYM, "Spectral Eckart-Young-Mirsky identity violated"
    assert np.all(np.diff(s) <= 0) and np.all(s >= 0), "singular values must be sorted, non-negative"

    # ---------------- 2. Optimality vs pivoted-QR rank-k approximation ------
    Q, Rq, piv = sla.qr(A, pivoting=True, mode="economic")
    inv = np.argsort(piv)
    err_qr = np.empty(r + 1)
    for k in range(r + 1):
        Ak_qr = (Q[:, :k] @ Rq[:k, :])[:, inv]
        err_qr[k] = np.linalg.norm(A - Ak_qr, "fro")
    beaten = np.where(explicit_F > err_qr * (1 + 1e-12) + 1e-12 * normA_F)[0]
    print("\n=== Optimality: SVD truncation vs column-pivoted QR truncation (relative Frobenius error) ===")
    print(f"{'k':>4}{'SVD':>12}{'pivoted QR':>13}{'QR/SVD':>9}")
    for k in (1, 2, 5, 10, 20, 40):
        print(f"{k:>4}{explicit_F[k] / normA_F:>12.3e}{err_qr[k] / normA_F:>13.3e}{err_qr[k] / explicit_F[k]:>9.2f}")
    assert beaten.size == 0, f"SVD truncation beaten at k = {beaten}"

    # ---------------- 3. PCA equivalence ------------------------------------
    # Samples = rows (y-slices), features = columns (x-locations).
    Xc = A - A.mean(axis=0, keepdims=True)
    C = Xc.T @ Xc / (m - 1)
    lam = np.linalg.eigvalsh(C)[::-1]
    lam = np.maximum(lam, 0.0)                     # round-off can make tiny eigenvalues negative
    Uc, sc, Vct = np.linalg.svd(Xc, full_matrices=False)
    lam_svd = sc ** 2 / (m - 1)
    dev_pca = np.max(np.abs(lam - lam_svd)) / lam[0]
    _, Vecs = np.linalg.eigh(C)
    Vecs = Vecs[:, ::-1]
    align = np.abs(np.sum(Vecs[:, :5] * Vct[:5, :].T, axis=0))   # |<v_eig, v_svd>|, top 5 PCs
    evr = lam_svd / lam_svd.sum()
    print("\n=== PCA equivalence: eig(cov) vs SVD(centered data) ===")
    print(f"max |lambda_i - sigma_i^2/(m-1)| / lambda_1 = {dev_pca:.2e}   (criterion < {TOL_PCA:.0e})")
    print(f"|<v_eig, v_svd>| for PC1..PC5 = {np.array2string(align, precision=15)}")
    print(f"explained variance ratio PC1..PC5 = {np.array2string(evr[:5], precision=4)};  "
          f"cumulative(10) = {evr[:10].sum():.6f}")
    assert dev_pca < TOL_PCA, "PCA eigenvalues disagree with SVD"
    assert np.all(align > 1 - 1e-8), "principal directions disagree with right singular vectors"

    # ---------------- 4. Compression ratio ----------------------------------
    rel_err = explicit_F / normA_F
    ks = np.arange(r + 1)
    storage = ks * (m + n + 1)                     # store U_k, sigma_k, V_k
    ratio = (m * n) / np.maximum(storage, 1)
    print("\n=== Compression (store k(m+n+1) numbers instead of mn) ===")
    print(f"{'target rel err':>15}{'min k':>7}{'achieved':>12}{'storage %':>11}{'ratio':>8}")
    comp_rows = []
    for tgt in (5e-2, 2e-2, 1e-2, 5e-3):
        k = int(np.argmax(rel_err <= tgt))
        comp_rows.append((tgt, k, rel_err[k], 100 * storage[k] / (m * n), ratio[k]))
        print(f"{tgt:>15.0e}{k:>7d}{rel_err[k]:>12.3e}{100 * storage[k] / (m * n):>10.1f}%{ratio[k]:>8.2f}")
    k_break = (m * n) // (m + n + 1)
    print(f"break-even rank (storage = mn): k = {k_break}")
    rel_noise = np.linalg.norm(A - A_clean, "fro") / normA_F
    print(f"relative noise level ||eta||_F/||A||_F = {rel_noise:.2e}  (targets below this mostly encode noise)")
    k_1pct = comp_rows[2][1]
    assert k_1pct < k_break, "a 1% approximation must be cheaper to store than the full field"

    # ---------------- 5. Noise filtering ------------------------------------
    norm_clean = np.linalg.norm(A_clean, "fro")
    err_vs_clean = np.array([np.linalg.norm(truncated(U, s, Vt, k) - A_clean, "fro") for k in range(r + 1)]) / norm_clean
    k_opt = int(np.argmin(err_vs_clean))
    noisy_err = np.linalg.norm(A - A_clean, "fro") / norm_clean
    noise_floor = NOISE_STD * (np.sqrt(m) + np.sqrt(n))   # largest singular value of pure noise (approx.)
    print("\n=== Noise filtering (error of A_k w.r.t. the CLEAN field) ===")
    print(f"noisy data vs clean: {noisy_err:.3e};  best rank k* = {k_opt}: {err_vs_clean[k_opt]:.3e}  "
          f"(improvement x{noisy_err / err_vs_clean[k_opt]:.2f})")
    print(f"noise-floor estimate sigma_noise*(sqrt(m)+sqrt(n)) = {noise_floor:.3f};  "
          f"#sigma above floor = {int(np.sum(s > noise_floor))}")
    assert err_vs_clean[k_opt] < noisy_err, "truncation should filter part of the noise"

    # ---------------- Figures -----------------------------------------------
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ext = (0, 1, 0, 1)
    show_k = (1, 5, 15, 40)
    fig, axes = plt.subplots(2, 3, figsize=(13, 8), layout="constrained")
    vmin, vmax = A.min(), A.max()
    im = axes[0, 0].imshow(A, origin="lower", extent=ext, cmap="inferno", vmin=vmin, vmax=vmax)
    axes[0, 0].set_title(r"Original field $\Delta T$ (noisy)")
    for ax, k in zip(axes.flat[1:5], show_k):
        ax.imshow(truncated(U, s, Vt, k), origin="lower", extent=ext, cmap="inferno", vmin=vmin, vmax=vmax)
        ax.set_title(f"rank k={k}\nrel. err {rel_err[k]:.1e}, ratio {ratio[k]:.1f}x")
    E15 = A - truncated(U, s, Vt, 15)
    im2 = axes[1, 2].imshow(E15, origin="lower", extent=ext, cmap="RdBu_r",
                            vmin=-np.abs(E15).max(), vmax=np.abs(E15).max())
    axes[1, 2].set_title("Residual $A - A_{15}$")
    fig.colorbar(im, ax=axes[0, 2], shrink=0.9, label=r"$\Delta T$ [K] (shared by all field panels)")
    fig.colorbar(im2, ax=axes[1, 2], shrink=0.9, label="error [K]")
    for ax in axes.flat:
        ax.set_xlabel("x"); ax.set_ylabel("y")
    fig.savefig(OUT_DIR / "svd_field_reconstructions.png", dpi=130)
    plt.close(fig)

    fig, axes = plt.subplots(1, 3, figsize=(15, 4.4))
    axes[0].semilogy(np.arange(1, r + 1), s, "o", ms=3, label=r"$\sigma_i$")
    axes[0].axhline(noise_floor, color="r", ls="--", label=r"noise floor $\sigma_\eta(\sqrt{m}+\sqrt{n})$")
    axes[0].set_xlabel("index i"); axes[0].set_ylabel(r"$\sigma_i$")
    axes[0].set_title("Singular value spectrum"); axes[0].legend()
    axes[1].semilogy(ks, theory_F / normA_F, "-", lw=2, label=r"theory $\sqrt{\sum_{i>k}\sigma_i^2}/\|A\|_F$")
    axes[1].semilogy(ks, np.maximum(rel_err, 1e-17), "k.", ms=4, label=r"explicit $\|A-A_k\|_F/\|A\|_F$")
    axes[1].semilogy(ks, np.maximum(err_qr / normA_F, 1e-17), "--", label="pivoted-QR rank-k")
    axes[1].semilogy(ks, err_vs_clean, ":", label="SVD $A_k$ vs clean field")
    axes[1].axvline(k_opt, color="gray", lw=0.8)
    axes[1].set_xlabel("rank k"); axes[1].set_ylabel("relative Frobenius error")
    axes[1].set_title("Eckart-Young-Mirsky: error vs rank"); axes[1].legend(fontsize=8)
    m_k = ks[1:k_break + 1]
    axes[2].loglog(rel_err[m_k], ratio[m_k], "-")
    for tgt, k, e, _, cr in comp_rows:
        axes[2].plot(e, cr, "o")
        axes[2].annotate(f"k={k}", (e, cr), textcoords="offset points", xytext=(5, 5), fontsize=8)
    axes[2].set_xlabel("relative error"); axes[2].set_ylabel("compression ratio mn / k(m+n+1)")
    axes[2].set_title("Rate-distortion trade-off"); axes[2].grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "svd_spectrum_error_compression.png", dpi=150)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(6, 4))
    ax.bar(np.arange(1, 11), evr[:10] * 100)
    ax.plot(np.arange(1, 11), np.cumsum(evr[:10]) * 100, "ro-", label="cumulative")
    ax.set_xlabel("principal component"); ax.set_ylabel("explained variance [%]")
    ax.set_title("PCA of the centered field (rows = samples)"); ax.legend()
    fig.tight_layout()
    fig.savefig(OUT_DIR / "pca_explained_variance.png", dpi=150)
    plt.close(fig)

    print(f"\nFigures written to: {OUT_DIR}")
    print("ALL VERIFICATION CRITERIA PASSED")


if __name__ == "__main__":
    main()

"""
Experiment 01 -- Matrix Decompositions: Accuracy, Orthogonality and Conditioning
=================================================================================

MPCE / 05_experiments / linear_algebra / 01_matrix_decomposition

What this script does
---------------------
Part A  Backward (reconstruction) error and orthogonality of five factorizations
        - LU with partial pivoting      A = P L U            (scipy.linalg.lu)
        - Cholesky (SPD only)           A = L L^T            (numpy.linalg.cholesky)
        - Householder QR (from scratch) A = Q R              (householder_qr below)
        - Symmetric eigendecomposition  A = V diag(w) V^T    (numpy.linalg.eigh)
        - SVD                           A = U diag(s) V^T    (numpy.linalg.svd)
        on a random general matrix, a random SPD matrix and Hilbert matrices
        H_n (n = 4, 8, 12).
        Criterion: ||A - A_hat||_F / ||A||_F < 1e-12 and ||Q^T Q - I||_F < 1e-12.

Part B  Orthogonality loss of Classical Gram-Schmidt (CGS) vs. Householder on H_n.

Part C  Square solves H_n x = b (x_true = 1): forward error vs. the kappa*eps bound.

Part D  Least squares min ||A x - b||_2 on matrices with prescribed condition
        number kappa = 1e1 ... 1e12 (zero-residual problems):
        normal equations (A^T A x = A^T b) vs. QR vs. SVD.
        Theory: forward error ~ kappa^2 * eps (NE) vs. ~ kappa * eps (QR, SVD).
        Criterion: fitted log-log slopes ~2 (NE) and ~1 (QR/SVD).

Run:  python experiment.py        (exit code 0 <=> every assertion passed)
Outputs: output/*.png  (created next to this script)
"""
from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")  # headless-safe backend
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import scipy.linalg as sla  # noqa: E402

SEED = 42
EPS = np.finfo(float).eps
OUT_DIR = Path(__file__).resolve().parent / "output"

TOL_BACKWARD = 1e-12   # relative Frobenius reconstruction error
TOL_ORTH = 1e-12       # ||Q^T Q - I||_F


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
def rel_fro(A: np.ndarray, A_hat: np.ndarray) -> float:
    """Relative Frobenius-norm reconstruction (backward) error."""
    return float(np.linalg.norm(A - A_hat, "fro") / np.linalg.norm(A, "fro"))


def orth_err(Q: np.ndarray) -> float:
    """Departure from orthonormal columns: ||Q^T Q - I||_F."""
    k = Q.shape[1]
    return float(np.linalg.norm(Q.T @ Q - np.eye(k), "fro"))


def householder_qr(A: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Full Householder QR, A (m x n, m >= n) = Q (m x m) R (m x n).

    Reflector H_k = I - 2 v v^T (||v|| = 1) zeroes R[k+1:, k]. The sign choice
    alpha = -sign(x_0) ||x|| avoids cancellation in v = x - alpha e_1.
    Q is accumulated by applying the reflectors to I in reverse order.
    """
    R = np.array(A, dtype=float, copy=True)
    m, n = R.shape
    reflectors: list[tuple[int, np.ndarray]] = []
    for k in range(min(m - 1, n)):
        x = R[k:, k]
        normx = np.linalg.norm(x)
        if normx == 0.0:
            continue
        alpha = -normx if x[0] >= 0 else normx
        v = x.copy()
        v[0] -= alpha
        v /= np.linalg.norm(v)
        R[k:, k:] -= 2.0 * np.outer(v, v @ R[k:, k:])
        reflectors.append((k, v))
    Q = np.eye(m)
    for k, v in reversed(reflectors):
        Q[k:, :] -= 2.0 * np.outer(v, v @ Q[k:, :])
    return Q, np.triu(R)


def classical_gram_schmidt(A: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Classical Gram-Schmidt (numerically unstable; used as a counter-example)."""
    m, n = A.shape
    Q = np.zeros((m, n))
    R = np.zeros((n, n))
    for j in range(n):
        v = A[:, j].copy()
        for i in range(j):
            R[i, j] = Q[:, i] @ A[:, j]
            v -= R[i, j] * Q[:, i]
        R[j, j] = np.linalg.norm(v)
        Q[:, j] = v / R[j, j]
    return Q, R


def is_spd(A: np.ndarray) -> bool:
    return bool(np.allclose(A, A.T, rtol=0, atol=0)) and bool(np.all(np.linalg.eigvalsh(A) > 0))


# ----------------------------------------------------------------------------
# Part A -- factorization accuracy
# ----------------------------------------------------------------------------
def factorize_all(A: np.ndarray, symmetric: bool) -> list[dict]:
    """Return one record per decomposition: backward error and orthogonality."""
    rows: list[dict] = []

    P, L, U = sla.lu(A)
    rows.append(dict(method="LU (partial pivot)", backward=rel_fro(A, P @ L @ U), orth=np.nan))

    if symmetric:
        Lc = np.linalg.cholesky(A)
        rows.append(dict(method="Cholesky", backward=rel_fro(A, Lc @ Lc.T), orth=np.nan))

    Q, R = householder_qr(A)
    rows.append(dict(method="Householder QR", backward=rel_fro(A, Q @ R), orth=orth_err(Q)))

    if symmetric:
        w, V = np.linalg.eigh(A)
        rows.append(dict(method="Eig (symmetric)", backward=rel_fro(A, (V * w) @ V.T), orth=orth_err(V)))

    Us, s, Vt = np.linalg.svd(A)
    rows.append(dict(method="SVD", backward=rel_fro(A, (Us * s) @ Vt),
                     orth=max(orth_err(Us), orth_err(Vt.T))))
    return rows


def part_a(rng: np.random.Generator) -> dict[str, list[dict]]:
    n = 100
    G = rng.standard_normal((n, n))
    M = rng.standard_normal((n, n))
    S = M @ M.T / n + np.eye(n)
    cases: dict[str, tuple[np.ndarray, bool]] = {
        "Random general 100x100": (G, False),
        "Random SPD 100x100": (S, True),
    }
    for k in (4, 8, 12):
        cases[f"Hilbert H_{k}"] = (sla.hilbert(k), True)

    print("\n=== Part A: backward (reconstruction) error and orthogonality ===")
    print(f"{'matrix':<24}{'kappa_2':>11}  {'method':<20}{'||A-Ahat||/||A||':>18}{'||QtQ-I||':>12}  status")
    results: dict[str, list[dict]] = {}
    for name, (A, sym) in cases.items():
        if sym:
            assert is_spd(A), f"{name} must be SPD"
        kappa = np.linalg.cond(A)
        rows = factorize_all(A, sym)
        results[name] = rows
        for r in rows:
            ok = r["backward"] < TOL_BACKWARD and (np.isnan(r["orth"]) or r["orth"] < TOL_ORTH)
            r["pass"] = ok
            orth_s = "-" if np.isnan(r["orth"]) else f"{r['orth']:.2e}"
            print(f"{name:<24}{kappa:>11.2e}  {r['method']:<20}{r['backward']:>18.2e}{orth_s:>12}  "
                  f"{'PASS' if ok else 'FAIL'}")
    for name, rows in results.items():
        for r in rows:
            assert r["backward"] < TOL_BACKWARD, f"{name}/{r['method']}: backward error {r['backward']:.2e}"
            if not np.isnan(r["orth"]):
                assert r["orth"] < TOL_ORTH, f"{name}/{r['method']}: orthogonality {r['orth']:.2e}"
    return results


# ----------------------------------------------------------------------------
# Part B -- CGS vs Householder orthogonality
# ----------------------------------------------------------------------------
def part_b() -> list[tuple[int, float, float, float]]:
    print("\n=== Part B: orthogonality ||Q^T Q - I||_F, Householder vs Classical Gram-Schmidt ===")
    print(f"{'n':>3}{'kappa(H_n)':>13}{'Householder':>14}{'CGS':>12}")
    rows = []
    for n in (4, 6, 8, 10, 12):
        H = sla.hilbert(n)
        Qh, _ = householder_qr(H)
        Qc, _ = classical_gram_schmidt(H)
        rows.append((n, np.linalg.cond(H), orth_err(Qh), orth_err(Qc)))
        print(f"{n:>3}{rows[-1][1]:>13.2e}{rows[-1][2]:>14.2e}{rows[-1][3]:>12.2e}")
    # Householder stays at O(n eps); CGS loses orthogonality as kappa grows.
    assert all(r[2] < TOL_ORTH for r in rows), "Householder orthogonality degraded"
    assert rows[-1][3] > 1e-3, "expected CGS to lose orthogonality on H_12"
    return rows


# ----------------------------------------------------------------------------
# Part C -- square solves on Hilbert matrices
# ----------------------------------------------------------------------------
def part_c() -> list[dict]:
    print("\n=== Part C: solve H_n x = b with x_true = 1 (forward error vs kappa*eps bound) ===")
    print(f"{'n':>3}{'kappa':>11}{'kappa*eps':>11}  {'method':<10}{'fwd err':>11}{'bwd err':>11}")
    rows = []
    for n in (4, 8, 12):
        H = sla.hilbert(n)
        x_true = np.ones(n)
        b = H @ x_true
        kappa = np.linalg.cond(H)
        sols = {
            "LU": sla.lu_solve(sla.lu_factor(H), b),
            "Cholesky": sla.cho_solve(sla.cho_factor(H, lower=True), b),
        }
        Q, R = householder_qr(H)
        sols["QR"] = sla.solve_triangular(R, Q.T @ b)
        U, s, Vt = np.linalg.svd(H)
        sols["SVD"] = Vt.T @ ((U.T @ b) / s)
        for meth, x in sols.items():
            fwd = np.linalg.norm(x - x_true) / np.linalg.norm(x_true)
            # normwise backward error (Rigal-Gaches): ||b - Hx|| / (||H|| ||x|| + ||b||)
            bwd = np.linalg.norm(b - H @ x) / (np.linalg.norm(H, 2) * np.linalg.norm(x) + np.linalg.norm(b))
            rows.append(dict(n=n, kappa=kappa, method=meth, fwd=fwd, bwd=bwd))
            print(f"{n:>3}{kappa:>11.2e}{kappa * EPS:>11.2e}  {meth:<10}{fwd:>11.2e}{bwd:>11.2e}")
    # Backward-stable solvers: small backward error even when kappa ~ 1/eps.
    for r in rows:
        if r["method"] in ("LU", "Cholesky", "QR"):
            assert r["bwd"] < TOL_BACKWARD, f"H_{r['n']} {r['method']}: backward error {r['bwd']:.2e}"
        # forward error obeys the first-order bound  fwd <~ c * n * kappa * eps
        assert r["fwd"] <= 10 * r["n"] * r["kappa"] * EPS, f"H_{r['n']} {r['method']}: bound violated"
    # Ill-conditioning must be visible: H_12 forward error is many orders above eps.
    assert max(r["fwd"] for r in rows if r["n"] == 12) > 1e-6
    return rows


# ----------------------------------------------------------------------------
# Part D -- least squares: normal equations vs QR vs SVD
# ----------------------------------------------------------------------------
def part_d(rng: np.random.Generator) -> dict:
    m, n, trials = 60, 12, 20
    exps = np.arange(1, 13)
    kappas = 10.0 ** exps
    U, _ = np.linalg.qr(rng.standard_normal((m, n)))
    V, _ = np.linalg.qr(rng.standard_normal((n, n)))
    X = rng.standard_normal((n, trials))  # 20 right-hand sides per kappa

    err = {"Normal eq.": [], "QR": [], "SVD": []}
    k_ata = []
    for kap in kappas:
        s = np.logspace(0, -np.log10(kap), n)    # sigma_max/sigma_min = kappa
        A = (U * s) @ V.T
        B = A @ X                                # zero-residual problems
        k_ata.append(np.linalg.cond(A.T @ A))
        Xne = np.linalg.solve(A.T @ A, A.T @ B)
        Q, R = householder_qr(A)
        Xqr = sla.solve_triangular(R[:n], (Q.T @ B)[:n])
        Ua, sa, Vta = np.linalg.svd(A, full_matrices=False)
        Xsv = Vta.T @ ((Ua.T @ B) / sa[:, None])
        for key, Xh in (("Normal eq.", Xne), ("QR", Xqr), ("SVD", Xsv)):
            e = np.linalg.norm(Xh - X, axis=0) / np.linalg.norm(X, axis=0)
            err[key].append(float(np.exp(np.mean(np.log(e)))))  # geometric mean over trials

    err = {k: np.array(v) for k, v in err.items()}
    # Fit slopes in the pre-asymptotic (non-saturated) range.
    ne_mask = kappas <= 1e7          # NE saturates once kappa^2 eps ~ 1 (kappa ~ 1e8)
    slope_ne = np.polyfit(np.log10(kappas[ne_mask]), np.log10(err["Normal eq."][ne_mask]), 1)[0]
    slope_qr = np.polyfit(np.log10(kappas), np.log10(err["QR"]), 1)[0]
    slope_sv = np.polyfit(np.log10(kappas), np.log10(err["SVD"]), 1)[0]

    print("\n=== Part D: least squares (m=60, n=12, zero residual, geometric mean of 20 RHS) ===")
    print(f"{'kappa(A)':>10}{'kappa(AtA)':>12}{'Normal eq.':>12}{'QR':>11}{'SVD':>11}")
    for i, kap in enumerate(kappas):
        print(f"{kap:>10.0e}{k_ata[i]:>12.2e}{err['Normal eq.'][i]:>12.2e}{err['QR'][i]:>11.2e}{err['SVD'][i]:>11.2e}")
    print(f"fitted slope d log(err)/d log(kappa):  NE = {slope_ne:.2f} (theory 2, kappa<=1e7)   "
          f"QR = {slope_qr:.2f} (theory <=1)   SVD = {slope_sv:.2f} (theory <=1)")

    i8 = int(np.where(exps == 8)[0][0])
    ratio8 = err["Normal eq."][i8] / err["QR"][i8]
    print(f"at kappa = 1e8: NE error / QR error = {ratio8:.2e}")

    assert 1.6 <= slope_ne <= 2.4, f"NE slope {slope_ne:.2f} not ~2"
    assert 0.6 <= slope_qr <= 1.4, f"QR slope {slope_qr:.2f} not ~1"
    assert 0.6 <= slope_sv <= 1.4, f"SVD slope {slope_sv:.2f} not ~1"
    assert err["QR"][i8] < 1e-6 and err["SVD"][i8] < 1e-6, "QR/SVD should still be accurate at kappa=1e8"
    assert err["Normal eq."][i8] > 1e-2, "NE should have lost (almost) all accuracy at kappa=1e8"
    # kappa(A^T A) = kappa(A)^2 (while representable)
    assert np.allclose(np.array(k_ata[:5]), kappas[:5] ** 2, rtol=1e-2)
    return dict(kappas=kappas, err=err, slopes=(slope_ne, slope_qr, slope_sv), ratio8=ratio8)


# ----------------------------------------------------------------------------
# Figures
# ----------------------------------------------------------------------------
def make_figures(res_a: dict, res_b: list, res_d: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Fig 1: backward error per method and matrix
    methods = ["LU (partial pivot)", "Cholesky", "Householder QR", "Eig (symmetric)", "SVD"]
    names = list(res_a.keys())
    fig, ax = plt.subplots(figsize=(9, 4.5))
    width = 0.16
    for j, meth in enumerate(methods):
        vals = []
        for nm in names:
            r = next((r for r in res_a[nm] if r["method"] == meth), None)
            vals.append(max(r["backward"], 1e-18) if r else np.nan)
        ax.bar(np.arange(len(names)) + (j - 2) * width, vals, width, label=meth)
    ax.axhline(TOL_BACKWARD, color="k", ls="--", lw=1, label="criterion 1e-12")
    ax.axhline(EPS, color="gray", ls=":", lw=1, label="machine eps")
    ax.set_yscale("log")
    ax.set_xticks(np.arange(len(names)), names, rotation=12)
    ax.set_ylabel(r"$\|A-\hat A\|_F/\|A\|_F$")
    ax.set_title("Reconstruction (backward) error of matrix factorizations")
    ax.legend(fontsize=8, ncol=2)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "matdecomp_backward_error.png", dpi=150)
    plt.close(fig)

    # Fig 2: least-squares forward error vs kappa
    k = res_d["kappas"]
    fig, ax = plt.subplots(figsize=(6.5, 4.8))
    for key, mk in (("Normal eq.", "o-"), ("QR", "s-"), ("SVD", "^-")):
        ax.loglog(k, res_d["err"][key], mk, label=key)
    ax.loglog(k, k * EPS, "k--", lw=1, label=r"$\kappa\,\varepsilon$")
    ax.loglog(k, np.minimum(k ** 2 * EPS, 1e2), "k:", lw=1, label=r"$\kappa^2\varepsilon$")
    ax.set_xlabel(r"$\kappa_2(A)$")
    ax.set_ylabel(r"relative forward error $\|\hat x-x\|/\|x\|$")
    s_ne, s_qr, s_sv = res_d["slopes"]
    ax.set_title(f"Least squares: slopes NE={s_ne:.2f}, QR={s_qr:.2f}, SVD={s_sv:.2f}")
    ax.legend()
    ax.grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "matdecomp_lstsq_vs_kappa.png", dpi=150)
    plt.close(fig)

    # Fig 3: orthogonality Householder vs CGS
    arr = np.array(res_b)
    fig, ax = plt.subplots(figsize=(6.5, 4.5))
    ax.semilogy(arr[:, 0], arr[:, 2], "s-", label="Householder QR")
    ax.semilogy(arr[:, 0], arr[:, 3], "o-", label="Classical Gram-Schmidt")
    ax.semilogy(arr[:, 0], arr[:, 1] * EPS, "k--", lw=1, label=r"$\kappa(H_n)\,\varepsilon$")
    ax.axhline(TOL_ORTH, color="gray", ls=":", label="criterion 1e-12")
    ax.set_xlabel("Hilbert matrix size n")
    ax.set_ylabel(r"$\|Q^TQ-I\|_F$")
    ax.set_title("Loss of orthogonality on Hilbert matrices")
    ax.legend()
    ax.grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "matdecomp_orthogonality.png", dpi=150)
    plt.close(fig)


def main() -> None:
    rng = np.random.default_rng(SEED)
    np.set_printoptions(precision=3)
    print(f"Experiment 01 -- Matrix decompositions   (seed={SEED}, eps={EPS:.3e}, numpy {np.__version__})")
    res_a = part_a(rng)
    res_b = part_b()
    part_c()
    res_d = part_d(rng)
    make_figures(res_a, res_b, res_d)
    print(f"\nFigures written to: {OUT_DIR}")
    print("ALL VERIFICATION CRITERIA PASSED")


if __name__ == "__main__":
    main()

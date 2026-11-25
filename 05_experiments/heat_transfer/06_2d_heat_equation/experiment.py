"""
Experiment 06 -- 2D Heat Equation with Explicit FTCS Finite Differences
=======================================================================

MPCE / 05_experiments / heat_transfer / 06_2d_heat_equation

Problem
-------
    u_t = alpha (u_xx + u_yy),        (x, y) in (0,1)^2,  0 < t <= T
    u = 0 on the boundary             (homogeneous Dirichlet)
    u(x, y, 0) = sin(pi x) sin(pi y)
Exact solution:  u(x, y, t) = exp(-2 pi^2 alpha t) sin(pi x) sin(pi y)

Scheme (FTCS: Forward-Time, Centred-Space), uniform grid h = dx = dy = 1/N:
    u_ij^{n+1} = u_ij^n + mu_x (u_{i+1,j} - 2u_ij + u_{i-1,j})
                        + mu_y (u_{i,j+1} - 2u_ij + u_{i,j-1}),
    mu_x = alpha dt/dx^2, mu_y = alpha dt/dy^2,
    r = alpha dt (1/dx^2 + 1/dy^2) = mu_x + mu_y   (stable  <=>  r <= 1/2)

Verification
------------
 (0) SymPy: the exact solution satisfies PDE, BCs and IC (residual == 0).
 (1) Implementation check: sin(pi x) sin(pi y) is a discrete eigenmode, so FTCS
     must reproduce u^n = G^n u^0 with G = 1 - 4 r sin^2(pi h / 2) to round-off.
 (2) Convergence (r = 0.4 fixed, so dt ~ h^2 and the global error is O(h^2)):
     N = 16, 32, 64, 128;  fitted L2 order |p - 2| < 0.05.
 (3) Stability on N = 32 with a seeded 1e-10 perturbation (seed 42):
     r = 0.4 -> discrete maximum principle holds (max|u| never increases);
     r = 0.6 -> blow-up; measured growth factor matches von Neumann prediction
               |G_min| = |1 - 4 r cos^2(pi/(2N))| within 1 %.

Run:  python experiment.py        (exit code 0 <=> every assertion passed)
"""
from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import sympy as sp  # noqa: E402

SEED = 42
ALPHA = 1.0            # thermal diffusivity (non-dimensional)
T_FINAL = 0.05         # final time: exact amplitude exp(-2 pi^2 * 0.05) = 0.373
R_STABLE = 0.4
R_UNSTABLE = 0.6
GRIDS = (16, 32, 64, 128)
STAB_N = 32
STAB_STEPS = 400
PERTURB = 1e-10
OUT_DIR = Path(__file__).resolve().parent / "output"


# ----------------------------------------------------------------------------
# Exact solution, symbolic check
# ----------------------------------------------------------------------------
def exact(X: np.ndarray, Y: np.ndarray, t: float) -> np.ndarray:
    return np.exp(-2 * np.pi ** 2 * ALPHA * t) * np.sin(np.pi * X) * np.sin(np.pi * Y)


def symbolic_check() -> None:
    x, y, t, a = sp.symbols("x y t alpha", real=True)
    u = sp.exp(-2 * sp.pi ** 2 * a * t) * sp.sin(sp.pi * x) * sp.sin(sp.pi * y)
    pde = sp.simplify(sp.diff(u, t) - a * (sp.diff(u, x, 2) + sp.diff(u, y, 2)))
    bcs = [sp.simplify(u.subs(x, 0)), sp.simplify(u.subs(x, 1)),
           sp.simplify(u.subs(y, 0)), sp.simplify(u.subs(y, 1))]
    ic = sp.simplify(u.subs(t, 0) - sp.sin(sp.pi * x) * sp.sin(sp.pi * y))
    print("=== SymPy verification of the exact solution ===")
    print(f"PDE residual = {pde};  BC values = {bcs};  IC residual = {ic}")
    assert pde == 0 and all(b == 0 for b in bcs) and ic == 0


# ----------------------------------------------------------------------------
# FTCS solver
# ----------------------------------------------------------------------------
def ftcs_step(u: np.ndarray, mu_x: float, mu_y: float) -> np.ndarray:
    """One explicit step; boundary rows/columns stay at 0 (Dirichlet).

    Array layout: u[i, j] ~ u(x_i, y_j), i along x (axis 0), j along y (axis 1).
    """
    un = u.copy()
    c = u[1:-1, 1:-1]
    un[1:-1, 1:-1] = (c
                      + mu_x * (u[2:, 1:-1] - 2.0 * c + u[:-2, 1:-1])
                      + mu_y * (u[1:-1, 2:] - 2.0 * c + u[1:-1, :-2]))
    return un


def grid(n: int) -> tuple[np.ndarray, np.ndarray, float]:
    xs = np.linspace(0.0, 1.0, n + 1)
    X, Y = np.meshgrid(xs, xs, indexing="ij")
    return X, Y, 1.0 / n


def time_step_for(r: float, h: float, t_final: float) -> tuple[float, int]:
    """Largest dt with alpha*dt*(2/h^2) <= r that divides t_final exactly."""
    dt_target = r * h * h / (2.0 * ALPHA)
    n_steps = int(np.ceil(t_final / dt_target - 1e-12))
    return t_final / n_steps, n_steps


def solve(n: int, r: float, t_final: float) -> dict:
    X, Y, h = grid(n)
    dt, n_steps = time_step_for(r, h, t_final)
    mu = ALPHA * dt / h ** 2
    u0 = np.sin(np.pi * X) * np.sin(np.pi * Y)
    u0[0, :] = u0[-1, :] = u0[:, 0] = u0[:, -1] = 0.0
    u = u0.copy()
    for _ in range(n_steps):
        u = ftcs_step(u, mu, mu)
    e = u - exact(X, Y, t_final)
    G = 1.0 - 8.0 * mu * np.sin(np.pi * h / 2) ** 2       # discrete eigen-amplification
    return dict(n=n, h=h, dt=dt, steps=n_steps, r=2 * mu, X=X, Y=Y, u=u,
                err=e,
                l2=float(np.sqrt(h * h * np.sum(e ** 2))),
                linf=float(np.abs(e).max()),
                eig_dev=float(np.abs(u - G ** n_steps * u0).max()))


# ----------------------------------------------------------------------------
# (1)+(2) convergence study
# ----------------------------------------------------------------------------
def convergence_study() -> list[dict]:
    runs = [solve(n, R_STABLE, T_FINAL) for n in GRIDS]
    print(f"\n=== Convergence: alpha={ALPHA}, T={T_FINAL}, r={R_STABLE} (dt = r h^2 / (2 alpha)) ===")
    print(f"{'N':>5}{'h':>10}{'dt':>12}{'steps':>7}{'r':>7}{'L2 error':>12}{'order':>7}"
          f"{'Linf error':>12}{'order':>7}{'|u-G^n u0|':>13}")
    for i, rn in enumerate(runs):
        p2 = pinf = ""
        if i:
            p2 = f"{np.log2(runs[i - 1]['l2'] / rn['l2']):.3f}"
            pinf = f"{np.log2(runs[i - 1]['linf'] / rn['linf']):.3f}"
        print(f"{rn['n']:>5}{rn['h']:>10.5f}{rn['dt']:>12.4e}{rn['steps']:>7}{rn['r']:>7.3f}"
              f"{rn['l2']:>12.4e}{p2:>7}{rn['linf']:>12.4e}{pinf:>7}{rn['eig_dev']:>13.2e}")
    hs = np.array([rn["h"] for rn in runs])
    p_l2 = np.polyfit(np.log(hs), np.log([rn["l2"] for rn in runs]), 1)[0]
    p_inf = np.polyfit(np.log(hs), np.log([rn["linf"] for rn in runs]), 1)[0]
    print(f"least-squares fitted order over {len(GRIDS)} grids:  L2 p = {p_l2:.4f},  Linf p = {p_inf:.4f}  (theory 2)")
    for rn in runs:
        assert abs(rn["r"] - R_STABLE) < 1e-12, "time step does not realise r = 0.4"
        assert rn["eig_dev"] < 1e-12, f"N={rn['n']}: FTCS deviates from discrete eigen-solution"
    assert abs(p_l2 - 2.0) < 0.05, f"L2 order {p_l2:.3f} not ~2"
    assert abs(p_inf - 2.0) < 0.05, f"Linf order {p_inf:.3f} not ~2"
    assert runs[-1]["l2"] < 1e-4, "finest-grid error unexpectedly large"
    return runs


# ----------------------------------------------------------------------------
# (3) stability study
# ----------------------------------------------------------------------------
def stability_study(rng: np.random.Generator) -> dict:
    n = STAB_N
    X, Y, h = grid(n)
    noise = PERTURB * rng.standard_normal((n - 1, n - 1))   # same perturbation for both runs
    out = {}
    print(f"\n=== Stability: N={n}, {STAB_STEPS} steps, initial perturbation {PERTURB:g} (seed {SEED}) ===")
    print(f"{'r':>5}{'|G_min| (von Neumann)':>24}{'max|u| final':>15}{'measured growth/step':>22}{'max-principle':>15}")
    for r in (R_STABLE, R_UNSTABLE):
        mu = r / 2.0                                    # dx = dy -> mu_x = mu_y = r/2
        dt = r * h * h / (2 * ALPHA)
        u = np.sin(np.pi * X) * np.sin(np.pi * Y)
        u[0, :] = u[-1, :] = u[:, 0] = u[:, -1] = 0.0
        u[1:-1, 1:-1] += noise
        amax = [np.abs(u).max()]
        for _ in range(STAB_STEPS):
            u = ftcs_step(u, mu, mu)
            amax.append(np.abs(u).max())
        amax = np.array(amax)
        g_pred = abs(1.0 - 4.0 * r * np.cos(np.pi / (2 * n)) ** 2)   # most negative mode
        tail = np.log(amax[-100:])
        g_meas = float(np.exp(np.polyfit(np.arange(100), tail, 1)[0]))
        monotone = bool(np.all(np.diff(amax) <= 1e-15))
        out[r] = dict(amax=amax, u=u, g_pred=g_pred, g_meas=g_meas, monotone=monotone,
                      err=float(np.abs(u - exact(X, Y, STAB_STEPS * dt)).max()))
        print(f"{r:>5.2f}{g_pred:>24.6f}{amax[-1]:>15.3e}{g_meas:>22.6f}{str(monotone):>15}")
    s, us = out[R_STABLE], out[R_UNSTABLE]
    print(f"r={R_STABLE}: max|u - u_exact| after {STAB_STEPS} steps = {s['err']:.2e}")
    print(f"r={R_UNSTABLE}: growth-factor mismatch |g_meas/g_pred - 1| = {abs(us['g_meas'] / us['g_pred'] - 1):.2e}")
    assert s["monotone"], "r=0.4 must satisfy the discrete maximum principle"
    assert s["amax"][-1] < 1.0 and s["err"] < 1e-3, "r=0.4 run must stay accurate"
    assert us["g_pred"] > 1.0, "von Neumann predicts instability for r=0.6"
    assert us["amax"][-1] > 1e6, "r=0.6 run must blow up"
    assert abs(us["g_meas"] / us["g_pred"] - 1) < 0.01, "growth factor disagrees with von Neumann analysis"
    return out


# ----------------------------------------------------------------------------
# Figures
# ----------------------------------------------------------------------------
def make_figures(runs: list[dict], stab: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rn = next(r for r in runs if r["n"] == 64)
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.5), layout="constrained")
    im0 = axes[0].contourf(rn["X"], rn["Y"], rn["u"], levels=30, cmap="inferno")
    axes[0].set_title(f"FTCS solution u(x,y,T={T_FINAL}), N=64, r={R_STABLE}")
    fig.colorbar(im0, ax=axes[0])
    im1 = axes[1].contourf(rn["X"], rn["Y"], rn["err"], levels=30, cmap="RdBu_r")
    axes[1].set_title(f"error u_h - u_exact (L2 = {rn['l2']:.2e})")
    fig.colorbar(im1, ax=axes[1])
    for ax in axes:
        ax.set_xlabel("x"); ax.set_ylabel("y"); ax.set_aspect("equal")
    fig.savefig(OUT_DIR / "heat2d_solution_error.png", dpi=150)
    plt.close(fig)

    hs = np.array([r["h"] for r in runs])
    l2 = np.array([r["l2"] for r in runs])
    li = np.array([r["linf"] for r in runs])
    p2 = np.polyfit(np.log(hs), np.log(l2), 1)[0]
    fig, ax = plt.subplots(figsize=(6, 4.8))
    ax.loglog(hs, l2, "o-", label=f"$L^2$ error (slope {p2:.3f})")
    ax.loglog(hs, li, "s-", label=r"$L^\infty$ error")
    ax.loglog(hs, l2[-1] * (hs / hs[-1]) ** 2, "k--", lw=1, label=r"$O(h^2)$ reference")
    for r, h in zip(runs, hs):
        ax.annotate(f"N={r['n']}", (h, r["l2"]), textcoords="offset points", xytext=(5, -12), fontsize=8)
    ax.set_xlabel("grid spacing h"); ax.set_ylabel("error at T")
    ax.set_title(f"FTCS spatial convergence (r = {R_STABLE})")
    ax.legend(); ax.grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "heat2d_convergence.png", dpi=150)
    plt.close(fig)

    fig, axes = plt.subplots(1, 2, figsize=(12, 4.6), layout="constrained")
    steps = np.arange(STAB_STEPS + 1)
    for r, st in stab.items():
        axes[0].semilogy(steps, st["amax"], label=f"r = {r}")
    us = stab[R_UNSTABLE]
    axes[0].semilogy(steps, PERTURB * us["g_pred"] ** steps, "k--", lw=1,
                     label=fr"$10^{{-10}}|G_{{min}}|^n$, $|G_{{min}}|$={us['g_pred']:.3f}")
    axes[0].set_xlabel("time step n"); axes[0].set_ylabel(r"$\max|u^n|$")
    axes[0].set_title(f"Stability, N={STAB_N}: r=0.4 stable vs r=0.6 blow-up")
    axes[0].legend(); axes[0].grid(True, which="both", alpha=0.3)
    X, Y, _ = grid(STAB_N)
    lim = np.abs(us["u"]).max()
    im = axes[1].pcolormesh(X, Y, us["u"], cmap="RdBu_r", vmin=-lim, vmax=lim, shading="nearest")
    axes[1].set_title(f"r = {R_UNSTABLE}, step {STAB_STEPS}: odd-even (checkerboard) mode")
    axes[1].set_aspect("equal"); axes[1].set_xlabel("x"); axes[1].set_ylabel("y")
    fig.colorbar(im, ax=axes[1])
    fig.savefig(OUT_DIR / "heat2d_stability.png", dpi=150)
    plt.close(fig)


def main() -> None:
    rng = np.random.default_rng(SEED)
    print(f"Experiment 06 -- 2D heat equation, explicit FTCS  (seed={SEED}, alpha={ALPHA})")
    symbolic_check()
    runs = convergence_study()
    stab = stability_study(rng)
    make_figures(runs, stab)
    print(f"\nFigures written to: {OUT_DIR}")
    print("ALL VERIFICATION CRITERIA PASSED")


if __name__ == "__main__":
    main()

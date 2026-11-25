"""
Experiment 03 -- Numerical ODE Integrators on the Harmonic Oscillator
=====================================================================

MPCE / 05_experiments / dynamics / 03_numerical_ode_solver

Model:  x'' + omega^2 x = 0,   x(0) = x0, v(0) = v0
        first-order form  y = (x, v),  y' = A y,  A = [[0, 1], [-omega^2, 0]]
Exact:  x(t) = x0 cos(omega t) + (v0/omega) sin(omega t)
Energy: E = v^2/2 + omega^2 x^2/2   (conserved exactly)

Integrators implemented FROM SCRATCH (no scipy.integrate):
  * Forward Euler     (explicit, order 1)
  * Backward Euler    (implicit, order 1; linear 2x2 solve in closed form)
  * Classical RK4     (explicit, order 4)
  * Velocity Verlet   (explicit, symplectic, order 2)

Verification:
  1. SymPy confirms the analytical solution solves the ODE (residual == 0).
  2. Empirical convergence orders from a log-log least-squares fit over 7 step
     sizes:  |p - p_theory| < 0.1  with p_theory = 1, 1, 4, 2.
  3. Long-time energy behaviour (100 periods, h = 0.05):
     - Forward Euler:  E_n = (1 + h^2 w^2)^n E_0      (exact secular growth)
     - Backward Euler: E_n = (1 + h^2 w^2)^(-n) E_0   (exact secular decay)
     - Velocity Verlet: the modified ("shadow") energy
           E~ = v^2/2 + (omega^2/2)(1 - h^2 omega^2/4) x^2
       is conserved to round-off, so E itself only oscillates with relative
       amplitude ~ h^2 omega^2 / 4 and shows NO secular drift.

Run:  python experiment.py        (exit code 0 <=> every assertion passed)
"""
from __future__ import annotations

from pathlib import Path
from typing import Callable

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import sympy as sp  # noqa: E402

OUT_DIR = Path(__file__).resolve().parent / "output"

OMEGA = 1.0
X0, V0 = 1.0, 0.0
T_CONV = 10.0                                  # final time for convergence study
# Step-count ladders (7 levels, halving h each time). Each ladder lies in the method's
# ASYMPTOTIC regime: first-order methods need small h*omega*T before the O(h^2 T^2)
# correction dies out; RK4 must stay above the round-off floor (~N*eps).
N_LADDER = {
    "Forward Euler": 400 * 2 ** np.arange(7),     # 400 ... 25600
    "Backward Euler": 400 * 2 ** np.arange(7),
    "RK4": 50 * 2 ** np.arange(7),                # 50 ... 3200
    "Velocity Verlet": 50 * 2 ** np.arange(7),
}
H_LONG = 0.05                                  # step for long-time energy study
N_PERIODS = 100
ORDER_TOL = 0.1

Stepper = Callable[[float, float, float], tuple[float, float]]


# ----------------------------------------------------------------------------
# Exact solution and energy
# ----------------------------------------------------------------------------
def exact(t: np.ndarray | float) -> tuple[np.ndarray, np.ndarray]:
    x = X0 * np.cos(OMEGA * t) + V0 / OMEGA * np.sin(OMEGA * t)
    v = -X0 * OMEGA * np.sin(OMEGA * t) + V0 * np.cos(OMEGA * t)
    return x, v


def energy(x: np.ndarray, v: np.ndarray) -> np.ndarray:
    return 0.5 * v ** 2 + 0.5 * OMEGA ** 2 * x ** 2


def accel(x: float) -> float:
    return -OMEGA ** 2 * x


# ----------------------------------------------------------------------------
# One-step maps  (x_n, v_n, h) -> (x_{n+1}, v_{n+1})
# ----------------------------------------------------------------------------
def forward_euler(x: float, v: float, h: float) -> tuple[float, float]:
    return x + h * v, v + h * accel(x)


def backward_euler(x: float, v: float, h: float) -> tuple[float, float]:
    """Solve (I - hA) y_{n+1} = y_n exactly:
        x1 - h v1 = x,  v1 + h w^2 x1 = v   =>  det = 1 + h^2 w^2
    """
    det = 1.0 + h * h * OMEGA ** 2
    x1 = (x + h * v) / det
    v1 = (v - h * OMEGA ** 2 * x) / det
    return x1, v1


def rk4(x: float, v: float, h: float) -> tuple[float, float]:
    def f(xx: float, vv: float) -> tuple[float, float]:
        return vv, accel(xx)

    k1x, k1v = f(x, v)
    k2x, k2v = f(x + 0.5 * h * k1x, v + 0.5 * h * k1v)
    k3x, k3v = f(x + 0.5 * h * k2x, v + 0.5 * h * k2v)
    k4x, k4v = f(x + h * k3x, v + h * k3v)
    return (x + h / 6.0 * (k1x + 2 * k2x + 2 * k3x + k4x),
            v + h / 6.0 * (k1v + 2 * k2v + 2 * k3v + k4v))


def velocity_verlet(x: float, v: float, h: float) -> tuple[float, float]:
    v_half = v + 0.5 * h * accel(x)       # half kick
    x1 = x + h * v_half                   # drift
    v1 = v_half + 0.5 * h * accel(x1)     # half kick
    return x1, v1


METHODS: dict[str, tuple[Stepper, int]] = {
    "Forward Euler": (forward_euler, 1),
    "Backward Euler": (backward_euler, 1),
    "RK4": (rk4, 4),
    "Velocity Verlet": (velocity_verlet, 2),
}


def integrate(step: Stepper, h: float, n_steps: int) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    x = np.empty(n_steps + 1)
    v = np.empty(n_steps + 1)
    x[0], v[0] = X0, V0
    for n in range(n_steps):
        x[n + 1], v[n + 1] = step(x[n], v[n], h)
    return np.arange(n_steps + 1) * h, x, v


# ----------------------------------------------------------------------------
# 1. Symbolic check of the analytical solution
# ----------------------------------------------------------------------------
def symbolic_check() -> None:
    t = sp.symbols("t", real=True)
    w, x0, v0 = sp.symbols("omega x0 v0", positive=True)
    xs = x0 * sp.cos(w * t) + v0 / w * sp.sin(w * t)
    residual = sp.simplify(sp.diff(xs, t, 2) + w ** 2 * xs)
    ic = (sp.simplify(xs.subs(t, 0) - x0), sp.simplify(sp.diff(xs, t).subs(t, 0) - v0))
    dE = sp.simplify(sp.diff(sp.diff(xs, t) ** 2 / 2 + w ** 2 * xs ** 2 / 2, t))
    # dsolve cross-check
    xf = sp.Function("x")
    sol = sp.dsolve(sp.Eq(xf(t).diff(t, 2) + w ** 2 * xf(t), 0), xf(t),
                    ics={xf(0): x0, xf(t).diff(t).subs(t, 0): v0})
    diff = sp.simplify(sp.expand_trig(sol.rhs - xs))
    print("=== SymPy verification of the analytical solution ===")
    print(f"ODE residual x''+w^2 x = {residual};  IC residuals = {ic};  dE/dt = {dE};  dsolve - exact = {diff}")
    assert residual == 0 and ic == (0, 0) and dE == 0 and diff == 0


# ----------------------------------------------------------------------------
# 2. Convergence orders
# ----------------------------------------------------------------------------
def convergence_study() -> dict:
    xT, vT = exact(T_CONV)
    hs: dict[str, np.ndarray] = {}
    errs: dict[str, np.ndarray] = {}
    orders: dict[str, float] = {}
    for name, (step, _) in METHODS.items():
        hs[name] = T_CONV / N_LADDER[name]
        e = []
        for n in N_LADDER[name]:
            _, x, v = integrate(step, T_CONV / n, int(n))
            # energy-weighted state error  sqrt((dx)^2 + (dv/omega)^2)
            e.append(np.hypot(x[-1] - xT, (v[-1] - vT) / OMEGA))
        errs[name] = np.array(e)
        orders[name] = float(np.polyfit(np.log(hs[name]), np.log(errs[name]), 1)[0])

    print(f"\n=== Convergence at T = {T_CONV} (omega = {OMEGA}), global error ||y_N - y(T)|| ===")
    for name, (_, p) in METHODS.items():
        print(f"-- {name} (theory p = {p})")
        print(f"{'N':>8}{'h':>12}{'error':>12}{'log2 ratio':>12}")
        for i, n in enumerate(N_LADDER[name]):
            loc = "" if i == 0 else f"{np.log2(errs[name][i - 1] / errs[name][i]):.4f}"
            print(f"{n:>8}{hs[name][i]:>12.6f}{errs[name][i]:>12.4e}{loc:>12}")
    print(f"\n{'method':<17}{'fitted order':>13}{'theory':>8}{'|diff|':>9}  status")
    for name, (_, p) in METHODS.items():
        ok = abs(orders[name] - p) < ORDER_TOL
        print(f"{name:<17}{orders[name]:>13.4f}{p:>8d}{abs(orders[name] - p):>9.4f}  {'PASS' if ok else 'FAIL'}")
    for name, (_, p) in METHODS.items():
        assert abs(orders[name] - p) < ORDER_TOL, f"{name}: order {orders[name]:.3f} vs {p}"
    return dict(hs=hs, errs=errs, orders=orders)


# ----------------------------------------------------------------------------
# 3. Long-time energy behaviour
# ----------------------------------------------------------------------------
def energy_study() -> dict:
    period = 2 * np.pi / OMEGA
    n_steps = int(round(N_PERIODS * period / H_LONG))
    h = H_LONG
    E0 = energy(X0, V0)
    q = 1.0 + h * h * OMEGA ** 2
    traj = {}
    for name, (step, _) in METHODS.items():
        t, x, v = integrate(step, h, n_steps)
        traj[name] = (t, x, v, energy(x, v))

    print(f"\n=== Long-time energy: h = {h}, {n_steps} steps = {N_PERIODS} periods, E0 = {E0} ===")
    print(f"{'method':<17}{'E_N/E0':>14}{'max|E-E0|/E0':>15}{'drift (mean last10 - first10 periods)':>40}")
    rows = {}
    # Secular drift = (mean over LAST 10 periods) - (mean over FIRST 10 periods).
    # Averaging over many periods removes the bounded O(h^2) oscillation of E.
    win = int(round(10 * period / h))
    for name, (t, x, v, E) in traj.items():
        rel = (E - E0) / E0
        drift = rel[-win:].mean() - rel[:win].mean()
        rows[name] = dict(final=E[-1] / E0, maxdev=np.abs(rel).max(), drift=drift)
        print(f"{name:<17}{E[-1] / E0:>14.6e}{np.abs(rel).max():>15.3e}{drift:>40.3e}")

    # --- exact discrete energy laws for the Euler methods
    fe_pred, be_pred = q ** n_steps, q ** (-n_steps)
    fe_err = abs(rows["Forward Euler"]["final"] / fe_pred - 1)
    be_err = abs(rows["Backward Euler"]["final"] / be_pred - 1)
    print(f"Forward Euler : predicted E_N/E0 = (1+h^2w^2)^N  = {fe_pred:.10e};  rel. mismatch {fe_err:.2e}")
    print(f"Backward Euler: predicted E_N/E0 = (1+h^2w^2)^-N = {be_pred:.10e};  rel. mismatch {be_err:.2e}")

    # --- Verlet shadow energy
    t, x, v, E = traj["Velocity Verlet"]
    E_shadow = 0.5 * v ** 2 + 0.5 * OMEGA ** 2 * (1 - h * h * OMEGA ** 2 / 4) * x ** 2
    shadow_dev = np.abs(E_shadow / E_shadow[0] - 1).max()
    bound = (h * OMEGA) ** 2 / 4 / (1 - (h * OMEGA) ** 2 / 4)
    vv = rows["Velocity Verlet"]
    print(f"Velocity Verlet: max|E-E0|/E0 = {vv['maxdev']:.3e} <= theoretical bound "
          f"(h w)^2/4/(1-(h w)^2/4) = {bound:.3e};  shadow-energy deviation = {shadow_dev:.2e}")
    # RK4 is not symplectic: tiny but monotone dissipation |R(ih w)| < 1
    z = h * OMEGA
    r4 = abs(1 + 1j * z + (1j * z) ** 2 / 2 + (1j * z) ** 3 / 6 + (1j * z) ** 4 / 24)
    rk_pred = r4 ** (2 * n_steps)
    rk_err = abs(rows["RK4"]["final"] / rk_pred - 1)
    print(f"RK4: predicted E_N/E0 = |R(i h w)|^(2N) = {rk_pred:.12f};  observed {rows['RK4']['final']:.12f};"
          f"  rel. mismatch {rk_err:.2e}")

    assert fe_err < 1e-9, "Forward Euler energy law violated"
    assert be_err < 1e-9, "Backward Euler energy law violated"
    assert rk_err < 1e-9, "RK4 energy law violated"
    assert rows["Forward Euler"]["final"] > 1e10, "expected massive energy growth for Forward Euler"
    assert rows["Backward Euler"]["final"] < 1e-10, "expected near-total energy loss for Backward Euler"
    assert np.all(np.diff(traj["Forward Euler"][3]) > 0), "FE energy must increase monotonically"
    assert np.all(np.diff(traj["Backward Euler"][3]) < 0), "BE energy must decrease monotonically"
    assert vv["maxdev"] <= bound * (1 + 1e-9), "Verlet energy oscillation exceeds theoretical bound"
    assert shadow_dev < 1e-12, "Verlet shadow energy not conserved"
    # no secular drift: the 10-period-averaged change is < 0.1 % of the oscillation amplitude
    assert abs(vv["drift"]) < 1e-3 * vv["maxdev"], "Verlet shows secular energy drift"
    # ...and it beats 4th-order RK4, whose (tiny) dissipation accumulates monotonically
    assert abs(vv["drift"]) < abs(rows["RK4"]["drift"]), "Verlet drift should be below RK4 drift"
    return dict(traj=traj, h=h, n_steps=n_steps, period=period)


# ----------------------------------------------------------------------------
# Figures
# ----------------------------------------------------------------------------
def make_figures(conv: dict, en: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    styles = {"Forward Euler": "o-", "Backward Euler": "s-", "RK4": "^-", "Velocity Verlet": "d-"}

    fig, ax = plt.subplots(figsize=(6.5, 5))
    for name, (_, p) in METHODS.items():
        hs = conv["hs"][name]
        ax.loglog(hs, conv["errs"][name], styles[name], label=f"{name}: p = {conv['orders'][name]:.3f}")
        ref = conv["errs"][name][-1] * (hs / hs[-1]) ** p
        ax.loglog(hs, ref, "k:", lw=0.8)
    ax.set_xlabel("step size h")
    ax.set_ylabel(r"global error $\|y_N - y(T)\|$")
    ax.set_title(f"Convergence at T={T_CONV} (dotted: slopes 1, 1, 4, 2)")
    ax.legend(fontsize=8)
    ax.grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "ode_convergence.png", dpi=150)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8, 4.8))
    for name, (t, x, v, E) in en["traj"].items():
        ax.semilogy(t / en["period"], np.abs(E / E[0] - 1) + 1e-17, label=name, lw=1)
    ax.set_xlabel("time [periods]")
    ax.set_ylabel(r"$|E(t)-E_0|/E_0$")
    ax.set_title(f"Long-time energy error, h = {en['h']} (h$\\omega$ = {en['h'] * OMEGA})")
    ax.legend()
    ax.grid(True, which="both", alpha=0.3)
    fig.tight_layout()
    fig.savefig(OUT_DIR / "ode_energy_drift.png", dpi=150)
    plt.close(fig)

    fig, axes = plt.subplots(1, 4, figsize=(15, 4), sharex=False)
    th = np.linspace(0, 2 * np.pi, 200)
    for ax, (name, (t, x, v, E)) in zip(axes, en["traj"].items()):
        ax.plot(x, v / OMEGA, lw=0.4)
        ax.plot(np.cos(th), np.sin(th), "k--", lw=1, label="exact orbit")
        ax.set_title(name)
        ax.set_xlabel("x"); ax.set_ylabel(r"$v/\omega$")
        ax.set_aspect("equal", adjustable="datalim")
        if name == "Forward Euler":
            ax.set_xlim(-4, 4); ax.set_ylim(-4, 4)
        ax.legend(fontsize=7, loc="upper right")
    fig.suptitle(f"Phase portraits over {N_PERIODS} periods (h = {en['h']})")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "ode_phase_portraits.png", dpi=150)
    plt.close(fig)


def main() -> None:
    print(f"Experiment 03 -- ODE integrators on x'' + w^2 x = 0  (omega={OMEGA}, x0={X0}, v0={V0}; deterministic, no RNG)")
    symbolic_check()
    conv = convergence_study()
    en = energy_study()
    make_figures(conv, en)
    print(f"\nFigures written to: {OUT_DIR}")
    print("ALL VERIFICATION CRITERIA PASSED")


if __name__ == "__main__":
    main()

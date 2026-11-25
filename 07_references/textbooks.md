# 教材清单 Curated Textbooks

> MPCE — Mathematical Physics & Computational Engineering
> 原则 Principle: 少而精 — one primary book per subject, one or two references. Senior-undergraduate → early-graduate rigor.

## 0. 约定 Conventions

> 本清单与主路线图 [`ROADMAP.md`](../ROADMAP.md) 的 **Phase I–VII** 七阶段体系保持一致；下表给出粗粒度学习区块（`P-I`–`P-IV`）与 **Phase I–VII** 的对应关系，便于按阶段检索教材。

| Code | 对应 ROADMAP 阶段 | Focus |
|---|---|---|
| **P-I** | **Phase I**（M1–M2）及穿插基础 | Linear algebra, multivariable/vector calculus, early probability & Python numerical computing |
| **P-II** | **Phase II**（M3–M4）及穿插进阶 | ODE/dynamics, PDE/Fourier/Laplace/Green, complex analysis, calculus of variations |
| **P-III** | **Phase III–IV**（M5–M12）+ **Phase V**（M13–M15） | Classical/modern physics, solid state; numerical linear algebra, FDM/FVM/FEM foundations |
| **P-IV** | **Phase VI–VII**（M15–M24） | Optimization, control, estimation, SciML, multiphysics/devices/materials/HPC capstone |

- **Role 角色**: `Primary` = read cover-to-cover for the must-study chapters; `Supplementary` = parallel reading for a second viewpoint; `Reference` = consult on demand; `Optional` = rigor/depth upgrade, skippable.
- The phase mapping is the default for this repo. If the master roadmap is revised, update this table and the `Phase` column below together.
- Editions are the latest ones I can confirm. Where a newer edition may exist or the learner's local copy differs, the entry says so.

## 1. 本地已有 Local Copies (already owned)

| Book | How it fits 定位 |
|---|---|
| Stewart, *Calculus* (edition: record your local copy) | **Primary for multivariable computation** (Ch. 12–16 in the 8e/9e Early Transcendentals numbering: vectors → vector functions → partial derivatives → multiple integrals → vector calculus). Use it for computation drills next to Strang. |
| Axler, *Linear Algebra Done Right*, 4e | **Proof-based complement** to Strang. Strang gives the matrix/computational view, Axler the operator view (eigen-theory without determinants, spectral theorem, SVD). Read in parallel during P-I and revisit in P-II. |
| Rudin, *Principles of Mathematical Analysis*, 3e | **Optional rigor reference**. Use it when you need ε-δ precision (uniform convergence for Fourier series, Ch. 7; differentiation in ℝⁿ, Ch. 9). Not a primary text in this engineering-oriented track. |
| Needham, *Visual Complex Analysis* | **Primary for complex-analysis intuition** (amplitwist, conformal maps, flows and harmonic functions). Pair it with RHB Ch. 24–25 for computational technique. |

## 2. 数学 Mathematics

| # | Title | Author(s) | Edition / Year | Publisher | Role | Phase | Why chosen 选用理由 |
|---|---|---|---|---|---|---|---|
| M1 | *Introduction to Linear Algebra* | Gilbert Strang | 6e, 2023 | Wellesley-Cambridge Press | Primary | P-I | Four-subspace / factorization view (LU, QR, SΛS⁻¹, QΛQᵀ, UΣVᵀ); matched to MIT 18.06 lectures. |
| M2 | *Linear Algebra Done Right* | Sheldon Axler | 4e, 2024 | Springer (UTM; open access) | Supplementary (local) | P-I/P-II | Operator-theoretic rigor; prepares for function spaces in PDE/QM. |
| M3 | *Introduction to Applied Linear Algebra: Vectors, Matrices, and Least Squares* | Stephen Boyd, Lieven Vandenberghe | 2018 | Cambridge University Press | Supplementary | P-I | Least squares, data fitting and control examples; free PDF from the authors. |
| M4 | *Matrix Analysis* | Roger A. Horn, Charles R. Johnson | 2e, 2012 | Cambridge University Press | Reference | P-II+ | Definitive reference for norms, perturbation and positive-definite matrices. |
| M5 | *Calculus* (Early Transcendentals) | James Stewart (later eds. with D. Clegg, S. Watson) | local edition | Cengage | Primary (local) | P-I | Computational fluency in multivariable/vector calculus. |
| M6 | *Vector Calculus* | Jerrold E. Marsden, Anthony Tromba | 6e, 2012 | W. H. Freeman | Supplementary | P-I | More rigorous than Stewart on the theorems of Green/Stokes/Gauss; includes differential-forms flavor. |
| M7 | *Div, Grad, Curl, and All That* | H. M. Schey | 4e, 2005 | W. W. Norton | Supplementary | P-I | Short; builds vector calculus from electrostatics, the bridge to Griffiths EM. |
| M8 | *Visual Complex Analysis* | Tristan Needham | 1997 (25th Anniversary Ed. 2023) | Oxford University Press | Primary (local) | P-II | Geometric intuition for analyticity, conformality and potential flow. |
| M9 | *Principles of Mathematical Analysis* | Walter Rudin | 3e, 1976 | McGraw-Hill | Optional (local) | P-I/P-II | Rigor backstop. |
| M10 | *Mathematical Methods for Physics and Engineering* | K. F. Riley, M. P. Hobson, S. J. Bence | 3e, 2006 | Cambridge University Press | Primary (cross-cutting) | P-I→P-III | One book that covers ODE, PDE, Fourier, Green's functions, complex variables, tensors and calculus of variations at physics depth. |
| M11 | *Elementary Differential Equations and Boundary Value Problems* | W. E. Boyce, R. C. DiPrima (11e adds D. B. Meade) | 11e, 2017 | Wiley | Primary (ODE) | P-II | Standard ODE text with Laplace, systems, stability, Fourier/BVP and Sturm–Liouville chapters. |
| M12 | *Nonlinear Dynamics and Chaos* | Steven H. Strogatz | 2e, 2015 | Westview Press (now CRC Press) | Primary (dynamics) | P-II | Phase plane, bifurcations, limit cycles, Lorenz system; strongly application-driven. |
| M13 | *Applied Partial Differential Equations with Fourier Series and Boundary Value Problems* | Richard Haberman | 5e, 2013 | Pearson | Primary (PDE) | P-II | Separation of variables, Sturm–Liouville, Green's functions, transforms and characteristics, all aimed at physical models. |
| M14 | *Partial Differential Equations* | Lawrence C. Evans | 2e, 2010 | AMS (Graduate Studies in Mathematics 19) | Optional | P-II+ | Weak solutions and Sobolev spaces; needed only for deep FEM theory (Brenner–Scott). |
| M15 | *Introduction to Probability* | Joseph K. Blitzstein, Jessica Hwang | 2e, 2019 | CRC Press (Chapman & Hall) | Primary | P-I/P-II | Matched to Harvard Stat 110; story proofs; covers Markov chains and MCMC. |
| M16 | *All of Statistics* | Larry Wasserman | 2004 | Springer | Supplementary | P-II | Compact estimation, inference, bootstrap and Bayesian coverage. |
| M17 | *Probability and Random Processes* | Geoffrey Grimmett, David Stirzaker | 4e, 2020 | Oxford University Press | Reference | P-II+ | Stochastic processes and Brownian motion, for diffusion/noise models. |
| M18 | *Bayesian Data Analysis* | A. Gelman, J. B. Carlin, H. S. Stern, D. B. Dunson, A. Vehtari, D. B. Rubin | 3e, 2013 | CRC Press | Reference | P-IV | Inverse problems and uncertainty quantification (UQ). |
| M19 | *Convex Optimization* | Stephen Boyd, Lieven Vandenberghe | 2004 | Cambridge University Press | Primary (optimization) | P-II/P-III | Matched to Stanford EE364a; free PDF from the authors. |
| M20 | *Numerical Optimization* | Jorge Nocedal, Stephen J. Wright | 2e, 2006 | Springer | Reference | P-III/P-IV | Quasi-Newton, trust-region and constrained algorithms used in solvers and training. |

## 3. 计算科学 Computational Science

| # | Title | Author(s) | Edition / Year | Publisher | Role | Phase | Why chosen |
|---|---|---|---|---|---|---|---|
| C1 | *Numerical Linear Algebra* | Lloyd N. Trefethen, David Bau III | 1997 (25th Anniversary Ed. 2022) | SIAM | Primary | P-II | 40 short lectures on conditioning, stability, QR, eigenvalues, Krylov methods. The best ratio of insight to page count. |
| C2 | *Scientific Computing: An Introductory Survey* | Michael T. Heath | 2e, 2002 (SIAM Classics reprint, 2018) | McGraw-Hill / SIAM | Primary | P-I/P-II | Broad survey: floating point → linear systems → nonlinear → ODE/PDE → FFT → Monte Carlo. |
| C3 | *An Introduction to Numerical Analysis* | Endre Süli, David F. Mayers | 2003 | Cambridge University Press | Supplementary | P-II | Rigorous proofs of interpolation, quadrature, ODE convergence and FEM basics. |
| C4 | *Accuracy and Stability of Numerical Algorithms* | Nicholas J. Higham | 2e, 2002 | SIAM | Reference | P-II+ | Authoritative rounding-error analysis. |
| C5 | *Matrix Computations* | Gene H. Golub, Charles F. Van Loan | 4e, 2013 | Johns Hopkins University Press | Reference | P-II+ | Algorithmic encyclopedia for dense and sparse matrix computations. |
| C6 | *Computational Science and Engineering* | Gilbert Strang | 2007 | Wellesley-Cambridge Press | Supplementary (bridge) | P-II/P-III | Matched to MIT 18.085: AᵀCA framework linking springs, circuits, FEM and least squares. |
| C7 | *Finite Difference Methods for Ordinary and Partial Differential Equations* | Randall J. LeVeque | 2007 | SIAM | Primary (FDM) | P-II/P-III | Consistency, stability and convergence for BVP/IVP/parabolic/hyperbolic problems; stiff ODEs. |
| C8 | *Finite Volume Methods for Hyperbolic Problems* | Randall J. LeVeque | 2002 | Cambridge University Press | Primary (FVM) | P-III/P-IV | Conservation laws, Godunov, high-resolution limiters; theory behind CFD codes. |
| C9 | *The Finite Element Method: Linear Static and Dynamic Finite Element Analysis* | Thomas J. R. Hughes | 1987 (Dover reprint, 2000) | Prentice-Hall / Dover | Primary (FEM, engineering) | P-III/P-IV | Variational formulation → isoparametric elements → dynamics; the engineering FEM standard. |
| C10 | *The Mathematical Theory of Finite Element Methods* | Susanne C. Brenner, L. Ridgway Scott | 3e, 2008 | Springer (Texts in Applied Mathematics 15) | Reference (FEM theory) | P-IV | Sobolev spaces, Céa's lemma, error estimates. |
| C11 | *Solving Ordinary Differential Equations I: Nonstiff Problems* / *II: Stiff and Differential-Algebraic Problems* | E. Hairer, S. P. Nørsett, G. Wanner / E. Hairer, G. Wanner | I: 2e, 1993; II: 2e, 1996 | Springer | Reference | P-II+ | Authoritative on Runge–Kutta, multistep and stiff integrators. |
| C12 | *Spectral Methods in MATLAB* | Lloyd N. Trefethen | 2000 | SIAM | Supplementary | P-III | Short, code-driven; Chebyshev/Fourier spectral collocation (translate the code to NumPy). |
| C13 | *Computational Methods for Fluid Dynamics* | Joel H. Ferziger, Milovan Perić, Robert L. Street | 4e, 2020 | Springer | Primary (CFD) | P-IV | FVM for incompressible Navier–Stokes, pressure–velocity coupling, turbulence modeling; the conceptual basis for OpenFOAM. |
| C14 | *Understanding Molecular Simulation* | Daan Frenkel, Berend Smit | 2e, 2002 (3e, 2023) | Academic Press | Primary (MD/MC) | P-III/P-IV | Statistical-mechanical foundations of MD and Monte Carlo; the background for LAMMPS. |
| C15 | *Electronic Structure: Basic Theory and Practical Methods* | Richard M. Martin | 2e, 2020 | Cambridge University Press | Primary (DFT) | P-IV | Kohn–Sham DFT, plane waves, pseudopotentials; the background for Quantum ESPRESSO. |
| C16 | *Data-Driven Science and Engineering* | Steven L. Brunton, J. Nathan Kutz | 2e, 2022 | Cambridge University Press | Primary (SciML bridge) | P-III/P-IV | SVD/POD, DMD, SINDy, and the move from control to ML and PINNs. |
| C17 | *Deep Learning* | Ian Goodfellow, Yoshua Bengio, Aaron Courville | 2016 | MIT Press | Reference | P-IV | Foundations of optimization and architectures for neural PDE solvers. |
| C18 | *Programming Massively Parallel Processors* | Wen-mei W. Hwu, David B. Kirk, Izzat El Hajj | 4e, 2022 | Morgan Kaufmann | Reference | P-IV | CUDA programming model, memory hierarchy, parallel patterns (stencils, SpMV, reductions). |

## 4. 物理 Physics

| # | Title | Author(s) | Edition / Year | Publisher | Role | Phase | Why chosen |
|---|---|---|---|---|---|---|---|
| H1 | *Classical Mechanics* | John R. Taylor | 2005 | University Science Books | Primary | P-III | Lagrangian/Hamiltonian mechanics, oscillations, nonlinear mechanics and chaos at the right level. |
| H2 | *Classical Mechanics* | H. Goldstein, C. Poole, J. Safko | 3e, 2002 | Addison-Wesley | Reference | P-III | Graduate depth: rigid bodies, canonical transformations. |
| H3 | *Vibrations and Waves* | A. P. French | 1971 | W. W. Norton (MIT Introductory Physics Series) | Supplementary | P-III | Normal modes, waves and Fourier ideas from the physics side (MIT 8.03 lineage). |
| H4 | *Introduction to Electrodynamics* | David J. Griffiths | 5e, 2023 | Cambridge University Press | Primary | P-III | Uses vector calculus, Laplace's equation, multipoles and EM waves; the source of the Poisson model in device simulation. |
| H5 | *Classical Electrodynamics* | John David Jackson | 3e, 1999 | Wiley | Reference | P-IV | Green's functions and boundary-value problems at graduate depth. |
| H6 | *Introduction to Quantum Mechanics* | David J. Griffiths, Darrell F. Schroeter | 3e, 2018 | Cambridge University Press | Primary | P-III | Schrödinger equation as an eigenvalue problem; leads into band theory and DFT. |
| H7 | *Modern Quantum Mechanics* | J. J. Sakurai, Jim Napolitano | 3e, 2020 | Cambridge University Press | Reference | P-IV | Dirac formalism, perturbation theory at graduate level. |
| H8 | *Thermal Physics* | Charles Kittel, Herbert Kroemer | 2e, 1980 | W. H. Freeman | Primary | P-III | Statistical mechanics with semiconductor statistics (Fermi–Dirac, carrier concentrations). Directly feeds Streetman. |
| H9 | *An Introduction to Thermal Physics* | Daniel V. Schroeder | 2000 (Oxford University Press reissue, 2021) | Addison-Wesley / OUP | Supplementary | P-III | Gentler entry; good computational exercises (Ising, Monte Carlo). |
| H10 | *Introduction to Solid State Physics* | Charles Kittel | 8e, 2005 | Wiley | Primary | P-III | Crystals, phonons, free electrons, bands, semiconductors. |
| H11 | *Solid State Physics* | Neil W. Ashcroft, N. David Mermin | 1976 | Holt, Rinehart and Winston (later Cengage) | Reference | P-IV | Rigorous band theory and transport. |

## 5. 工程应用 Engineering Applications

| # | Title | Author(s) | Edition / Year | Publisher | Role | Phase | Why chosen |
|---|---|---|---|---|---|---|---|
| E1 | *Solid State Electronic Devices* | Ben G. Streetman, Sanjay Kumar Banerjee | 7e, 2015 | Pearson | Primary | P-IV | Carrier statistics → drift-diffusion → p–n junction → MOSFET; the governing equations for device TCAD projects. |
| E2 | *Physics of Semiconductor Devices* | S. M. Sze, Kwok K. Ng | 3e, 2007 | Wiley | Reference | P-IV | Device-physics encyclopedia. |
| E3 | *A First Course in Continuum Mechanics* | Y. C. Fung | 3e, 1994 | Prentice Hall | Primary | P-III/P-IV | Stress/strain tensors, conservation laws, constitutive equations; the governing equations behind FEM for solids and CFD. |
| E4 | *Fluid Mechanics* | Pijush K. Kundu, Ira M. Cohen, David R. Dowling | 6e, 2016 | Academic Press | Primary (fluids) | P-IV | Navier–Stokes, boundary layers, instability, turbulence: the physics for OpenFOAM work. |
| E5 | *Fundamentals of Heat and Mass Transfer* | T. L. Bergman, A. S. Lavine, F. P. Incropera, D. P. DeWitt | 7e, 2011 (8e, 2017 also available) | Wiley | Reference | P-III/P-IV | Engineering heat-conduction and convection benchmarks for validating solvers. |
| E6 | *Signals and Systems* | Alan V. Oppenheim, Alan S. Willsky, with S. Hamid Nawab | 2e, 1997 | Prentice Hall | Reference | P-II/P-IV | Fourier/Laplace/z-transforms in the engineering convention; uses of the FFT. |
| E7 | *Feedback Systems: An Introduction for Scientists and Engineers* | Karl J. Åström, Richard M. Murray | 2e, 2021 | Princeton University Press (free online edition) | Reference | P-IV | State-space models, stability, feedback; links ODE theory to control. |
| E8 | *Optimal State Estimation: Kalman, H∞, and Nonlinear Approaches* | Dan Simon | 2006 | Wiley | Reference | P-IV | Kalman/EKF/UKF derivations; the bridge from probability to estimation. |

## 6. 刻意未选 Deliberately Not Included

- Boas, Arfken–Weber–Harris, Kreyszig: these overlap with RHB (M10). Pick one methods book only.
- Large lists of ML textbooks: Goodfellow (C17) plus Brunton–Kutz (C16) is enough for the SciML track.
- Landau–Lifshitz series: too terse for a first pass. Revisit after the 24 months if desired.

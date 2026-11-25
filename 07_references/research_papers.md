# 经典与前沿论文 Landmark & Modern Papers

> Each entry gives authors (year), title, venue with volume(issue) and pages, why it matters, when to read it, and a reproduction task (复现任务).
> DOIs are deliberately omitted to avoid transcription errors. Resolve each paper from its journal citation, or from its arXiv ID where one is given.
> Phase codes: see [textbooks.md](textbooks.md#0-约定-conventions).

## A. 数值线性代数与算法 Numerical Linear Algebra & Algorithms

| # | Citation | Why it matters 意义 | Phase | Reproduction task 复现 |
|---|---|---|---|---|
| A1 | Hestenes, M. R., & Stiefel, E. (1952). Methods of conjugate gradients for solving linear systems. *Journal of Research of the National Bureau of Standards*, 49(6), 409–436. | Origin of CG, the workhorse for SPD systems from FEM/FDM. | P-II | Implement CG; verify the √κ convergence rate on the 2-D Poisson matrix. |
| A2 | Golub, G., & Kahan, W. (1965). Calculating the singular values and pseudo-inverse of a matrix. *SIAM Journal on Numerical Analysis, Series B*, 2(2), 205–224. | Stable SVD via bidiagonalization. | P-II | Householder bidiagonalization; compare with `np.linalg.svd`. |
| A3 | Francis, J. G. F. (1961–1962). The QR transformation: A unitary analogue to the LR transformation, Parts 1–2. *The Computer Journal*, 4(3), 265–271; 4(4), 332–345. | QR algorithm: the basis of every dense eigensolver. | P-II | Unshifted vs Wilkinson-shifted QR on a symmetric tridiagonal matrix. |
| A4 | Eckart, C., & Young, G. (1936). The approximation of one matrix by another of lower rank. *Psychometrika*, 1(3), 211–218. | Optimal low-rank approximation; the theory behind POD/PCA/ROMs. | P-I/P-II | Image compression and POD of a simulated flow snapshot matrix. |
| A5 | Saad, Y., & Schultz, M. H. (1986). GMRES: A generalized minimal residual algorithm for solving nonsymmetric linear systems. *SIAM Journal on Scientific and Statistical Computing*, 7(3), 856–869. | Krylov solver for nonsymmetric systems (advection, Navier–Stokes). | P-III | Arnoldi + GMRES; convergence on a convection–diffusion matrix with and without ILU. |
| A6 | Cooley, J. W., & Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. *Mathematics of Computation*, 19(90), 297–301. | O(N log N) FFT, which makes spectral methods and signal processing practical. | P-II | Recursive radix-2 FFT; timing vs O(N²) DFT vs `np.fft`. |
| A7 | Goldberg, D. (1991). What every computer scientist should know about floating-point arithmetic. *ACM Computing Surveys*, 23(1), 5–48. | IEEE 754, rounding, cancellation. Required reading before any numerics. | P-I | Demonstrate catastrophic cancellation in (1−cos x)/x² and fix it. |
| A8 | Greengard, L., & Rokhlin, V. (1987). A fast algorithm for particle simulations. *Journal of Computational Physics*, 73(2), 325–348. | Fast multipole method, O(N) N-body; one of the "top 10 algorithms" of the 20th century. | P-IV (optional) | Read only; compare to Barnes–Hut conceptually. |
| A9 | Halko, N., Martinsson, P.-G., & Tropp, J. A. (2011). Finding structure with randomness: Probabilistic algorithms for constructing approximate matrix decompositions. *SIAM Review*, 53(2), 217–288. | Randomized SVD: modern large-scale linear algebra. | P-II/P-III | Randomized range finder vs truncated SVD: error vs oversampling. |

## B. 偏微分方程离散 PDE Discretization

| # | Citation | Why it matters | Phase | Reproduction task |
|---|---|---|---|---|
| B1 | Courant, R., Friedrichs, K., & Lewy, H. (1928). Über die partiellen Differenzengleichungen der mathematischen Physik. *Mathematische Annalen*, 100, 32–74. English translation: *IBM Journal of Research and Development*, 11(2), 215–234 (1967). | CFL condition: the numerical domain of dependence must contain the physical one. | P-II | Upwind advection: show blow-up just past CFL = 1. |
| B2 | Crank, J., & Nicolson, P. (1947). A practical method for numerical evaluation of solutions of partial differential equations of the heat-conduction type. *Proceedings of the Cambridge Philosophical Society*, 43(1), 50–67. | Second-order, unconditionally stable implicit scheme for diffusion. | P-II | FTCS vs BTCS vs CN: stability and convergence order for the heat equation. |
| B3 | Lax, P. D., & Richtmyer, R. D. (1956). Survey of the stability of linear finite difference equations. *Communications on Pure and Applied Mathematics*, 9(2), 267–293. | Lax equivalence theorem: consistency + stability ⇔ convergence. | P-II | Write out the proof sketch; verify numerically with B2. |
| B4 | Lax, P., & Wendroff, B. (1960). Systems of conservation laws. *Communications on Pure and Applied Mathematics*, 13(2), 217–237. | Conservative schemes and weak-solution convergence (Lax–Wendroff theorem). | P-III | Lax–Wendroff vs upwind on a square wave: dispersion vs diffusion. |
| B5 | Godunov, S. K. (1959). A difference method for numerical calculation of discontinuous solutions of the equations of hydrodynamics. *Matematicheskii Sbornik*, 47(89)(3), 271–306. | Riemann-solver-based FVM. Godunov's theorem limits linear monotone schemes to first order. | P-III/P-IV | Godunov scheme for Burgers' equation; shock speed vs Rankine–Hugoniot. |
| B6 | Courant, R. (1943). Variational methods for the solution of problems of equilibrium and vibrations. *Bulletin of the American Mathematical Society*, 49(1), 1–23. | Mathematical origin of the finite element method (piecewise-linear trial functions). | P-III | 1-D P1 FEM for −u″ = f; observe O(h²) L² error. |
| B7 | Patankar, S. V., & Spalding, D. B. (1972). A calculation procedure for heat, mass and momentum transfer in three-dimensional parabolic flows. *International Journal of Heat and Mass Transfer*, 15(10), 1787–1806. | SIMPLE pressure–velocity coupling, used across OpenFOAM-style solvers. | P-IV | Trace SIMPLE in OpenFOAM's `simpleFoam`; relate it to Ferziger–Perić–Street. |
| B8 | Strang, G. (1968). On the construction and comparison of difference schemes. *SIAM Journal on Numerical Analysis*, 5(3), 506–517. | Strang (operator) splitting, used in reaction–diffusion and split-step Fourier for the Schrödinger equation. | P-III | Split-step Fourier for the 1-D nonlinear Schrödinger equation; verify 2nd order. |
| B9 | Dahlquist, G. (1963). A special stability problem for linear multistep methods. *BIT Numerical Mathematics*, 3, 27–43. | A-stability and the second Dahlquist barrier, the theory behind stiff solvers. | P-II | Stability regions of AB2, BDF2, trapezoid; plot them in the complex plane. |

## C. 物理计算 Physics-Based Computation (MC, MD, DFT)

| # | Citation | Why it matters | Phase | Reproduction task |
|---|---|---|---|---|
| C1 | Metropolis, N., Rosenbluth, A. W., Rosenbluth, M. N., Teller, A. H., & Teller, E. (1953). Equation of state calculations by fast computing machines. *Journal of Chemical Physics*, 21(6), 1087–1092. | Metropolis algorithm, the founding paper of MCMC. | P-II/P-III | 2-D Ising model: magnetization vs T; locate T_c ≈ 2.269 J/k_B. |
| C2 | Verlet, L. (1967). Computer "experiments" on classical fluids. I. Thermodynamical properties of Lennard-Jones molecules. *Physical Review*, 159(1), 98–103. | Verlet integration and neighbor lists: the foundations of MD. | P-III | Velocity-Verlet LJ fluid in NumPy; energy drift vs Δt; compare with LAMMPS. |
| C3 | Hohenberg, P., & Kohn, W. (1964). Inhomogeneous electron gas. *Physical Review*, 136(3B), B864–B871. | Density as the fundamental variable: the existence theorems of DFT. | P-IV | Read with Martin (C15 in textbooks.md). |
| C4 | Kohn, W., & Sham, L. J. (1965). Self-consistent equations including exchange and correlation effects. *Physical Review*, 140(4A), A1133–A1138. | Kohn–Sham equations: the nonlinear eigenproblem every DFT code solves. | P-IV | SCF loop for a 1-D model system (harmonic well + LDA-like term); then Si in QE. |
| C5 | Perdew, J. P., Burke, K., & Ernzerhof, M. (1996). Generalized gradient approximation made simple. *Physical Review Letters*, 77(18), 3865–3868. | PBE functional, the default XC functional in practice. | P-IV | LDA vs PBE lattice constant of Si in QE. |
| C6 | Car, R., & Parrinello, M. (1985). Unified approach for molecular dynamics and density-functional theory. *Physical Review Letters*, 55(22), 2471–2474. | Ab initio MD. | P-IV (optional) | Read only. |
| C7 | Behler, J., & Parrinello, M. (2007). Generalized neural-network representation of high-dimensional potential-energy surfaces. *Physical Review Letters*, 98(14), 146401. | Machine-learned interatomic potentials, bridging DFT accuracy and MD scale. | P-IV | Read; survey current ML-potential packages supported by LAMMPS. |
| C8 | Fermi, E., Pasta, J., & Ulam, S. (1955). *Studies of nonlinear problems* (Los Alamos Report LA-1940). | One of the first computer experiments; nonlinear lattice dynamics and recurrence. | P-II/P-III | Simulate FPU-α chain; plot modal energies vs time. |

## D. 动力学、信号与估计 Dynamics, Signals & Estimation

| # | Citation | Why it matters | Phase | Reproduction task |
|---|---|---|---|---|
| D1 | Lorenz, E. N. (1963). Deterministic nonperiodic flow. *Journal of the Atmospheric Sciences*, 20(2), 130–141. | Deterministic chaos and sensitive dependence. | P-II | Lorenz attractor; estimate largest Lyapunov exponent. |
| D2 | Turing, A. M. (1952). The chemical basis of morphogenesis. *Philosophical Transactions of the Royal Society of London B*, 237(641), 37–72. | Diffusion-driven instability: linear stability analysis of PDEs. | P-II/P-III | 2-D Gray–Scott or Schnakenberg model; check the predicted unstable wavenumbers. |
| D3 | Kalman, R. E. (1960). A new approach to linear filtering and prediction problems. *Journal of Basic Engineering*, 82(1), 35–45. | Kalman filter: optimal state estimation that combines linear algebra, probability and ODE. | P-II/P-IV | Track a noisy 2-D projectile; compare KF estimate with raw measurements; check NEES consistency. |
| D4 | Shannon, C. E. (1949). Communication in the presence of noise. *Proceedings of the IRE*, 37(1), 10–21. | Sampling theorem: the basis for discretizing signals and fields. | P-II | Demonstrate aliasing in FFT of undersampled sinusoid. |
| D5 | Schmid, P. J. (2010). Dynamic mode decomposition of numerical and experimental data. *Journal of Fluid Mechanics*, 656, 5–28. | DMD: data-driven modal analysis of flows. | P-IV | DMD on cylinder-wake snapshots (from own OpenFOAM run). |
| D6 | Brunton, S. L., Proctor, J. L., & Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS*, 113(15), 3932–3937. | SINDy: sparse regression recovers ODEs from data. | P-IV | Recover the Lorenz equations from simulated trajectories (D1). |

## E. 器件与工程 Devices & Engineering

| # | Citation | Why it matters | Phase | Reproduction task |
|---|---|---|---|---|
| E1 | Shockley, W. (1949). The theory of p-n junctions in semiconductors and p-n junction transistors. *Bell System Technical Journal*, 28(3), 435–489. | Ideal diode equation; drift-diffusion picture of junctions. | P-IV | Derive the ideal diode I–V; compare with numerical drift-diffusion (E2). |
| E2 | Scharfetter, D. L., & Gummel, H. K. (1969). Large-signal analysis of a silicon Read diode oscillator. *IEEE Transactions on Electron Devices*, 16(1), 64–77. | Scharfetter–Gummel exponential fitting, the stable discretization of drift-diffusion used in every TCAD tool. | P-IV | 1-D p–n diode: Poisson + continuity with SG flux, Gummel iteration; I–V curve vs Shockley. |
| E3 | Weller, H. G., Tabor, G., Jasak, H., & Fureby, C. (1998). A tensorial approach to computational continuum mechanics using object-oriented techniques. *Computers in Physics*, 12(6), 620–631. | Design paper behind OpenFOAM's field/operator abstraction. | P-IV | Map `fvm::ddt`, `fvm::laplacian` to FVM operators from LeVeque/Ferziger. |

## F. 科学机器学习 Scientific Machine Learning

| # | Citation | Why it matters | Phase | Reproduction task |
|---|---|---|---|---|
| F1 | Hornik, K., Stinchcombe, M., & White, H. (1989). Multilayer feedforward networks are universal approximators. *Neural Networks*, 2(5), 359–366. (See also Cybenko, G. (1989), *Mathematics of Control, Signals, and Systems*, 2(4), 303–314.) | Universal approximation: why NNs can represent PDE solutions, and what the theorem does *not* guarantee. | P-IV | Read; note the gap between approximation, optimization and generalization. |
| F2 | Baydin, A. G., Pearlmutter, B. A., Radul, A. A., & Siskind, J. M. (2018). Automatic differentiation in machine learning: A survey. *Journal of Machine Learning Research*, 18(153), 1–43. | Forward vs reverse mode AD, the engine of PINNs and differentiable simulation. | P-III/P-IV | Implement forward-mode AD with dual numbers; compare with `jax.jvp`. |
| F3 | Kingma, D. P., & Ba, J. (2015). Adam: A method for stochastic optimization. *ICLR 2015*. arXiv:1412.6980. | Default optimizer for PINN/operator training. | P-IV | Adam vs L-BFGS on a PINN loss. |
| F4 | Chen, R. T. Q., Rubanova, Y., Bettencourt, J., & Duvenaud, D. (2018). Neural ordinary differential equations. *NeurIPS 2018*. arXiv:1806.07366. | Continuous-depth models; adjoint method for gradients through ODE solvers. | P-IV | Derive the adjoint equations; fit a neural ODE to a damped oscillator. |
| F5 | Raissi, M., Perdikaris, P., & Karniadakis, G. E. (2019). Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations. *Journal of Computational Physics*, 378, 686–707. | PINNs: PDE residual as soft constraint; forward and inverse problems. | P-IV | 1-D viscous Burgers forward problem; inverse problem identifying ν. Compare accuracy and cost with an FDM solver. |
| F6 | Li, Z., Kovachki, N., Azizzadenesheli, K., Liu, B., Bhattacharya, K., Stuart, A., & Anandkumar, A. (2021). Fourier neural operator for parametric partial differential equations. *ICLR 2021*. arXiv:2010.08895 (preprint 2020). | Learns solution operators with FFT-based layers; resolution-invariant surrogates. | P-IV | FNO on 1-D Burgers / 2-D Darcy; test zero-shot super-resolution. |
| F7 | Lu, L., Jin, P., Pang, G., Zhang, Z., & Karniadakis, G. E. (2021). Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators. *Nature Machine Intelligence*, 3, 218–229. | Branch/trunk operator networks. | P-IV | DeepONet for antiderivative operator; compare with FNO. |
| F8 | Karniadakis, G. E., Kevrekidis, I. G., Lu, L., Perdikaris, P., Wang, S., & Yang, L. (2021). Physics-informed machine learning. *Nature Reviews Physics*, 3, 422–440. | Survey: how physical priors enter ML, and where the field stands. | P-IV | Read first in the SciML block as a map of the field. |
| F9 | Wang, S., Teng, Y., & Perdikaris, P. (2021). Understanding and mitigating gradient flow pathologies in physics-informed neural networks. *SIAM Journal on Scientific Computing*, 43(5), A3055–A3081. | Why PINNs fail (unbalanced loss gradients) and adaptive weighting. | P-IV | Reproduce imbalance on Helmholtz; apply learning-rate annealing. |
| F10 | Krishnapriyan, A. S., Gholami, A., Zhe, S., Kirby, R. M., & Mahoney, M. W. (2021). Characterizing possible failure modes in physics-informed neural networks. *NeurIPS 2021*. arXiv:2109.01050. | Failure modes on convection/reaction problems; curriculum regularization. | P-IV | Convection equation with increasing β; observe failure, then apply the fix. |

## G. 软件引用论文 Software Citation Papers (cite when you use the tool)

| Tool | Citation |
|---|---|
| NumPy | Harris, C. R., et al. (2020). Array programming with NumPy. *Nature*, 585, 357–362. |
| SciPy | Virtanen, P., et al. (2020). SciPy 1.0: Fundamental algorithms for scientific computing in Python. *Nature Methods*, 17, 261–272. |
| PyTorch | Paszke, A., et al. (2019). PyTorch: An imperative style, high-performance deep learning library. *NeurIPS 2019*. |
| Quantum ESPRESSO | Giannozzi, P., et al. (2009). QUANTUM ESPRESSO: a modular and open-source software project for quantum simulations of materials. *Journal of Physics: Condensed Matter*, 21(39), 395502. (Also Giannozzi et al. 2017, *J. Phys.: Condens. Matter* 29, 465901 `[NEEDS VERIFICATION: page/article no.]`.) |
| LAMMPS | Thompson, A. P., et al. (2022). LAMMPS — a flexible simulation tool for particle-based materials modeling at the atomic, meso, and continuum scales. *Computer Physics Communications*, 271, 108171. |
| OpenFOAM | Weller et al. (1998), see E3. |
| FEniCSx / DOLFINx | Baratta, I. A., et al. (2023). DOLFINx: The next generation FEniCS problem solving environment. Preprint, Zenodo `[NEEDS VERIFICATION: final venue]`. Check the "Citing" page on fenicsproject.org. |

## H. 阅读方法 How to Read a Paper Here

1. **Three passes:** (i) abstract, figures, conclusion; (ii) the derivation, re-derived in `derivations/`; (iii) reproduction in `experiments/` with a convergence or validation plot.
2. Write a one-page note per paper: problem → key idea → assumptions → what breaks → link to the curriculum module.

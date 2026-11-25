# 公开大学课程 Open University Courses

> 只列真实、公开、可获取的课程 Only real, publicly accessible courses.
> URLs are given at **domain level only**. Search the course number on the platform. Course terms and codes I could not confirm are marked `[NEEDS VERIFICATION]`.
> Phase codes (P-I … P-IV): see [textbooks.md](textbooks.md#0-约定-conventions).

## 1. MIT OpenCourseWare (ocw.mit.edu)

### 1.1 Mathematics 数学

| Code | Title | Instructor | OCW version | Phase | Paired text | Use 用法 |
|---|---|---|---|---|---|---|
| 18.06 / 18.06SC | Linear Algebra | Gilbert Strang | Spring 2010 (video lectures); 18.06SC Fall 2011 (Scholar version: recitations + problem sets) | P-I | Strang ILA (M1) | Core lecture spine for linear algebra. |
| 18.065 | Matrix Methods in Data Analysis, Signal Processing, and Machine Learning | Gilbert Strang | Spring 2018 | P-II | Strang, *Linear Algebra and Learning from Data* (2019) | SVD/low-rank, least squares, gradient methods; bridge to SciML. |
| 18.02 / 18.02SC | Multivariable Calculus | Denis Auroux | Fall 2007; 18.02SC Fall 2010 | P-I | Stewart Ch. 12–16 (M5) | Lectures plus Scholar problem sets. |
| 18.03 / 18.03SC | Differential Equations | Arthur Mattuck et al. | 18.03 Spring 2006 `[NEEDS VERIFICATION: term]`; 18.03SC Fall 2011 | P-II | Boyce–DiPrima (M11) | Linear ODEs, Laplace, Fourier, systems. Mattuck's lectures are classics. |
| 18.04 | Complex Variables with Applications | Jeremy Orloff | Spring 2018 | P-II | Needham (M8), RHB Ch. 24–25 | Residues, conformal maps, Laplace inversion. |
| 18.085 | Computational Science and Engineering I | Gilbert Strang | Fall 2008 | P-II | Strang CSE (C6) | AᵀCA framework, FDM, Fourier, least squares. |
| 18.086 | Mathematical Methods for Engineers II | Gilbert Strang | Spring 2006 | P-III | Strang CSE (C6) | Time-stepping, conservation laws, multigrid, Krylov methods. |
| 18.303 | Linear Partial Differential Equations: Analysis and Numerics | Steven G. Johnson | Fall 2010 `[NEEDS VERIFICATION: term]` | P-II/P-III | Haberman (M13), LeVeque FDM (C7) | Operator/eigenfunction view of PDEs, implemented numerically. |
| 18.335J | Introduction to Numerical Methods | P.-O. Persson; S. G. Johnson | Fall 2010 (Persson); a later Johnson offering `[NEEDS VERIFICATION: term]` | P-II | Trefethen–Bau (C1) | Follows Trefethen–Bau closely. |
| 18.05 | Introduction to Probability and Statistics | Jeremy Orloff, Jonathan Bloom | Spring 2014 | P-I | Blitzstein–Hwang (M15) | Frequentist and Bayesian basics with R/Python studios. |
| 6.041 / 6.041SC | Probabilistic Systems Analysis and Applied Probability | John Tsitsiklis | Fall 2010; 6.041SC Fall 2013 | P-I/P-II | Bertsekas–Tsitsiklis, *Introduction to Probability* | Engineering-flavored probability: inference, Markov chains. |
| 18.650 | Statistics for Applications | Philippe Rigollet | Fall 2016 | P-II | Wasserman (M16) | MLE, hypothesis testing, Bayesian statistics, regression. |
| 18.337J / 6.338J | Parallel Computing and Scientific Machine Learning | Christopher Rackauckas | Spring 2020 `[NEEDS VERIFICATION: OCW term]` | P-IV | Brunton–Kutz (C16) | Automatic differentiation, neural ODEs, PINNs, performance engineering. |

### 1.2 Physics 物理

| Code | Title | Instructor | OCW version | Phase | Paired text |
|---|---|---|---|---|---|
| 8.03 / 8.03SC | Physics III: Vibrations and Waves | Yen-Jie Lee | Fall 2016 | P-III | French (H3) |
| 8.02 | Physics II: Electricity and Magnetism | Walter Lewin (2002); later 8.02SC | Spring 2002 / 8.02SC `[NEEDS VERIFICATION: SC term]` | P-III (review) | Griffiths EM (H4) |
| 8.04 | Quantum Physics I | Allan Adams (Spring 2013); Barton Zwiebach (Spring 2016) | Spring 2013; Spring 2016 | P-III | Griffiths–Schroeter (H6) |
| 8.05 | Quantum Physics II | Barton Zwiebach | Fall 2013 | P-III/P-IV | Griffiths–Schroeter / Sakurai |
| 8.044 | Statistical Physics I | — | Spring 2013 `[NEEDS VERIFICATION: term & instructor]` | P-III | Kittel–Kroemer (H8) |
| 8.09 | Classical Mechanics III | — | `[NEEDS VERIFICATION: term & instructor]` | P-III (optional) | Taylor (H1), Goldstein (H2) |

### 1.3 Engineering & computation 工程与计算

| Code | Title | Instructor | OCW version | Phase | Use |
|---|---|---|---|---|---|
| RES.2-002 | Finite Element Procedures for Solids and Structures | Klaus-Jürgen Bathe | 2010 `[NEEDS VERIFICATION: year]` | P-IV | Video lectures on engineering FEM; complements Hughes (C9). |
| 2.29 | Numerical Fluid Mechanics | Pierre Lermusiaux | Spring 2015 `[NEEDS VERIFICATION: term]` | P-IV | FD/FV for fluids; complements Ferziger–Perić–Street (C13). |
| 6.720J / 3.43J | Integrated Microelectronic Devices | Jesús A. del Alamo | Spring 2007 `[NEEDS VERIFICATION: term]` | P-IV | Device physics with drift-diffusion; complements Streetman (E1). |
| 3.320 | Atomistic Computer Modeling of Materials | Gerbrand Ceder, Nicola Marzari | Spring 2005 `[NEEDS VERIFICATION: term]` | P-IV | MD, Monte Carlo, DFT in practice. |
| 6.7201 | (code listed in the project brief) | — | `[NEEDS VERIFICATION]`: I could not confirm this code's title or OCW availability after MIT's 2022 renumbering | — | Use **Stanford EE364a** (below) as the authoritative optimization course. |

## 2. Stanford

| Code | Title | Instructor | Access | Phase | Paired text |
|---|---|---|---|---|---|
| EE364a | Convex Optimization I | Stephen Boyd | Course site on web.stanford.edu (slides, homework, CVXPY exercises); recorded lectures publicly available | P-II/P-III | Boyd–Vandenberghe *Convex Optimization* (M19) |
| EE263 | Introduction to Linear Dynamical Systems | Stephen Boyd | Archived lecture notes and videos | P-II | Boyd–Vandenberghe VMLS (M3); least squares, SVD, state-space |
| CS229 | Machine Learning | (various) | Public lecture notes / videos | P-IV (optional) | Goodfellow (C17) |

## 3. Harvard

| Code | Title | Instructor | Access | Phase | Paired text |
|---|---|---|---|---|---|
| Stat 110 | Probability | Joseph Blitzstein | stat110.net (lecture videos, handouts, practice problems with solutions); HarvardX edX version | P-I/P-II | Blitzstein–Hwang (M15). The lecture–book pairing is exact. |
| AM 205 | Advanced Scientific Computing: Numerical Methods | (e.g., Chris Rycroft) | `[NEEDS VERIFICATION: public availability of materials]` | P-II | Heath (C2) |

## 4. University of Cambridge — Mathematical Tripos

Official schedules are on the Faculty of Mathematics site (maths.cam.ac.uk). Lectures themselves are not public, so use the two public note sources below.

| Source | Courses most relevant to MPCE | Phase |
|---|---|---|
| **David Tong, DAMTP lecture notes** (www.damtp.cam.ac.uk, under "user/tong") | Vector Calculus (IA); Dynamics and Relativity (IA); Electromagnetism (IB); Quantum Mechanics (IB); Classical Dynamics (II); Statistical Physics (II); Applications of Quantum Mechanics (II); Kinetic Theory (III); Fluid Mechanics `[NEEDS VERIFICATION: course level]` | P-I → P-IV |
| **Dexter Chua, unofficial typeset notes** (dec41.user.srcf.net) | Part IB: Linear Algebra, Methods, Complex Methods, Complex Analysis, Numerical Analysis, Markov Chains, Statistics, Fluid Dynamics, Quantum Mechanics, Electromagnetism. Part II: Further Complex Methods, Numerical Analysis, Asymptotic Methods, Dynamical Systems, Statistical Physics, Electrodynamics, Fluid Dynamics | P-I → P-III |

**Recommended Cambridge pairings:**
- IB *Methods* → companion to Haberman/RHB (Fourier series, Sturm–Liouville, Green's functions, PDE).
- IB/II *Numerical Analysis* → companion to Süli–Mayers (C3); same tradition.
- IB *Complex Methods* → companion to Needham (computational residue calculus).

## 5. 其他高质量公开资源 Other High-Quality Open Resources

| Resource | Provider | Phase | Use |
|---|---|---|---|
| *CFD Python: 12 Steps to Navier–Stokes* | Lorena A. Barba (Jupyter notebooks, GitHub `barbagroup`) | P-III | Build a 2-D incompressible solver from 1-D linear convection upward. |
| *Practical Numerical Methods with Python* ("numerical-mooc") | Barba et al., George Washington University | P-II/P-III | Notebook course on ODE/PDE discretization. |
| FEniCSx Tutorial | Jørgen S. Dokken (jsdokken.com) | P-III/P-IV | Current DOLFINx tutorial. Replaces the legacy FEniCS book for code. |
| nanoHUB-U courses (e.g., M. Lundstrom on semiconductor fundamentals; S. Datta on nanoelectronics) | Purdue University (nanohub.org) | P-IV | Device physics and transport with simulation tools. |
| *Computers, Waves, Simulations* | Heiner Igel, LMU Munich (Coursera) | P-III | FD, pseudospectral, FV, FEM, DG for the wave equation, compared side by side. |
| *Essence of Linear Algebra* / *Essence of Calculus* | Grant Sanderson (3Blue1Brown, YouTube) | P-I | Geometric intuition only. Not a substitute for problem sets. |

## 6. 使用策略 How to Use

1. **一门主课 + 一本主教材 One lecture spine + one primary book per module.** Do not watch two lecture series on the same topic.
2. Do the **problem sets with solutions** (18.06SC, 18.02SC, 18.03SC, Stat 110 practice problems). They are worth more than the videos.
3. For every course, port at least one assignment to Python/NumPy and save it under the module's `experiments/` folder.

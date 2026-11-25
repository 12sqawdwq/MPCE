# 01 数学核心 Mathematics Core

> 对应 [`ROADMAP.md`](../ROADMAP.md) 的 **Phase I (M1–M2)** 与 **Phase II (M3–M4)** 主干，同时 **Probability（概率统计）**、**Optimization（优化）** 与 **Numerical Analysis（数值分析）** 将贯穿至 **Phase V–VI** 交织深化。
> Goal 目标: (1) derive the governing equations of physics and engineering models, (2) solve them analytically where possible, and (3) discretize them and solve numerically with error control.

## 1. 模块索引 Module Index

| Module | Path | Scope 范围 | Phase / Months | Est. hours |
|---|---|---|---|---|
| Linear Algebra & Matrix Analysis 线性代数与矩阵分析 | [linear_algebra/curriculum.md](linear_algebra/curriculum.md) | Subspaces, factorizations, eigen/SVD, least squares, positive definiteness, matrix norms & perturbation | P-I: M1–M4 (+ P-II revisit) | ~180 h |
| Multivariable & Vector Calculus + Complex Analysis 多元/向量微积分 + 复分析 | [calculus/curriculum.md](calculus/curriculum.md) | Gradients/Jacobians, multiple integrals, div/grad/curl, integral theorems, curvilinear coords; analytic functions, residues, conformal maps | P-I: M2–M6 (vector); P-II: M8–M9 (complex) | ~160 h |
| Differential Equations 微分方程 | [differential_equations/curriculum.md](differential_equations/curriculum.md) | ODE, linear systems, Laplace, dynamical systems, Fourier series/transform, PDE (heat/wave/Laplace), Sturm–Liouville, Green's functions | P-I: M5–M6 (ODE intro); P-II: M7–M12 | ~230 h |
| Probability & Statistics 概率与统计 | [probability_statistics/curriculum.md](probability_statistics/curriculum.md) | Probability, random variables, limit theorems, estimation, Bayesian inference, Markov chains, MCMC, intro stochastic processes | Interleaved: M3–M6 (foundations), M9–M12 (inference/stochastic) | ~140 h |
| Numerical Analysis 数值分析 | [numerical_analysis/curriculum.md](numerical_analysis/curriculum.md) | Floating point, conditioning/stability, numerical linear algebra, root finding, interpolation/quadrature, ODE integrators, FDM intro | Interleaved: M1–M6 (foundations), M8–M12 (NLA + discretization) | ~170 h |

**Total ≈ 880 h over 12 months ≈ 17 h/week.** Hours include reading, problem sets, derivations and code.

## 2. 依赖关系 Dependency Diagram

```mermaid
flowchart TD
    LA1["Linear Algebra I: Ax=b, subspaces, orthogonality"] --> LA2["Linear Algebra II: eigen, SVD, positive definite"]
    VC1["Multivariable Calculus: gradient, Jacobian, multiple integrals"] --> VC2["Vector Calculus: div, grad, curl, Gauss/Stokes"]
    LA1 --> VC1
    NC1["Numerical Foundations: floating point, conditioning, Python/NumPy"] --> NLA["Numerical Linear Algebra: QR, eigen-algorithms, Krylov"]
    LA2 --> NLA
    P1["Probability I: random variables, expectation, limit theorems"] --> P2["Probability II: estimation, Bayes, Markov chains, MCMC"]
    LA2 --> P2
    LA2 --> ODE["ODE and Linear Systems: x' = Ax, Laplace transform"]
    VC1 --> ODE
    ODE --> DYN["Dynamical Systems: phase plane, bifurcation, chaos"]
    ODE --> FOU["Fourier Series and Transform"]
    CA["Complex Analysis: analytic functions, residues, conformal maps"] --> FOU
    VC2 --> PDE["PDE: heat, wave, Laplace; separation of variables"]
    FOU --> PDE
    PDE --> SL["Sturm-Liouville and Green's Functions"]
    LA2 --> SL
    NC1 --> NODE["Numerical ODE: RK, multistep, stiffness"]
    ODE --> NODE
    NODE --> FDM["Finite Differences for PDE: consistency, stability, convergence"]
    PDE --> FDM
    NLA --> FDM
    SL --> PHYS["02 Physics Core"]
    DYN --> PHYS
    P2 --> PHYS
    FDM --> COMP["03 Computational Methods"]
    P2 --> COMP
```

## 3. 月度安排 Month-by-Month Sketch

| Month | Main thread 主线 | Interleaved 穿插 |
|---|---|---|
| M1 | LA: vectors, elimination, LU | NC: Python/NumPy, floating point |
| M2 | LA: four subspaces, orthogonality, least squares; Calc: vectors, partial derivatives | NC: conditioning, error analysis |
| M3 | LA: determinants, eigenvalues; Calc: multiple integrals, change of variables | Prob: counting, conditional probability, Bayes |
| M4 | LA: symmetric/PD, SVD, applications; Calc: line integrals, Green | Prob: random variables, expectation |
| M5 | Calc: div/curl, Gauss/Stokes, curvilinear coords; ODE: 1st-order, 2nd-order linear | Prob: continuous distributions, joint, transformations |
| M6 | ODE: systems x′ = Ax, matrix exponential; **P-I review and capstone** | Prob: limit theorems; NC: root finding, interpolation, quadrature |
| M7 | ODE: Laplace transform, nonlinear systems, stability | NC: numerical ODE (RK, stiffness) |
| M8 | Dynamics: phase plane, bifurcation, limit cycles, chaos; Complex: analytic functions | NC: NLA (QR, Householder, least squares stability) |
| M9 | Complex: Cauchy, residues, conformal maps; Fourier series | Prob: estimation (MLE, bias/variance) |
| M10 | Fourier transform; PDE: heat/wave/Laplace, separation of variables | NC: eigenvalue algorithms, sparse matrices, Krylov intro; Prob: Bayesian inference |
| M11 | PDE: Sturm–Liouville, nonhomogeneous problems, Green's functions | NC: FDM for BVP/heat/wave, stability (von Neumann); Prob: Markov chains |
| M12 | PDE: transforms on infinite domains, characteristics; **P-II review and capstone** | Prob: MCMC, Brownian motion / random walk → diffusion |

## 4. 每个模块的统一结构 Uniform Module Structure

Every `curriculum.md` contains the same 11 sections:
1. Primary Textbook 主教材 · 2. Supplementary Textbook 辅助教材 · 3. Official Course Resources 官方课程资源 · 4. Must-Study Chapters/Topics 必修章节 · 5. Optional/Skippable 可选/可跳过 · 6. Prerequisites 先修关系 · 7. Estimated Study Hours 学时 · 8. Mathematical Derivation Tasks 数学推导 · 9. Physical Modeling Tasks 物理建模 · 10. Programming/Computational Experiments 编程实验 · 11. Engineering Application Mapping 工程应用映射

Suggested sub-folders per module (create as work begins): `notes/`, `derivations/`, `experiments/`, `problem_sets/`.

## 5. 阶段验收 Phase Exit Criteria

- **P-I exit (M6):** compute and interpret the SVD of a data matrix; state and apply the divergence theorem in curvilinear coordinates; solve x′ = Ax via eigen-decomposition and e^{At}; explain why `np.linalg.solve` can lose digits (condition number).
- **P-II exit (M12):** solve the heat equation on a bounded domain by eigenfunction expansion *and* by a stable FDM scheme with a demonstrated convergence order; evaluate a real integral by residues; classify fixed points of a 2-D nonlinear system; run a Metropolis sampler and diagnose convergence.

## 6. 参考 References

See [`../07_references/`](../07_references/): textbooks, university courses, software documentation, research papers.

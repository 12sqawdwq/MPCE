# Changelog | 更新日志

本文件记录 MPCE 知识库的结构演进、内容里程碑与审查记录。遵循 [Semantic Versioning](https://semver.org/) 风格，区分**知识库内容更新**与**学习者个人掌握进度**（后者仅在 [`ROADMAP.md`](ROADMAP.md) 中由学习者本人维护）。

---

## [Unreleased]

### Added — Prerequisite Notes
- `01_mathematics/calculus/taylor_formula.md`（泰勒公式：系数匹配与分部积分两种推导、拉格朗日余项、常用展开、数值方法中的应用与练习）
- `01_mathematics/calculus/fundamental_theorem_and_integration.md`（微积分基本定理的严格推导、高维推广、换元与分部积分及部分分式、在 FEM 弱形式与 Euler–Lagrange 方程中的应用与练习）
- `02_physics/university_physics/`（大学物理基础文件树：总览大纲与按学习顺序编号的力学、振动与波、热学、电磁学、光学、近代物理 6 篇知识清单与自测）
- Wiki 侧边栏按学科目录嵌套显示，并按 `Phase` 字段显示层级标签

---

## [0.2.0] — 2026-11-25（Milestone 1 完整交付 + Milestone 2 数学核心首批内容）

### Added — Architecture, References & Knowledge Graph (Claude + Gemini Review)
- **治理与学习体系**：`README.md`、`ROADMAP.md`（18–24 个月 Phase I–VII 双轨追踪）、`CONTRIBUTING.md`、`GLOSSARY.md`（105 项中英双语核心术语）、`00_getting_started/`（`learning_strategy.md`、`prerequisite_map.md`、`study_workflow.md`）。
- **参考资源库**：`07_references/`（`textbooks.md`、`university_courses.md`、`software_documentation.md`、`research_papers.md`），真实教材/课程/论文核验，不确定项统一标注 `[NEEDS VERIFICATION]`。
- **章节级课程大纲**：`01_mathematics/README.md` 及 5 份 11 要素章节级大纲（`linear_algebra`、`calculus`、`differential_equations`、`probability_statistics`、`numerical_analysis`）；`02_physics/README.md`、`03_computational_methods/README.md`、`04_engineering_applications/README.md`。
- **跨领域知识图谱**：`KNOWLEDGE_GRAPH.md`、`06_knowledge_graph/`（4 份分层图谱共 67 个注册节点 + `backlog.md`）及自动化一致性与无环校验脚本 `scripts/validate_kg.py`（67/67 ID 一致，DAG 无环）。

### Added — Mathematics Core Derivations (Standard 10-Section Template)
- `01_mathematics/linear_algebra/linear_least_squares.md`
- `01_mathematics/linear_algebra/eigenvalue_problems.md`
- `01_mathematics/differential_equations/fourier_transform.md`
- `01_mathematics/differential_equations/heat_equation.md`
- `01_mathematics/differential_equations/wave_equation.md`

### Added — Verified Runnable Computational Experiments
- `05_experiments/README.md`（15 个规划实验总目录与运行规范）
- `05_experiments/linear_algebra/01_matrix_decomposition/`（LU/Cholesky/QR/Eig/SVD 精度与病态 Hilbert 矩阵条件数验证）
- `05_experiments/linear_algebra/02_pca_svd_compression/`（SVD 低秩压缩与 Eckart–Young–Mirsky 定理验证）
- `05_experiments/dynamics/03_numerical_ode_solver/`（Forward/Backward Euler、RK4、Velocity Verlet 收敛阶与 100 周期辛能量守恒验证）
- `05_experiments/heat_transfer/06_2d_heat_equation/`（二维热方程 FTCS 空间二阶收敛与 von Neumann 稳定界验证）

### Reviewed & Polished (Gemini)
- 统一全库阶段编号为 `ROADMAP.md` 的 **Phase I–VII** 体系，消除跨文档 `P-I..P-IV` 与 `Phase I–VII` 冲突。
- 对齐 `02_physics/`、`03_computational_methods/`、`04_engineering_applications/` README 中的子目录路径至仓库实际目录树。
- 补齐 `README.md` 索引、`06_knowledge_graph/backlog.md` 与 `scripts/validate_kg.py`。
- 独立复跑全部 4 个计算实验脚本，验证退出码均为 `0` 且全部断言通过。

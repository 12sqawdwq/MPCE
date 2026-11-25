# 05_experiments — 可复现数值实验目录（Reproducible Computational Experiments）

> 每个实验都是一个**可独立运行、自带判据**的 Python 脚本：`python experiment.py` 以 exit code 0 退出 ⇔ 全部 `assert` 判据通过。
> Every experiment is a self-verifying script: exit code 0 ⇔ every verification criterion passed.
> 实验与推导文档（`01_`–`03_`）和应用领域（`04_`）双向链接；ROADMAP 中的 `E` 标记即指本目录中的实验。

---

## 1. Experiment Catalog | 实验总目录

**状态图例**：✅ **Implemented & Verified**（已实现，全部断言通过）· 📝 **Planned**（已规划，目录未建）

| ID | 实验 Experiment | 路径 Path | ROADMAP | Phase | 核心验证对象 Verification target | 状态 |
|---|---|---|---|---|---|---|
| 01 | 矩阵分解：精度、正交性与条件数 Matrix Decompositions | [`linear_algebra/01_matrix_decomposition/`](linear_algebra/01_matrix_decomposition/README.md) | I.2–I.4, V.1–V.2 | I → V | 后向误差 $O(\varepsilon)$ 与 $\kappa$ 无关；正规方程误差 $\propto\kappa^2$ | ✅ |
| 02 | PCA / SVD 物理场低秩压缩 PCA & SVD Compression | [`linear_algebra/02_pca_svd_compression/`](linear_algebra/02_pca_svd_compression/README.md) | I.3–I.4 | I | Eckart–Young–Mirsky 恒等式；PCA ≡ 中心化 SVD | ✅ |
| 03 | ODE 数值积分器与能量行为 Numerical ODE Solvers | [`dynamics/03_numerical_ode_solver/`](dynamics/03_numerical_ode_solver/README.md) | II.1, III.9, V.3 | II–III | 收敛阶 1/1/4/2；辛积分器无长期能量漂移 | ✅ |
| 04 | 弹簧-质量-阻尼系统动力学 Spring–Mass–Damper Dynamics | `dynamics/04_spring_mass_damper/` | II.1, III.1 | II–III | 欠阻尼/临界阻尼/过阻尼解析解对照；共振响应曲线 | 📝 |
| 05 | 双摆混沌动力学 Double Pendulum Simulation | `dynamics/05_double_pendulum/` | II.2, III.1 | III | Lagrange 方程导出；Lyapunov 指数与能量守恒验证 | 📝 |
| 06 | 二维热方程显式 FTCS 2D Heat Equation | [`heat_transfer/06_2d_heat_equation/`](heat_transfer/06_2d_heat_equation/README.md) | II.8, V.4 | II → V | $O(h^2)$ 收敛；von Neumann 稳定界 $r\le\tfrac12$ | ✅ |
| 07 | 二维电磁波传播（FDTD）2D Electromagnetic Wave Propagation | `electromagnetics/07_2d_em_wave_fdtd/` | III.5, III.9 | III | Yee 网格 CFL 稳定界；数值色散与解析波速对照 | 📝 |
| 08 | 有限差分 vs. 有限元对比 FDM vs. FEM Comparison | `finite_element/08_fdm_vs_fem/` | V.4, V.6, V.9 | V | Poisson 方程 $L^2$/$H^1$ 收敛阶与 Galerkin 正交性 | 📝 |
| 09 | 二维线弹性 FEM 仿真 2D Linear Elasticity Simulation | `finite_element/09_2d_elasticity/` | III.7, V.6 | III → V | 悬臂梁挠度与 Euler–Bernoulli 理论解对照；Patch test | 📝 |
| 10 | 蒙特卡洛模拟（Ising / MCMC）Monte Carlo Simulation | `semiconductor/10_monte_carlo/` | IV.4, V.7 | IV–V | 2D Ising 临界温度 $T_c\approx2.269\,J/k_B$；误差 $O(N^{-1/2})$ | 📝 |
| 11 | Kalman 滤波目标跟踪 Kalman Filter | `robotics/11_kalman_filter/` | VI.4, VI.9 | VI | 新息白性；NEES 一致性检验（$\chi^2$） | 📝 |
| 12 | 机械臂动力学与控制 Robot Manipulator Dynamics | `robotics/12_robot_manipulator/` | III.3, VI.5 | III → VI | 多刚体 Lagrange 动力学；轨迹跟踪与 LQR/MPC | 📝 |
| 13 | 简化半导体器件模型（1D p–n 结）Semiconductor Device Model | `semiconductor/13_semiconductor_device/` | IV.6, VII.1 | IV → VII | Poisson–漂移-扩散 Scharfetter–Gummel 离散；$I$–$V$ 曲线 | 📝 |
| 14 | 物理信息神经网络（PINN）Physics-Informed Neural Network | `scientific_ml/14_pinn/` | VI.7, VI.9 | VI | Burgers/热方程 PINN 与经典 FDM 精度-成本定量对比 | 📝 |
| 15 | GPU 加速数值求解器 GPU Accelerated Numerical Solver | `finite_element/15_gpu_solver/` | V.2, V.8, VII.7 | V → VII | 稀疏矩阵预条件 CG（CuPy/CUDA）；Roofline 带宽验证 | 📝 |

**进度**：4 / 15 已实现并验证（01、02、03、06）；11 / 15 为规划状态。

> Phase VII 的综合项目（VII.1–VII.7）是在上述 15 个核心实验基础上的跨领域项目级集成。

### 按 Phase 分布 | By Phase

| Phase | 实验 IDs |
|---|---|
| I 数学基础 | 01 ✅, 02 ✅ |
| II 微分方程与数学物理 | 03 ✅, 04, 06 ✅ |
| III 经典物理 | 03 ✅（辛积分器）, 05, 07, 09 |
| IV 近代物理与材料 | 10, 13 |
| V 数值数学与科学计算 | 01 ✅, 06 ✅, 08, 09, 10, 15 |
| VI AI、控制与优化 | 11, 12, 14 |
| VII 跨学科工程 | 13, 15 及跨领域综合项目 |

## 2. Environment Setup | 环境配置

| 依赖 Dependency | 最低版本 | 已测版本 Tested | 用途 |
|---|---|---|---|
| Python | 3.10 | 3.12.4 | `X \| Y` 类型注解、`from __future__ import annotations` |
| `numpy` | 1.26 | 1.26.4 | 数组、线性代数（LAPACK） |
| `scipy` | 1.11 | 1.13.1 | `scipy.linalg`（LU、选主元 QR） |
| `matplotlib` | 3.8 | 3.9.2 | 绘图（使用 `Agg` 后端，无需显示器） |
| `sympy` | 1.12 | 1.14.0 | 解析解的符号验证（实验 03、06） |

```powershell
# Windows PowerShell（在仓库根目录）
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install "numpy>=1.26" "scipy>=1.11" "matplotlib>=3.8" "sympy>=1.12"
```

```bash
# Linux / macOS
python3 -m venv .venv && source .venv/bin/activate
pip install "numpy>=1.26" "scipy>=1.11" "matplotlib>=3.8" "sympy>=1.12"
```

各实验所需库：

| 实验 | numpy | scipy | matplotlib | sympy |
|---|:-:|:-:|:-:|:-:|
| 01 | ✓ | ✓ | ✓ | |
| 02 | ✓ | ✓ | ✓ | |
| 03 | ✓ | | ✓ | ✓ |
| 06 | ✓ | | ✓ | ✓ |

## 3. Running the Experiments | 运行方式

脚本内部使用 `Path(__file__).resolve().parent / "output"`，因此**可以从任意工作目录运行**；图片写入各实验目录下的 `output/`（已被 `.gitignore` 忽略）。

单个实验：

```bash
python 05_experiments/heat_transfer/06_2d_heat_equation/experiment.py
```

全部已实现实验（任一失败即报告）：

```powershell
# PowerShell，在仓库根目录
$fail = 0
Get-ChildItem 05_experiments -Recurse -Filter experiment.py | ForEach-Object {
    Write-Host "== $($_.Directory.Name) =="
    python $_.FullName
    if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: $($_.FullName)"; $fail++ }
}
Write-Host "failures: $fail"
```

```bash
# bash，在仓库根目录
fail=0
for f in 05_experiments/*/*/experiment.py; do
    echo "== $f =="; python "$f" || { echo "FAILED: $f"; fail=$((fail+1)); }
done
echo "failures: $fail"
```

每个脚本最后一行输出 `ALL VERIFICATION CRITERIA PASSED`。建议把输出存档为 `output/run_log.txt`（如实验 03），以便 README 中的数值可追溯。

## 4. The 10-Section Verification Standard | 10 节实验文档标准

每个实验目录包含 `experiment.py`、`README.md`、`output/`。`README.md` **必须**包含以下 10 节（不适用时写明"不适用"及理由，不可缺省）：

| # | 节名 | 必含内容 |
|---|---|---|
| 1 | Experiment Objective \| 实验目标 | 验证哪条理论结论；关联的推导文档与 ROADMAP ID |
| 2 | Physical Background \| 物理背景 | 该数学问题在哪些物理/工程情境中出现 |
| 3 | Mathematical Model \| 数学模型 | 定义域、未知量、边界/初始条件、测试数据的构造 |
| 4 | Governing Equations \| 控制方程 | 方程本身、解析解或理论恒等式、判定量的定义 |
| 5 | Numerical Method \| 数值方法 | 离散格式/算法、理论精度阶、稳定性条件、复杂度 |
| 6 | Implementation & How to Run \| 实现与运行方式 | 精确依赖与版本、`python experiment.py`、代码结构、全部参数与随机种子 |
| 7 | Visualization \| 可视化说明 | `output/` 中每个图片文件名、内容与读图要点 |
| 8 | Verification \| 验证标准与结果 | 判据表（阈值 + 选取依据）；**实测**数值与 PASS 结果 |
| 9 | Error Analysis \| 误差分析 | 实测与理论的一致/偏差及其原因；截断误差 vs. 舍入误差；参数敏感性 |
| 10 | Engineering Interpretation \| 工程意义 | 工程中的用法、失效条件、经验法则；参考文献（精确到章节） |

**可复现性硬性要求**（继承自 [`study_workflow.md`](../00_getting_started/study_workflow.md) §3）：

1. 固定随机种子：`numpy.random.default_rng(42)`；无随机性的实验须声明"deterministic"。
2. 不用绝对路径；输出只写入本实验的 `output/`。
3. 收敛性实验至少 **4 个网格/步长层级**，用双对数最小二乘拟合给出收敛阶。
4. 浮点比较一律带容差，并在 §8 说明容差的选取依据（相对 $\varepsilon\approx2.2\times10^{-16}$ 的倍数，或理论界）。
5. 每个判据都以 `assert` 实现：**exit code 0 是唯一的"通过"定义**。
6. §8 中的"实测结果"必须来自实际运行输出（注明日期与版本）；未运行核对的数值标记 `[NEEDS VERIFICATION]`。

> 与 [`study_workflow.md`](../00_getting_started/study_workflow.md) §3 旧版 10 节的对应关系：目的 → §1；数学模型 → §3–4；数值方法 → §5；实现说明 + 参数设置 + 复现方法 → §6；验证基准 + 结果 → §8；分析与讨论 → §9；局限性与扩展 → §9–10。新增 §2 物理背景、§7 可视化、§10 工程意义。建议后续把 `study_workflow.md` §3 更新为本标准。

## 5. Adding a New Experiment | 新增实验流程

1. 在 [`CONTRIBUTING.md`](../CONTRIBUTING.md) 中回答 7 个必答问题。
2. 新建 `05_experiments/<子领域>/<ID>_<snake_case>/`，ID 取自 §1 目录表。
3. 写 `experiment.py`：先写判据（`assert`），再写求解器；最后输出 `ALL VERIFICATION CRITERIA PASSED`。
4. 运行并存档输出，按 §4 撰写 `README.md`，所有数字取自实际输出。
5. 更新本表状态（📝 → ✅）、[`ROADMAP.md`](../ROADMAP.md) 的 Content 列（加 `E`）以及 [`CHANGELOG.md`](../CHANGELOG.md)。

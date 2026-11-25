# 实验 01：矩阵分解的精度、正交性与条件数（Matrix Decompositions: Accuracy, Orthogonality & Conditioning）

| 属性 | 内容 |
|---|---|
| 实验 ID | 01 |
| 阶段 Phase | I（I.2 QR 与最小二乘、I.3 谱定理、I.4 SVD）→ V.1/V.2（后向稳定性、数值线性代数） |
| 状态 Status | ✅ Implemented & Verified（2026-11-25，见 §8） |
| 运行时间 Runtime | ≈ 1 s（Python 3.12.4, NumPy 1.26.4, SciPy 1.13.1） |
| 随机种子 Seed | `numpy.random.default_rng(42)` |

---

## 1. Experiment Objective | 实验目标

1. 在**良态（well-conditioned）**随机矩阵与**病态（ill-conditioned）** Hilbert 矩阵 $H_n$（$n=4,8,12$）上，比较五种分解：LU（部分选主元）、Cholesky、Householder QR（从零实现）、对称特征分解、SVD。
2. 用数值证据区分两个常被混淆的概念：
   - **后向误差（backward error）**：分解 $\hat A$ 与 $A$ 的接近程度——后向稳定算法即使在 $\kappa(A)\approx 10^{16}$ 时也能达到 $O(\varepsilon)$；
   - **前向误差（forward error）**：解 $\hat x$ 与真解 $x$ 的接近程度——受条件数放大，$\lesssim \kappa(A)\,\varepsilon$。
3. 展示最小二乘问题中**正规方程（normal equations）**将条件数平方（$\kappa(A^TA)=\kappa(A)^2$），从而比 QR/SVD 更早丧失精度。
4. 附加对照：经典 Gram–Schmidt（CGS）在病态矩阵上丧失正交性，而 Householder 不会。

## 2. Physical Background | 物理背景

几乎所有工程仿真最终都落到线性代数核心上：

- **有限元 / 有限差分**离散后得到的刚度矩阵是对称正定（SPD）的 → Cholesky 是标准直接解法；
- **结构振动模态、量子定态**是对称特征值问题 → `eigh`；
- **参数辨识、传感器标定、曲线拟合**是超定最小二乘问题 → QR 或 SVD；
- **Hilbert 矩阵**并非人造怪物：它是在 $L^2[0,1]$ 上用单项式基 $\{1,x,\dots,x^{n-1}\}$ 做最小二乘多项式拟合时的 Gram 矩阵 $H_{ij}=\int_0^1 x^{i+j-2}\,dx = 1/(i+j-1)$。它的病态性正是"用单项式基做高阶拟合"在物理建模中不可靠的根源。

## 3. Mathematical Model | 数学模型

| 分解 | 形式 | 适用条件 | 关键性质 |
|---|---|---|---|
| LU（部分选主元） | $PA = LU$ | 任意非奇异方阵 | 实践中后向稳定（增长因子通常很小） |
| Cholesky | $A = LL^T$ | $A$ 对称正定 | 无条件后向稳定；计算量为 LU 的一半 |
| Householder QR | $A = QR$，$Q^TQ=I$ | 任意 $m\ge n$ | 后向稳定；$\|Q^TQ-I\| = O(\varepsilon)$，**与 $\kappa(A)$ 无关** |
| 对称特征分解 | $A = V\Lambda V^T$ | $A=A^T$ | 谱定理：$V$ 正交、$\Lambda$ 实 |
| SVD | $A = U\Sigma V^T$ | 任意矩阵 | $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$ |

测试矩阵：

- `Random general 100x100`：$G_{ij}\sim\mathcal N(0,1)$；
- `Random SPD 100x100`：$S = MM^T/n + I$（$\kappa\approx 4.8$）；
- Hilbert 矩阵 $H_n$，$n=4,8,12$（$\kappa_2 \approx 1.6\times10^4,\ 1.5\times10^{10},\ 1.6\times10^{16}$）；
- 最小二乘族：$A = U\,\mathrm{diag}(\sigma)\,V^T \in\mathbb R^{60\times12}$，$\sigma_i$ 在 $[1/\kappa, 1]$ 上对数等距，$\kappa = 10^1,\dots,10^{12}$；零残差问题 $b = Ax$，每个 $\kappa$ 取 20 个随机 $x$ 的几何平均误差。

## 4. Governing Equations | 控制方程

**后向误差与正交性**（本实验的判定量）：

$$
\eta_{\text{rec}} = \frac{\|A - \hat A\|_F}{\|A\|_F},\qquad \eta_{\text{orth}} = \|Q^TQ - I\|_F .
$$

**前向误差的一阶界**（方阵线性系统，后向稳定求解器）：

$$
\frac{\|\hat x - x\|}{\|x\|} \lesssim \kappa(A)\,\eta_{\text{bwd}} \approx c\,n\,\kappa(A)\,\varepsilon .
$$

**最小二乘** $\min_x \|Ax-b\|_2$：

- 正规方程 $A^TA\,x = A^Tb$，$\kappa(A^TA) = \kappa(A)^2$ ⇒ 误差 $\sim \kappa(A)^2\varepsilon$；
- QR：$Rx = Q^Tb$；SVD：$x = V\Sigma^{-1}U^Tb$ ⇒ 零残差问题误差 $\sim \kappa(A)\varepsilon$（一般问题为 $\kappa\varepsilon + \kappa^2\varepsilon\,\|r\|/(\|A\|\|x\|)$）。

**Householder 反射**：$H_k = I - 2vv^T$，$\|v\|=1$，取 $\alpha = -\operatorname{sign}(x_1)\|x\|$ 以避免 $v = x - \alpha e_1$ 中的相消（cancellation）。

**归一化后向误差**（Rigal–Gaches）：$\eta(\hat x) = \dfrac{\|b - A\hat x\|}{\|A\|\,\|\hat x\| + \|b\|}$。

## 5. Numerical Method | 数值方法

| 方法 | 实现 | 复杂度 |
|---|---|---|
| LU | `scipy.linalg.lu`（LAPACK `getrf`） | $\tfrac23 n^3$ |
| Cholesky | `numpy.linalg.cholesky`（`potrf`） | $\tfrac13 n^3$ |
| Householder QR | **`householder_qr()` 从零实现**：逐列构造反射子、对 $R$ 做秩一更新、逆序累积 $Q$ | $2mn^2 - \tfrac23 n^3$ |
| 经典 Gram–Schmidt | `classical_gram_schmidt()`（反例） | $2mn^2$ |
| 对称特征分解 | `numpy.linalg.eigh`（`syevd`） | $O(n^3)$ |
| SVD | `numpy.linalg.svd`（`gesdd`） | $O(mn^2)$ |

实验分四部分：A 重构与正交性；B CGS vs Householder；C Hilbert 方阵求解 $H_nx=b$（$x=\mathbf 1$）；D 最小二乘随 $\kappa$ 的误差标度，并用 $\log_{10}$ 误差对 $\log_{10}\kappa$ 线性回归得到斜率（正规方程只在 $\kappa\le10^7$ 拟合，因为 $\kappa\approx10^8$ 时 $\kappa^2\varepsilon\approx1$ 已饱和）。

## 6. Implementation & How to Run | 实现与运行方式

**依赖（Dependencies）**：Python ≥ 3.10（已测 3.12.4），`numpy` ≥ 1.26（已测 1.26.4），`scipy` ≥ 1.11（已测 1.13.1），`matplotlib` ≥ 3.8（已测 3.9.2）。安装见 [`../../README.md`](../../README.md#2-environment-setup--环境配置)。

```bash
cd 05_experiments/linear_algebra/01_matrix_decomposition
python experiment.py          # exit code 0 ⇔ 全部断言通过
```

代码结构（`experiment.py`）：

| 函数 | 作用 |
|---|---|
| `householder_qr(A)` | 从零实现的完整 Householder QR |
| `classical_gram_schmidt(A)` | CGS（用于展示不稳定性） |
| `part_a` … `part_d` | 四个子实验，各自打印表格并 `assert` 判据 |
| `make_figures` | 生成 3 张图到 `output/` |

参数：`SEED = 42`，`TOL_BACKWARD = 1e-12`，`TOL_ORTH = 1e-12`；最小二乘 $m=60,\ n=12$，20 个右端项。

## 7. Visualization | 可视化说明

输出目录 `output/`（已被 `.gitignore` 忽略）：

| 文件 | 内容 | 读图要点 |
|---|---|---|
| `matdecomp_backward_error.png` | 各矩阵 × 各分解的 $\|A-\hat A\|_F/\|A\|_F$（对数柱状图），含 $10^{-12}$ 判据线与机器精度线 | 所有柱都贴近 $\varepsilon$，**与 $\kappa$ 无关**（$H_{12}$ 的 $\kappa\approx10^{16}$ 也一样） |
| `matdecomp_lstsq_vs_kappa.png` | 最小二乘前向误差 vs $\kappa(A)$（双对数），叠加 $\kappa\varepsilon$ 与 $\kappa^2\varepsilon$ 参考线 | 正规方程沿 $\kappa^2\varepsilon$ 线上升并在 $\kappa\approx10^8$ 饱和到 $O(1)$；QR/SVD 沿 $\kappa\varepsilon$ |
| `matdecomp_orthogonality.png` | $\|Q^TQ-I\|_F$ vs Hilbert 阶数 $n$：Householder vs CGS | CGS 的正交性损失跟踪 $\kappa(H_n)\varepsilon$，Householder 保持 $10^{-15}$ |

## 8. Verification | 验证标准与结果

**判据（全部以 `assert` 实现，任一失败则非零退出）：**

| # | 判据 | 阈值 |
|---|---|---|
| V1 | 所有分解、所有矩阵的重构误差 $\|A-\hat A\|_F/\|A\|_F$ | $< 10^{-12}$ |
| V2 | Householder $Q$、`eigh` 的 $V$、SVD 的 $U,V$：$\|Q^TQ-I\|_F$ | $< 10^{-12}$ |
| V3 | CGS 在 $H_{12}$ 上的正交性损失（反例必须出现） | $> 10^{-3}$ |
| V4 | Hilbert 求解：LU/Cholesky/QR 的归一化后向误差 | $< 10^{-12}$ |
| V5 | Hilbert 求解：前向误差满足 $\le 10\,n\,\kappa\,\varepsilon$；$H_{12}$ 前向误差 $>10^{-6}$ | — |
| V6 | 最小二乘斜率：正规方程 $\in[1.6, 2.4]$；QR、SVD $\in[0.6, 1.4]$ | — |
| V7 | $\kappa=10^8$ 时：QR/SVD 误差 $<10^{-6}$，正规方程误差 $>10^{-2}$；$\kappa(A^TA)=\kappa(A)^2$（相对 1%，$\kappa\le10^5$） | — |

**实测结果（2026-11-25，本机运行，exit code 0）：**

Part A — 重构误差（V1）与正交性（V2），全部 PASS：

| 矩阵 | $\kappa_2$ | LU | Cholesky | Householder QR | Eig | SVD | max $\|Q^TQ-I\|_F$ |
|---|---|---|---|---|---|---|---|
| Random general 100×100 | 3.94e+03 | 7.91e-16 | — | 8.35e-16 | — | 2.15e-15 | 1.90e-14 |
| Random SPD 100×100 | 4.83e+00 | 2.90e-16 | 1.14e-16 | 1.04e-15 | 2.11e-15 | 2.59e-15 | 1.91e-14 |
| $H_4$ | 1.55e+04 | 1.84e-17 | 0.00e+00 | 7.85e-16 | 8.45e-16 | 6.90e-16 | 1.57e-15 |
| $H_8$ | 1.53e+10 | 4.03e-17 | 2.13e-17 | 4.91e-16 | 4.11e-16 | 5.78e-16 | 1.85e-15 |
| $H_{12}$ | 1.64e+16 | 5.14e-17 | 4.05e-17 | 3.38e-16 | 7.87e-16 | 4.44e-16 | 2.13e-15 |

Part B — 正交性（V3）：

| $n$ | $\kappa(H_n)$ | Householder | CGS |
|---|---|---|---|
| 4 | 1.55e+04 | 1.37e-15 | 4.89e-11 |
| 6 | 1.50e+07 | 1.26e-15 | 2.84e-04 |
| 8 | 1.53e+10 | 1.05e-15 | 1.42e+00 |
| 12 | 1.64e+16 | 1.66e-15 | 5.48e+00 |

Part C — $H_nx=b$，$x=\mathbf 1$（V4、V5）：

| $n$ | $\kappa\varepsilon$ | LU 前向误差 | Cholesky | QR | SVD | 最大后向误差 |
|---|---|---|---|---|---|---|
| 4 | 3.44e-12 | 9.58e-14 | 1.73e-13 | 4.99e-13 | 7.49e-13 | 3.78e-16 |
| 8 | 3.39e-06 | 2.56e-08 | 4.47e-08 | 8.39e-08 | 2.90e-07 | 2.55e-16 |
| 12 | 3.65e+00 | 2.44e-01 | 2.93e-01 | 9.94e-02 | 1.47e-01 | 1.34e-16 |

Part D — 最小二乘（V6、V7）：

| $\kappa(A)$ | $\kappa(A^TA)$ | 正规方程 | QR | SVD |
|---|---|---|---|---|
| 1e+02 | 1.00e+04 | 2.06e-13 | 2.85e-15 | 3.31e-15 |
| 1e+04 | 1.00e+08 | 1.02e-09 | 9.53e-14 | 8.11e-14 |
| 1e+06 | 1.00e+12 | 6.48e-06 | 8.50e-12 | 8.51e-12 |
| 1e+08 | 1.11e+16 | **6.73e-02** | 9.49e-10 | 1.81e-09 |
| 1e+10 | 2.77e+17 | 1.80e+00 | 8.31e-08 | 6.72e-08 |
| 1e+12 | 1.23e+17 | 3.62e+00 | 6.52e-06 | 5.16e-06 |

拟合斜率：**正规方程 1.91**（理论 2）、**QR 0.93**、**SVD 0.91**（理论 ≤ 1）；$\kappa=10^8$ 时正规方程误差 / QR 误差 $= 7.1\times10^7$。

## 9. Error Analysis | 误差分析

1. **后向误差与 $\kappa$ 无关**（Part A）：$H_{12}$ 的 $\kappa\approx1.6\times10^{16}\approx 1/\varepsilon$，但所有分解的重构误差仍为 $10^{-16}$ 量级。这正是后向稳定性的含义：算法给出的是"邻近问题的精确解"，与问题本身是否病态无关。
2. **前向误差被 $\kappa$ 放大**（Part C）：$H_{12}$ 上四种求解器的后向误差都 ≈ $10^{-16}$，前向误差却高达 0.1–0.3，与 $\kappa\varepsilon\approx3.65$ 一致。病态是**问题**的性质，不是算法的缺陷；换更好的分解无法救回丢失的位数。
3. **正规方程的 $\kappa^2$ 惩罚**（Part D）：拟合斜率 1.91 ≈ 2，因为 $\kappa(A^TA)$ 完全等于 $\kappa(A)^2$（表中直到 $\kappa=10^7$ 都成立）。$\kappa\ge10^8$ 时 $\kappa(A^TA)$ 被舍入误差截断在 $\sim10^{17}$——计算出的 $A^TA$ 已与一个奇异矩阵无法区分，误差饱和到 $O(1)$。
4. **QR/SVD 斜率 < 1**：对零残差问题，误差界是 $\kappa\varepsilon$ 的**上界**；随机右端项在小奇异值方向上的分量通常不大，因此实测斜率（0.91–0.93）略低于 1，系数也远小于界。这是界的悲观性，不是矛盾。
5. **CGS 的正交性损失**增长快于 $\kappa\varepsilon$（$n=6$：$\kappa\varepsilon\approx3\times10^{-9}$，实测 $2.8\times10^{-4}$），与已知上界一致：MGS 为 $O(\kappa\varepsilon)$（Björck 1967），CGS 在 $\kappa^2\varepsilon<1$ 时为 $O(\kappa^2\varepsilon)$（Giraud, Langou & Rozložník 2005）。$n\ge8$ 时 $\kappa^2\varepsilon\gg1$，界失效，$Q$ 完全失去正交性（$>1$）。Householder 通过正交变换作用于 $A$ 而非投影相减，正交性仅为 $O(n\varepsilon)$，与 $\kappa$ 无关。
6. **容差选择依据**：$10^{-12}$ 约为 $\varepsilon$ 的 4500 倍，覆盖 $n\le100$ 时 $O(n\varepsilon)$ 级的舍入累积，同时远低于任何真实算法缺陷会产生的误差。

## 10. Engineering Interpretation | 工程意义

- **永远不要显式求逆，也尽量不用正规方程**：传感器标定、系统辨识、多项式拟合中直接 `inv(A.T @ A) @ A.T @ b` 会把可用精度从 $16-\log_{10}\kappa$ 位降到 $16-2\log_{10}\kappa$ 位。$\kappa=10^6$ 时这意味着从 10 位有效数字降到 4 位。用 `np.linalg.lstsq`（SVD）或 QR。
- **FEM 刚度矩阵**是 SPD：用 Cholesky（成本是 LU 的一半且无需选主元）。网格加密时 $\kappa \sim h^{-2}$，这就是为什么大规模问题需要**预条件（preconditioning）**（见计划中的实验 12）。
- **基的选择决定条件数**：Hilbert 病态源于单项式基近似线性相关。工程上改用正交多项式（Legendre、Chebyshev）或 B 样条基，可将 $\kappa$ 从 $10^{16}$ 降到 $O(n)$ 量级。
- **正交性就是稳定性**：Krylov 方法（GMRES、Lanczos）中的 Arnoldi 过程若用 CGS 会丧失正交性 → 收敛停滞或出现"幽灵特征值"。实践中使用 MGS + 重正交化或 Householder。
- **判断精度的经验法则**：结果的可信有效位数 ≈ $16 - \log_{10}\kappa(A)$。在报告任何线性求解结果时，应同时报告 $\kappa$ 的估计（如 LAPACK `gecon`）。

**参考文献**：Trefethen & Bau, *Numerical Linear Algebra*, Lectures 7–11, 14–19；Higham, *Accuracy and Stability of Numerical Algorithms* (2nd ed.), Ch. 7, 10, 19–20；Golub & Van Loan, *Matrix Computations* (4th ed.), §5.2–5.3。

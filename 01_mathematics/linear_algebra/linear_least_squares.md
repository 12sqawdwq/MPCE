# Linear Least Squares | 线性最小二乘

<!--
CONTRIBUTING 七问（简答）
1 定位：ROADMAP Phase I, I.2（内积、正交性与最小二乘）；I.4（SVD、条件数）的应用出口。
2 先修：MATH-LA-01（内积、正交投影、秩-零化度定理）；多元微分（梯度）。
3 结构：正交投影定理在有限维的特例；与 Fourier 级数（L^2 中的最佳逼近）、Galerkin 方法（Galerkin 正交性）是同一结构。
4 推导：L1 必证——正规方程、投影的最优性、QR 与 SVD 解法、κ(AᵀA)=κ(A)²、Tikhonov 闭式解。
5 计算：正规方程 vs. QR vs. SVD 在病态 Vandermonde 矩阵上的精度对比（curriculum E3）。
6 应用：领域 1（回归）、3（系统辨识）、7（CT 代数重建）、2（器件参数提取）、6（TSQR）。
7 代价：约 10–12 h（推导 6 h + 实验 4 h + 习题若干）。
-->

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-LA-03`（Matrix Decompositions and SVD；伪逆）· 关联 `MATH-LA-01`、`MATH-OPT-01`、`MATH-NA-01`、`MATH-PR-02` |
| Phase | Phase I — ROADMAP **I.2**（主），**I.4**（SVD/条件数部分） |
| Prerequisites | `MATH-LA-01`（内积、正交补、秩-零化度定理）；多元微分（梯度、Hessian，ROADMAP I.5）；SVD 的存在性（I.4，本文直接使用） |
| Primary References | Trefethen & Bau, *Numerical Linear Algebra*, Lectures 11, 18；Golub & Van Loan, *Matrix Computations* 4e, Ch. 5；Strang, *Introduction to Linear Algebra*, Ch. 4；Hansen, *Discrete Inverse Problems*, SIAM 2010 |

---

## 1. Physical Motivation | 物理动机

几乎所有工程测量都是**超定（overdetermined）**的：为了压低噪声，我们采集的方程数 $m$ 远多于未知参数数 $n$。例如：

- 用 $m = 1000$ 个温度–电阻数据点标定一个 3 参数热敏电阻模型；
- 用一段输入–输出时间序列辨识一个机械臂关节的惯量、阻尼与摩擦系数；
- CT 扫描中，$10^5$–$10^7$ 条射线积分决定 $10^5$–$10^6$ 个像素的衰减系数。

由于噪声与模型误差，线性方程组 $A\mathbf{x} = \mathbf{b}$ 一般**无解**（$\mathbf{b} \notin \operatorname{col}(A)$）。最小二乘（least squares）给出一个有原则的替代：在所有 $\mathbf{x}$ 中，选择使残差（residual）$\mathbf{r} = \mathbf{b} - A\mathbf{x}$ 的欧氏长度最小者。

本文要回答的问题：

1. 最小二乘解何时存在、何时唯一？（§6）
2. 它满足什么方程？其几何意义是什么？（§5.1–5.3）
3. 三种求解路径——正规方程（normal equations）、QR 分解、奇异值分解（SVD）——在数学上等价，为何在数值上差别巨大？（§5.4–5.7、§9）
4. 当 $A$ 病态或秩亏时如何稳定化？（§5.8 Tikhonov 正则化）

---

## 2. Physical Assumptions | 物理假设

最小二乘本身是纯数学问题；"物理假设"指的是**把一个测量问题写成最小二乘问题时**所隐含的建模假设。

| 编号 | 假设 | 含义 / 失效后果 |
|---|---|---|
| A1 | **线性模型**：观测与参数呈线性关系 $\mathbf{b} = A\mathbf{x}_\star + \boldsymbol\epsilon$ | 若模型对参数非线性，需 Gauss–Newton 迭代（每步是一个线性最小二乘问题） |
| A2 | **$A$ 精确已知**，误差只在 $\mathbf{b}$ 中 | 若 $A$ 本身含测量误差（errors-in-variables），应使用总体最小二乘（Total Least Squares） |
| A3 | **噪声零均值、同方差、互不相关**：$\mathbb{E}[\boldsymbol\epsilon] = \mathbf{0}$，$\operatorname{Cov}(\boldsymbol\epsilon) = \sigma^2 I$ | 若方差不同或相关，应改用加权最小二乘（weighted least squares），见 §7.2 |
| A4 | **$\mathbf{b}$ 各分量量纲一致**（或已无量纲化/白化） | 否则"残差平方和"把不同单位相加，在物理上无意义，见 §7 |
| A5 | **欧氏范数**：误差度量为 $\lVert\cdot\rVert_2$ | 若存在离群点（outliers），$\ell_2$ 不稳健，应考虑 $\ell_1$ 或 Huber 损失 |
| A6 | 有限维实空间：$A \in \mathbb{R}^{m\times n}$，通常 $m \ge n$ | 复数情形把 $^\top$ 换成 $^*$，结论不变；无穷维情形见 Fourier 级数（[`../differential_equations/fourier_transform.md`](../differential_equations/fourier_transform.md) §5.1） |

在 A1 + A3 下，Gauss–Markov 定理保证（满秩时）最小二乘估计是**最佳线性无偏估计（Best Linear Unbiased Estimator, BLUE）**；若再加上高斯噪声，它同时是最大似然估计（MLE）。这两条统计解释在 §5.9 给出推导要点。

---

## 3. Mathematical Definitions | 数学定义

| 符号 | 含义 | 所在空间 / 量纲 |
|---|---|---|
| $A$ | 设计矩阵（design matrix）/ 正向算子（forward operator） | $\mathbb{R}^{m\times n}$；第 $j$ 列量纲 $=[\mathbf{b}]/[x_j]$ |
| $\mathbf{x}$ | 未知参数向量 | $\mathbb{R}^n$ |
| $\mathbf{b}$ | 观测向量 | $\mathbb{R}^m$ |
| $\mathbf{r}(\mathbf{x}) := \mathbf{b} - A\mathbf{x}$ | 残差（residual） | $\mathbb{R}^m$，量纲同 $\mathbf{b}$ |
| $f(\mathbf{x}) := \lVert A\mathbf{x} - \mathbf{b}\rVert_2^2$ | 目标函数（残差平方和） | $[\mathbf{b}]^2$ |
| $\hat{\mathbf{x}}$ | 最小二乘解（least-squares solution） | $\mathbb{R}^n$ |
| $\operatorname{col}(A)$, $\ker A$ | 列空间（值域）、零空间 | $\mathbb{R}^m$、$\mathbb{R}^n$ 的子空间 |
| $r = \operatorname{rank}(A)$ | 秩 | $0 \le r \le \min(m,n)$ |
| $P$ | 到 $\operatorname{col}(A)$ 的正交投影（orthogonal projection） | $P = P^2 = P^\top$ |
| $A = QR$ | 瘦 QR 分解（thin/reduced QR）：$Q \in \mathbb{R}^{m\times n}$，$Q^\top Q = I_n$；$R \in \mathbb{R}^{n\times n}$ 上三角 | 要求 $m \ge n$ |
| $A = U\Sigma V^\top$ | 奇异值分解（SVD）：$U \in \mathbb{R}^{m\times m}$、$V \in \mathbb{R}^{n\times n}$ 正交；$\Sigma$ 对角，$\sigma_1 \ge \dots \ge \sigma_r > 0 = \sigma_{r+1} = \cdots$ | — |
| $A^+ := V\Sigma^+U^\top$ | Moore–Penrose 伪逆（pseudoinverse）；$\Sigma^+$ 为 $\Sigma^\top$ 中非零元取倒数 | $\mathbb{R}^{n\times m}$ |
| $\kappa_2(A) := \sigma_1/\sigma_n$ | 2-范数条件数（condition number，满列秩 $A$） | 无量纲 |
| $\lambda \ge 0$ | Tikhonov 正则化参数 | 量纲见 §7.3 |

**约定**：除非特别说明，$\lVert\cdot\rVert$ 指欧氏 2-范数；"满列秩"指 $\operatorname{rank}A = n$。

---

## 4. Governing Principles | 基本原理

本推导只依赖以下四条已知结论（均在 `MATH-LA-01` / `MATH-LA-03` 范围内）：

1. **正交分解定理**：对任意子空间 $S \subseteq \mathbb{R}^m$，$\mathbb{R}^m = S \oplus S^\perp$，且每个 $\mathbf{b}$ 唯一分解为 $\mathbf{b} = \mathbf{s} + \mathbf{s}^\perp$。
2. **四个基本子空间的正交关系**：$\operatorname{col}(A)^\perp = \ker(A^\top)$。（证明：$\mathbf{y} \perp \operatorname{col}(A) \iff \mathbf{y}^\top A\mathbf{x} = 0\ \forall\mathbf{x} \iff A^\top\mathbf{y} = \mathbf{0}$。）
3. **正交矩阵保范数**：若 $Q^\top Q = I$，则 $\lVert Q\mathbf{y}\rVert = \lVert\mathbf{y}\rVert$。
4. **凸函数的一阶条件**：可微凸函数的驻点即全局极小点。

**最小二乘原理（Principle of Least Squares）**：

$$
\hat{\mathbf{x}} \in \arg\min_{\mathbf{x}\in\mathbb{R}^n} \lVert A\mathbf{x} - \mathbf{b}\rVert_2^2 .
$$

---

## 5. Mathematical Derivation | 数学推导

### 5.1 解析路径：梯度为零 ⟹ 正规方程

**Step 1（展开目标函数）** [代数，利用 $\mathbf{b}^\top A\mathbf{x} = \mathbf{x}^\top A^\top\mathbf{b}$ 为标量]：

$$
f(\mathbf{x}) = (A\mathbf{x}-\mathbf{b})^\top(A\mathbf{x}-\mathbf{b}) = \mathbf{x}^\top A^\top A\,\mathbf{x} - 2\,\mathbf{x}^\top A^\top\mathbf{b} + \mathbf{b}^\top\mathbf{b}.
$$

**Step 2（求梯度）** [矩阵微分：$\nabla(\mathbf{x}^\top M\mathbf{x}) = (M+M^\top)\mathbf{x}$，$\nabla(\mathbf{c}^\top\mathbf{x}) = \mathbf{c}$；此处 $M = A^\top A$ 对称]：

$$
\nabla f(\mathbf{x}) = 2A^\top A\,\mathbf{x} - 2A^\top\mathbf{b}, \qquad \nabla^2 f = 2A^\top A .
$$

**Step 3（凸性）** Hessian 半正定：$\mathbf{y}^\top(2A^\top A)\mathbf{y} = 2\lVert A\mathbf{y}\rVert^2 \ge 0$。故 $f$ 为凸二次函数 [基本原理 4]，驻点即全局极小点：

$$
\boxed{\,A^\top A\,\hat{\mathbf{x}} = A^\top\mathbf{b}\,} \qquad \text{（正规方程，normal equations）}
$$

**物理含义**：$A^\top\mathbf{r} = \mathbf{0}$ 表示残差与每一列"回归量（regressor）"不相关——模型已经从数据中提取出所有能被列空间解释的信息。

### 5.2 几何路径：正交投影

**Step 1** [基本原理 1、2] 将 $\mathbf{b}$ 分解为 $\mathbf{b} = \mathbf{p} + \mathbf{e}$，其中 $\mathbf{p} \in \operatorname{col}(A)$，$\mathbf{e} \in \operatorname{col}(A)^\perp = \ker A^\top$。由于 $\mathbf{p} \in \operatorname{col}(A)$，存在 $\hat{\mathbf{x}}$ 使 $A\hat{\mathbf{x}} = \mathbf{p}$。

**Step 2（最优性，Pythagoras）** 对任意 $\mathbf{x}$：

$$
\mathbf{b} - A\mathbf{x} = \underbrace{(\mathbf{b} - A\hat{\mathbf{x}})}_{=\,\mathbf{e}\ \in\ \operatorname{col}(A)^\perp} + \underbrace{A(\hat{\mathbf{x}} - \mathbf{x})}_{\in\ \operatorname{col}(A)}
\;\Longrightarrow\;
\lVert\mathbf{b} - A\mathbf{x}\rVert^2 = \lVert\mathbf{e}\rVert^2 + \lVert A(\hat{\mathbf{x}}-\mathbf{x})\rVert^2 \ge \lVert\mathbf{e}\rVert^2 .
$$

两向量正交，交叉项 $2\mathbf{e}^\top A(\hat{\mathbf{x}}-\mathbf{x}) = 0$ [基本原理 2]。等号成立 $\iff A(\hat{\mathbf{x}} - \mathbf{x}) = \mathbf{0} \iff \mathbf{x} - \hat{\mathbf{x}} \in \ker A$。

**Step 3（与正规方程等价）** $\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}} \in \ker A^\top \iff A^\top(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0}$，即正规方程。两条路径给出同一结论，且几何路径**不需要可微性**，并直接给出了解集结构：

$$
\{\text{全体最小二乘解}\} = \hat{\mathbf{x}} + \ker A .
$$

**几何含义**：$A\hat{\mathbf{x}}$ 是 $\mathbf{b}$ 在列空间上的"影子"；残差垂直于列空间。直观上，最小二乘就是"从 $\mathbf{b}$ 向平面 $\operatorname{col}(A)$ 作垂线"。

### 5.3 投影矩阵（满列秩情形）

**引理**：若 $\operatorname{rank}A = n$，则 $A^\top A$ 可逆。
*证明*：$A^\top A\mathbf{y} = \mathbf{0} \Rightarrow \mathbf{y}^\top A^\top A\mathbf{y} = \lVert A\mathbf{y}\rVert^2 = 0 \Rightarrow A\mathbf{y} = \mathbf{0} \Rightarrow \mathbf{y} = \mathbf{0}$（因 $\ker A = \{\mathbf{0}\}$）。$\square$

于是 $\hat{\mathbf{x}} = (A^\top A)^{-1}A^\top\mathbf{b}$，并且

$$
P := A(A^\top A)^{-1}A^\top, \qquad A\hat{\mathbf{x}} = P\mathbf{b}.
$$

验证 $P$ 是正交投影 [代数]：

- 幂等：$P^2 = A(A^\top A)^{-1}\underbrace{A^\top A(A^\top A)^{-1}}_{=I}A^\top = P$；
- 对称：$P^\top = A\big((A^\top A)^{-1}\big)^\top A^\top = A(A^\top A)^{-1}A^\top = P$（$A^\top A$ 对称 ⟹ 其逆对称）。

而 $I - P$ 是到 $\ker A^\top$ 的投影，$\mathbf{e} = (I-P)\mathbf{b}$。

### 5.4 QR 路径：避开 $A^\top A$

设 $m \ge n$，$\operatorname{rank}A = n$，完全 QR 分解 $A = [\,Q_1\ \ Q_2\,]\begin{bmatrix}R\\0\end{bmatrix}$，$[Q_1\ Q_2] \in \mathbb{R}^{m\times m}$ 正交，$R$ 上三角且对角元非零（满秩保证）。

**Step 1** [正交矩阵保范数，基本原理 3]：

$$
\lVert A\mathbf{x} - \mathbf{b}\rVert^2 = \left\lVert [Q_1\ Q_2]^\top(A\mathbf{x} - \mathbf{b})\right\rVert^2
= \left\lVert \begin{bmatrix} R\mathbf{x} - Q_1^\top\mathbf{b} \\ -Q_2^\top\mathbf{b}\end{bmatrix} \right\rVert^2
= \lVert R\mathbf{x} - Q_1^\top\mathbf{b}\rVert^2 + \lVert Q_2^\top\mathbf{b}\rVert^2 .
$$

**Step 2** 第二项与 $\mathbf{x}$ 无关；第一项可通过解方阵三角方程组归零：

$$
\boxed{\,R\,\hat{\mathbf{x}} = Q_1^\top\mathbf{b}\,}\quad\text{（回代求解）},\qquad \min f = \lVert Q_2^\top\mathbf{b}\rVert^2 .
$$

**Step 3（与正规方程一致性检查）** $A^\top A = R^\top Q_1^\top Q_1 R = R^\top R$（这正是 $A^\top A$ 的 Cholesky 分解）；正规方程变为 $R^\top R\hat{\mathbf{x}} = R^\top Q_1^\top\mathbf{b}$，左乘 $R^{-\top}$ 即得 Step 2。

**关键区别**：QR 路径直接作用于 $A$，**从不形成** $A^\top A$，因此求解过程中出现的条件数是 $\kappa(R) = \kappa(A)$ 而非 $\kappa(A)^2$（见 §5.6）。

### 5.5 SVD 路径与伪逆：处理秩亏

设 $A = U\Sigma V^\top$，$\operatorname{rank}A = r$（可以 $< n$）。令 $\mathbf{y} := V^\top\mathbf{x}$，$\mathbf{c} := U^\top\mathbf{b}$。

**Step 1** [正交矩阵保范数]：

$$
\lVert A\mathbf{x} - \mathbf{b}\rVert^2 = \lVert U^\top(U\Sigma V^\top\mathbf{x} - \mathbf{b})\rVert^2 = \lVert\Sigma\mathbf{y} - \mathbf{c}\rVert^2
= \sum_{i=1}^{r}(\sigma_i y_i - c_i)^2 + \sum_{i=r+1}^{m} c_i^2 .
$$

**Step 2（极小化）** 各项解耦：$i \le r$ 时取 $y_i = c_i/\sigma_i$ 使该项为零；$i > r$ 的 $y_i$ **不出现**在目标中，可任取；$\sum_{i>r}c_i^2$ 为不可约残差。

**Step 3（最小范数选择）** $\lVert\mathbf{x}\rVert = \lVert\mathbf{y}\rVert$（$V$ 正交），故在全部最小二乘解中，范数最小者取 $y_i = 0\ (i > r)$：

$$
\boxed{\,\mathbf{x}^+ = \sum_{i=1}^{r}\frac{\mathbf{u}_i^\top\mathbf{b}}{\sigma_i}\,\mathbf{v}_i = V\Sigma^+U^\top\mathbf{b} = A^+\mathbf{b}\,}
$$

这是**唯一的最小范数最小二乘解（minimum-norm least-squares solution）**。满列秩时 $r = n$，没有自由分量，$A^+ = (A^\top A)^{-1}A^\top$（代入 SVD 可直接验证：$(V\Sigma^\top\Sigma V^\top)^{-1}V\Sigma^\top U^\top = V(\Sigma^\top\Sigma)^{-1}\Sigma^\top U^\top = V\Sigma^+U^\top$）。

**物理含义**：$\mathbf{x}^+$ 把数据 $\mathbf{b}$ 投到左奇异向量 $\mathbf{u}_i$ 上，再以 $1/\sigma_i$ 放大、沿右奇异向量 $\mathbf{v}_i$ 合成。**小奇异值 ⟹ 大放大倍数**：这就是噪声放大与不适定性的根源（§5.8）。

### 5.6 条件数：$\kappa(A^\top A) = \kappa(A)^2$

**命题**：若 $A$ 满列秩，则 $\kappa_2(A^\top A) = \kappa_2(A)^2$。

*证明*：由 SVD，$A^\top A = V\Sigma^\top U^\top U\Sigma V^\top = V\,\operatorname{diag}(\sigma_1^2,\dots,\sigma_n^2)\,V^\top$。这是 $A^\top A$ 的谱分解，其奇异值（= 特征值，因为对称半正定）为 $\sigma_i^2$。故

$$
\kappa_2(A^\top A) = \frac{\sigma_1^2}{\sigma_n^2} = \kappa_2(A)^2 . \qquad\square
$$

**数值后果**：双精度单位舍入 $u \approx 1.1\times 10^{-16}$。若 $\kappa(A) = 10^{8}$，则 $\kappa(A^\top A) = 10^{16}$，正规方程的 Cholesky 解可能**丢失全部有效数字**；而基于 Householder QR 的解法是后向稳定的（backward stable）。

**更精细的结论**（Trefethen & Bau Lecture 18，Theorem 18.1）：记 $\theta$ 为 $\mathbf{b}$ 与 $\operatorname{col}(A)$ 的夹角，$\eta := \lVert A\rVert\lVert\mathbf{x}\rVert/\lVert A\mathbf{x}\rVert \in [1, \kappa]$。最小二乘问题**本身**对 $A$ 的扰动的相对条件数约为

$$
\kappa_{\mathbf{x}\leftarrow A} \approx \kappa + \frac{\kappa^2\tan\theta}{\eta}.
$$

[NEEDS VERIFICATION: 公式形式与定理编号凭记忆给出，需对照 Trefethen & Bau Lecture 18 原文]
因此：

- **残差小**（$\theta \approx 0$）时，问题条件数 $\approx \kappa$，QR 可达到 $O(\kappa u)$ 精度，而正规方程仍是 $O(\kappa^2 u)$——**算法引入了问题本身没有的病态**；
- **残差大**时，$\kappa^2$ 是问题固有的，任何算法都无法避免。

### 5.7 三种方法的统一视角

| 方法 | 求解对象 | 有效条件数 | 能否处理秩亏 | 主要代价（$m \gg n$，稠密） |
|---|---|---|---|---|
| 正规方程 + Cholesky | $A^\top A\mathbf{x} = A^\top\mathbf{b}$ | $\kappa^2$ | 否（$A^\top A$ 奇异） | $\approx mn^2 + n^3/3$ flops |
| Householder QR | $R\mathbf{x} = Q_1^\top\mathbf{b}$ | $\kappa$ | 需列主元 QR | $\approx 2mn^2 - \tfrac23 n^3$ flops |
| SVD | $\mathbf{x} = \sum \sigma_i^{-1}(\mathbf{u}_i^\top\mathbf{b})\mathbf{v}_i$ | $\kappa$；可截断 | 是（自然给出最小范数解） | $\approx 2mn^2 + 11n^3$ flops |

[NEEDS VERIFICATION: flop 计数取自 Trefethen & Bau Lecture 11 的记忆，SVD 的常数依赖具体算法]

### 5.8 Tikhonov 正则化：从病态到稳定

当 $\sigma_i$ 衰减到噪声水平以下时（反问题的典型情形），$\mathbf{x}^+$ 中的 $\sigma_i^{-1}(\mathbf{u}_i^\top\boldsymbol\epsilon)$ 项会淹没真实信号。Tikhonov 正则化（Tikhonov regularization）在目标中加入惩罚项：

$$
\mathbf{x}_\lambda := \arg\min_{\mathbf{x}}\ \lVert A\mathbf{x}-\mathbf{b}\rVert^2 + \lambda^2\lVert\mathbf{x}\rVert^2,\qquad \lambda > 0 .
$$

（GLOSSARY 中写作 $\alpha\lVert L\mathbf{x}\rVert^2$；此处取 $L = I$，$\alpha = \lambda^2$。）

**Step 1（化为普通最小二乘）** [代数：堆叠]：

$$
\lVert A\mathbf{x}-\mathbf{b}\rVert^2 + \lambda^2\lVert\mathbf{x}\rVert^2 = \left\lVert \begin{bmatrix}A\\ \lambda I\end{bmatrix}\mathbf{x} - \begin{bmatrix}\mathbf{b}\\ \mathbf{0}\end{bmatrix}\right\rVert^2 .
$$

堆叠矩阵 $\tilde A$ 恒满列秩（下半块 $\lambda I$ 可逆），故解唯一。

**Step 2（正规方程）** 应用 §5.1 于 $\tilde A$：$\tilde A^\top\tilde A = A^\top A + \lambda^2 I$，$\tilde A^\top\tilde{\mathbf{b}} = A^\top\mathbf{b}$：

$$
\boxed{\,(A^\top A + \lambda^2 I)\,\mathbf{x}_\lambda = A^\top\mathbf{b}\,}
$$

**Step 3（SVD 滤波因子）** 代入 SVD，$A^\top A + \lambda^2 I = V(\Sigma^\top\Sigma + \lambda^2 I)V^\top$：

$$
\mathbf{x}_\lambda = \sum_{i=1}^{r}\underbrace{\frac{\sigma_i^2}{\sigma_i^2+\lambda^2}}_{=:\,\phi_i(\lambda)}\ \frac{\mathbf{u}_i^\top\mathbf{b}}{\sigma_i}\,\mathbf{v}_i .
$$

**解释**：滤波因子（filter factor）$\phi_i \approx 1$（$\sigma_i \gg \lambda$）保留可靠分量；$\phi_i \approx \sigma_i^2/\lambda^2 \to 0$（$\sigma_i \ll \lambda$）压制被噪声主导的分量。$\lambda$ 扮演"分辨率–稳定性"的旋钮。条件数也被改善：$\kappa(A^\top A + \lambda^2 I) = (\sigma_1^2+\lambda^2)/(\sigma_n^2+\lambda^2)$。

**Step 4（Bayes 解释）** 若 $\boldsymbol\epsilon \sim \mathcal{N}(\mathbf{0}, \sigma^2 I)$，先验 $\mathbf{x} \sim \mathcal{N}(\mathbf{0}, \tau^2 I)$，则负对数后验 $= \frac{1}{2\sigma^2}\lVert A\mathbf{x}-\mathbf{b}\rVert^2 + \frac{1}{2\tau^2}\lVert\mathbf{x}\rVert^2 + \text{const}$，其极小点（MAP 估计）即 $\mathbf{x}_\lambda$，$\lambda^2 = \sigma^2/\tau^2$（噪声–信号方差比）。这与 `MATH-PR-02` 中"正则化 = 先验"一致。

### 5.9 统计解释要点（Gauss–Markov 与 MLE）

- **无偏性**：在 A1、A3 及满列秩下，$\mathbb{E}[\hat{\mathbf{x}}] = (A^\top A)^{-1}A^\top(A\mathbf{x}_\star + \mathbb{E}\boldsymbol\epsilon) = \mathbf{x}_\star$。
- **协方差**：$\operatorname{Cov}(\hat{\mathbf{x}}) = (A^\top A)^{-1}A^\top(\sigma^2 I)A(A^\top A)^{-1} = \sigma^2(A^\top A)^{-1} = \sigma^2\sum_i \sigma_i^{-2}\mathbf{v}_i\mathbf{v}_i^\top$。小奇异值方向上的参数估计方差大——这是 §5.5 "噪声放大"的统计版本，也是实验设计（让 $A^\top A$ 条件良好）的出发点。
- **MLE**：高斯噪声下似然 $\propto\exp(-\lVert A\mathbf{x}-\mathbf{b}\rVert^2/2\sigma^2)$，最大化似然等价于最小化残差平方和。
- **Gauss–Markov（BLUE）**：在所有线性无偏估计 $C\mathbf{b}$（$CA = I$）中，$\hat{\mathbf{x}}$ 的协方差最小（Loewner 序意义下）。证明要点：写 $C = (A^\top A)^{-1}A^\top + D$，无偏 ⟹ $DA = 0$，于是 $\operatorname{Cov}(C\mathbf{b}) = \sigma^2[(A^\top A)^{-1} + DD^\top] \succeq \sigma^2(A^\top A)^{-1}$。

---

## 6. Solvability / Existence & Uniqueness | 可解性与存在唯一性条件

最小二乘是代数问题，"边界/初始条件"一节以**可解性条件**代替。

| 情形 | 结论 | 依据 |
|---|---|---|
| 任意 $A$、$\mathbf{b}$ | **最小二乘解总是存在** | §5.2：正交分解在有限维中总成立，$\mathbf{p} \in \operatorname{col}(A)$ 总有原像 |
| $\operatorname{rank}A = n$（满列秩，需 $m \ge n$） | **唯一**，$\hat{\mathbf{x}} = (A^\top A)^{-1}A^\top\mathbf{b}$ | §5.2 解集 $= \hat{\mathbf{x}} + \ker A$，$\ker A = \{\mathbf{0}\}$ |
| $\operatorname{rank}A < n$ | 无穷多解，构成仿射子空间 $\mathbf{x}^+ + \ker A$；**最小范数解唯一** $= A^+\mathbf{b}$ | §5.5 |
| $\mathbf{b} \in \operatorname{col}(A)$ | 残差为零，最小二乘解即方程组的精确解 | §5.4：$Q_2^\top\mathbf{b} = \mathbf{0}$ |
| $\lambda > 0$ 的 Tikhonov 问题 | 对任意 $A$（含秩亏）解存在唯一，且连续依赖于 $\mathbf{b}$ | §5.8：$A^\top A + \lambda^2 I \succ 0$ |

**适定性（Hadamard 意义）**：有限维最小二乘问题的"不连续依赖"不会真正发生（$A^+$ 是有界线性映射），但当 $\sigma_r \to 0$ 时 $\lVert A^+\rVert = 1/\sigma_r \to \infty$，**数值上**等同于不适定（ill-posed）。连续化的反问题（如第一类 Fredholm 积分方程）在无穷维中才是真正的不适定：其奇异值聚集于零。

**附加约束**：带线性等式约束 $C\mathbf{x} = \mathbf{d}$ 的最小二乘可通过 KKT 系统或零空间法求解，属 `MATH-OPT-01` 范围，此处不展开。

---

## 7. Dimensional Analysis | 量纲分析

### 7.1 正规方程的量纲一致性

设 $[\mathbf{b}] = B$，$[x_j] = X_j$，则 $[A_{ij}] = B/X_j$。检验正规方程第 $j$ 行：

$$
\Big[(A^\top A\mathbf{x})_j\Big] = \Big[\textstyle\sum_{i,k}A_{ij}A_{ik}x_k\Big] = \frac{B}{X_j}\cdot\frac{B}{X_k}\cdot X_k = \frac{B^2}{X_j},\qquad
\Big[(A^\top\mathbf{b})_j\Big] = \frac{B}{X_j}\cdot B = \frac{B^2}{X_j}. \ \checkmark
$$

### 7.2 列缩放与条件数：$\kappa$ 不是物理不变量

若把参数换单位，$\mathbf{x} = D\mathbf{z}$（$D$ 对角正定），则 $A\mathbf{x} = (AD)\mathbf{z}$：

- **最小二乘解不变**：$\hat{\mathbf{z}} = D^{-1}\hat{\mathbf{x}}$（目标函数相同，只是换了坐标）。
- **条件数会变**：$\kappa(AD) \ne \kappa(A)$。例如一列以 $\mathrm{m}$ 计、另一列以 $\mathrm{\mu m}$ 计，$\kappa$ 可人为放大 $10^6$ 倍。实践中先把各列归一化到单位范数（Jacobi 列缩放），往往显著改善数值条件。

若 $\mathbf{b}$ 各分量单位不同或噪声方差不同（违背 A3/A4），应使用**白化（whitening）**：给定噪声协方差 $\Sigma_\epsilon = LL^\top$，求解

$$
\min_{\mathbf{x}}\lVert L^{-1}(A\mathbf{x} - \mathbf{b})\rVert^2 \quad\Longleftrightarrow\quad A^\top\Sigma_\epsilon^{-1}A\,\hat{\mathbf{x}} = A^\top\Sigma_\epsilon^{-1}\mathbf{b}.
$$

白化后的残差**无量纲**（以各自噪声标准差为单位），平方和具有 $\chi^2$ 统计意义。这是加权最小二乘的量纲理由。

### 7.3 正则化参数的量纲

$\lVert A\mathbf{x}-\mathbf{b}\rVert^2$ 量纲为 $B^2$；$\lambda^2\lVert\mathbf{x}\rVert^2$ 必须同量纲。若 $\mathbf{x}$ 各分量同为 $X$，则 $[\lambda] = B/X = [A]$——$\lambda$ 与奇异值**同量纲**，这正是滤波因子 $\sigma_i^2/(\sigma_i^2+\lambda^2)$ 无量纲的原因。若 $\mathbf{x}$ 各分量单位不同，$\lVert\mathbf{x}\rVert^2$ 本身无物理意义，必须先无量纲化或改用 $\lVert L\mathbf{x}\rVert$。

---

## 8. Limiting Cases | 极限情形验证

| 极限情形 | 预期结果 | 由本文公式验证 |
|---|---|---|
| $m = n$，$A$ 可逆 | $\hat{\mathbf{x}} = A^{-1}\mathbf{b}$ | $(A^\top A)^{-1}A^\top = A^{-1}A^{-\top}A^\top = A^{-1}$ ✓；$P = I$ |
| $A$ 列正交规范，$A^\top A = I$ | $\hat{\mathbf{x}} = A^\top\mathbf{b}$（逐坐标投影，如 Fourier 系数） | 正规方程直接给出 ✓ |
| 拟合常数：$A = \mathbf{1}\in\mathbb{R}^{m}$ | $\hat x = \bar b$（样本均值） | $\mathbf{1}^\top\mathbf{1}\hat x = \mathbf{1}^\top\mathbf{b} \Rightarrow \hat x = \tfrac1m\sum b_i$ ✓ |
| 直线回归：$A = [\mathbf{1}\ \ \mathbf{t}]$ | 斜率 $= \operatorname{cov}(t,b)/\operatorname{var}(t)$ | 正规方程 $\begin{bmatrix}m & \sum t_i\\ \sum t_i & \sum t_i^2\end{bmatrix}\begin{bmatrix}x_0\\x_1\end{bmatrix} = \begin{bmatrix}\sum b_i\\ \sum t_ib_i\end{bmatrix}$，消元得 $x_1 = \dfrac{\sum(t_i-\bar t)(b_i-\bar b)}{\sum(t_i-\bar t)^2}$ ✓ |
| $\mathbf{b} \in \operatorname{col}(A)$ | 零残差 | §5.4 $Q_2^\top\mathbf{b} = 0$ ✓ |
| $\mathbf{b} \perp \operatorname{col}(A)$ | $\hat{\mathbf{x}} = \mathbf{0}$ | $A^\top\mathbf{b} = \mathbf{0}$ ✓ |
| Tikhonov，$\lambda \to 0^+$ | $\mathbf{x}_\lambda \to A^+\mathbf{b}$（即使秩亏） | $\phi_i(\lambda) \to 1$ 对每个 $\sigma_i > 0$；和式只含 $i \le r$ ✓ |
| Tikhonov，$\lambda \to \infty$ | $\mathbf{x}_\lambda \to \mathbf{0}$（先验主导） | $\phi_i \to 0$ ✓ |
| 单个观测重复 $m$ 次、噪声 $\sigma$ | 估计方差 $\sigma^2/m$ | $\operatorname{Cov} = \sigma^2(\mathbf{1}^\top\mathbf{1})^{-1} = \sigma^2/m$ ✓ |

---

## 9. Numerical Implementation | 数值实现

### 9.1 算法选择决策

| 情形 | 推荐算法 | 理由 |
|---|---|---|
| 稠密、良态（$\kappa \lesssim 10^4$）、$m \gg n$、追求速度 | 正规方程 + Cholesky | 代价最低；精度损失 $\kappa^2u \lesssim 10^{-8}$ 可接受 |
| 稠密、一般情形 | **Householder QR**（默认） | 后向稳定；`scipy.linalg.lstsq(..., lapack_driver='gelsy')` 使用列主元 QR |
| 秩亏或近秩亏、需诊断 | SVD / 截断 SVD | 直接看到奇异值谱；`numpy.linalg.lstsq` 默认基于 SVD（LAPACK `gelsd`） |
| 大型稀疏（CT、FEM 反演） | LSQR / CGLS（Krylov） | 只需 $A\mathbf{v}$ 与 $A^\top\mathbf{w}$；迭代步数本身具有正则化效果（semi-convergence） |
| 病态反问题 | Tikhonov + L-曲线 / GCV / 偏差原理选 $\lambda$ | 见 Hansen (2010) |

**注意**：经典 Gram–Schmidt 在病态时会失去正交性；应使用 Householder 或修正 Gram–Schmidt（curriculum 实验 E2）。

### 9.2 参考实现（NumPy/SciPy）

```python
import numpy as np
import scipy.linalg as sla

rng = np.random.default_rng(0)          # 固定随机种子
m, n = 100, 12
t = np.linspace(0.0, 1.0, m)
A = np.vander(t, n, increasing=True)     # 多项式拟合的 Vandermonde 矩阵：病态
x_true = rng.standard_normal(n)
b = A @ x_true + 1e-10 * rng.standard_normal(m)

# (1) 正规方程 + Cholesky：条件数 kappa^2
c, low = sla.cho_factor(A.T @ A)
x_ne = sla.cho_solve((c, low), A.T @ b)

# (2) Householder QR：条件数 kappa
Q, R = np.linalg.qr(A, mode="reduced")
x_qr = sla.solve_triangular(R, Q.T @ b)

# (3) SVD / 伪逆：最小范数解
x_svd, *_ = np.linalg.lstsq(A, b, rcond=None)

# (4) Tikhonov：堆叠形式，再用 QR 求解（不显式形成 A^T A）
lam = 1e-6
A_tik = np.vstack([A, lam * np.eye(n)])
b_tik = np.concatenate([b, np.zeros(n)])
x_tik, *_ = np.linalg.lstsq(A_tik, b_tik, rcond=None)

print(f"kappa(A) = {np.linalg.cond(A):.2e}")
for name, x in [("normal eq", x_ne), ("QR", x_qr), ("SVD", x_svd), ("Tikhonov", x_tik)]:
    print(f"{name:10s} rel. error = {np.linalg.norm(x - x_true) / np.linalg.norm(x_true):.2e}")
```

预期现象（以实际运行为准）：$\kappa(A)$ 约在 $10^{7}$–$10^{8}$ 量级，正规方程的相对误差比 QR/SVD 大若干个数量级。[NEEDS VERIFICATION: 具体数值需运行确认]

### 9.3 关联实验（计划中）

- `05_experiments/linear_algebra/lstsq_normal_vs_qr/`：对应 curriculum 实验 **E3**——随多项式阶数增大，绘制 $\kappa(A)$ 与三种方法相对误差的双对数图，验证误差 $\propto \kappa^2u$ vs. $\propto \kappa u$。（目录尚未创建）
- `05_experiments/linear_algebra/gram_schmidt_orthogonality/`：curriculum 实验 **E2**。（目录尚未创建）

---

## 10. Engineering Applications | 工程应用

| 领域 | 具体问题 | 最小二乘的角色 | 最先失效的假设 |
|---|---|---|---|
| **1 · AI 与数据科学** | 线性回归、岭回归（ridge regression）、核方法、随机特征模型 | 岭回归 ≡ Tikhonov（§5.8）；PCA 的低秩逼近 ≡ 截断 SVD；神经网络最后一层线性读出常以最小二乘闭式求解 | A3（同方差）、A5（离群点）；特征共线 ⟹ $\kappa$ 巨大 |
| **3 · 机器人与具身智能** | 系统辨识（ARX 模型、刚体惯性参数辨识）；相机/IMU 标定；冗余机械臂逆运动学 $\dot{\mathbf{q}} = J^+\dot{\mathbf{x}}$ | 动力学对惯性参数线性（回归矩阵形式 $\boldsymbol\tau = Y(\mathbf{q},\dot{\mathbf{q}},\ddot{\mathbf{q}})\boldsymbol\pi$），激励轨迹设计即最小化 $\kappa(Y)$；奇异位形附近用阻尼最小二乘（damped least squares，即 Tikhonov）避免关节速度爆炸 | A2（$Y$ 由含噪的 $\ddot{\mathbf{q}}$ 构成，errors-in-variables） |
| **7 · 医学成像** | CT 代数重建（ART/SIRT）、低剂量 CT、MRI 并行成像（SENSE） | 离散 Radon 变换 $A\mathbf{x} = \mathbf{b}$，$A$ 巨大稀疏、严重病态；LSQR + 正则化是标准工具 | A3（光子计数为 Poisson 噪声，需加权或 Poisson 似然） |
| **2 · 半导体与集成电路** | 紧凑模型（compact model）参数提取；工艺参数回归；光刻 OPC 模型校准 | 线性化后的 Gauss–Newton 迭代每步是一个加权最小二乘 | A1（器件模型强非线性）、A4（I–V 跨越多个数量级，需对数或相对误差加权） |
| **4 · 先进制造与多物理场** | 传感器标定、热电偶阵列反演热流（逆热传导问题） | 逆热传导问题核函数光滑 ⟹ 奇异值指数衰减 ⟹ 必须正则化 | 数值上的不适定性（§6） |
| **6 · 计算机体系结构与 HPC** | 高瘦矩阵 QR（TSQR）、通信避免算法 | 对 $m \gg n$ 矩阵按行分块并行 QR，再归约 $R$ 因子；通信量远低于 Householder 逐列方式 | — |

---

## 11. References | 参考资料

1. L. N. Trefethen & D. Bau III, *Numerical Linear Algebra*, SIAM, 1997. Lecture 6（投影算子）、Lectures 7–10（QR 与 Householder）、**Lecture 11（Least Squares Problems）**、**Lecture 18（Conditioning of Least Squares Problems）**、Lecture 19（稳定性）。 [NEEDS VERIFICATION: 讲次编号凭记忆，需核对目录]
2. G. H. Golub & C. F. Van Loan, *Matrix Computations*, 4th ed., Johns Hopkins Univ. Press, 2013. **Chapter 5（Orthogonalization and Least Squares）**；§6.1（Tikhonov / 带约束最小二乘）。 [NEEDS VERIFICATION: 节号]
3. G. Strang, *Introduction to Linear Algebra*, 5th ed. (2016) / 6th ed. (2023), Wellesley-Cambridge Press. **Chapter 4（Orthogonality）**：§4.2 Projections，§4.3 Least Squares Approximations；Chapter 7（SVD，伪逆）。
4. P. C. Hansen, *Discrete Inverse Problems: Insight and Algorithms*, SIAM, 2010. Ch. 4–5（滤波因子、Tikhonov、L-曲线）。 [NEEDS VERIFICATION: 章号]
5. Å. Björck, *Numerical Methods for Least Squares Problems*, SIAM, 1996.（专著级参考，Gauss–Markov 与扰动理论）
6. S. Boyd & L. Vandenberghe, *Introduction to Applied Linear Algebra: Vectors, Matrices, and Least Squares*, Cambridge Univ. Press, 2018. Ch. 12–15（最小二乘、数据拟合、多目标/正则化最小二乘）。
7. C. C. Paige & M. A. Saunders, "LSQR: An Algorithm for Sparse Linear Equations and Sparse Least Squares," *ACM Trans. Math. Softw.* 8(1):43–71, 1982.
8. MIT OCW **18.06** *Linear Algebra*（Strang），Lectures 15–17（Projections, Least Squares, Orthogonal matrices and Gram–Schmidt）。 [NEEDS VERIFICATION: 讲次编号]

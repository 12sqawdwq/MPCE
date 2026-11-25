# Eigenvalue Problems and the Spectral Theorem | 特征值问题与谱定理

<!--
CONTRIBUTING 七问（简答）
1 定位：ROADMAP Phase I, I.3（特征值与谱定理）；为 I.4（SVD）、II.1（x' = Ax）、II.4（Sturm–Liouville）、IV.1（量子力学）铺路。
2 先修：MATH-LA-01（内积、正交补、子空间维数）；行列式的基本性质；代数基本定理（陈述即可）。
3 结构：Sturm–Liouville 理论与量子力学自伴算子的有限维原型；Rayleigh 商是变分原理（MATH-VAR-01）的有限维形式。
4 推导：L1 必证——实对称矩阵的谱定理（完整归纳证明）、Rayleigh 商界、Courant–Fischer 极小极大原理、广义特征问题的对称化、由特征分解构造 SVD。
5 计算：幂迭代收敛率 |λ2/λ1|；N 质点链简正模与解析解对照（curriculum E4、E6）。
6 应用：领域 5（Schrödinger/Kohn–Sham）、4（模态分析）、1（PCA）、3（稳定性）、2（子带）。
7 代价：约 14–16 h。
-->

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-LA-02`（Eigenvalue Problems and the Spectral Theorem）· 关联 `MATH-LA-03`、`MATH-DE-01`、`MATH-FA-03`、`MATH-VAR-01` |
| Phase | Phase I — ROADMAP **I.3**（主）；I.4（SVD 构造）；回访于 II.4、IV.1 |
| Prerequisites | `MATH-LA-01`（内积、正交补、维数公式）；行列式；代数基本定理 |
| Primary References | Axler, *Linear Algebra Done Right* 4e, Ch. 5, 7；Horn & Johnson, *Matrix Analysis* 2e, Ch. 1, 2, 4；Parlett, *The Symmetric Eigenvalue Problem*；Trefethen & Bau, Lectures 24–31 |

---

## 1. Physical Motivation | 物理动机

许多物理系统在某些特殊"方向"上的行为极其简单：线性映射只把它们**伸缩**而不改变方向。这些方向称为**特征向量（eigenvector）**，伸缩因子称为**特征值（eigenvalue）**。它们之所以在物理与工程中无处不在，是因为：

- **振动**：多自由度结构 $M\ddot{\mathbf{x}} + K\mathbf{x} = \mathbf{0}$ 的一般运动是若干**简正模（normal mode）**的叠加，每个模以固有频率 $\omega_i$ 振动，$K\boldsymbol\phi_i = \omega_i^2 M\boldsymbol\phi_i$。
- **量子力学**：可观测量是自伴算子；能级是 Hamilton 算符的特征值 $\hat{H}\psi = E\psi$，测量结果只能是特征值。
- **稳定性**：线性系统 $\dot{\mathbf{x}} = A\mathbf{x}$ 的解为 $e^{At}\mathbf{x}_0$，其增长或衰减完全由 $A$ 的特征值实部决定。
- **数据**：协方差矩阵的特征向量给出数据方差最大的方向（主成分分析，PCA）。

本文要回答的问题：

1. 特征值为何存在？"特征多项式"与"算子"两种观点如何互补？（§5.1–5.2）
2. 为什么**实对称**矩阵（以及 Hermitian 算子）特别好——特征值全实、特征向量可取正交？（§5.3–5.4，谱定理的完整证明）
3. 特征值如何用**变分原理**刻画？（§5.5–5.6，Rayleigh 商与 Courant–Fischer）
4. 广义特征问题与 SVD 如何归结为对称特征问题？（§5.7–5.8）

---

## 2. Physical Assumptions | 物理假设

| 编号 | 假设 | 含义 / 失效后果 |
|---|---|---|
| A1 | **有限维**：$A \in \mathbb{F}^{n\times n}$，$\mathbb{F} = \mathbb{R}$ 或 $\mathbb{C}$ | 无穷维（微分算子）时谱可以含连续谱，需泛函分析（`MATH-FA-03`、`MATH-FA-04`）；本文给出离散化后的有限维模型 |
| A2 | **对称 / 自伴**：$A = A^\top$（实）或 $A = A^*$（复）；用于 §5.3 起的全部结论 | 物理上对应**能量守恒、无耗散**系统（无阻尼、无增益、无陀螺效应）。非对称时特征值可为复数、特征向量非正交、可能不可对角化 |
| A3 | **线性**：小振幅 / 线性化模型 | 大变形、非线性材料下模态概念仅局部有效 |
| A4 | 广义问题 $K\boldsymbol\phi = \lambda M\boldsymbol\phi$ 中 **$M$ 对称正定**、$K$ 对称半正定 | 物理上：动能正定（每个自由度都有质量）、势能非负（结构稳定）。若 $M$ 奇异（无质量自由度），需静力凝聚 |
| A5 | 振动问题中**无阻尼**，或阻尼为比例阻尼（Rayleigh damping，$C = aM + bK$） | 一般阻尼导致二次特征值问题 $(\lambda^2M + \lambda C + K)\boldsymbol\phi = \mathbf{0}$，实模态不再解耦 |

---

## 3. Mathematical Definitions | 数学定义

| 符号 | 含义 | 所在空间 / 量纲 |
|---|---|---|
| $A$ | 方阵 / 线性算子 $A: \mathbb{F}^n \to \mathbb{F}^n$ | $\mathbb{F}^{n\times n}$ |
| $(\lambda, \mathbf{x})$ | **特征对（eigenpair）**：$A\mathbf{x} = \lambda\mathbf{x}$，$\mathbf{x} \ne \mathbf{0}$ | $\lambda \in \mathbb{C}$，$[\lambda] = [A]$ |
| $p_A(\lambda) := \det(\lambda I - A)$ | **特征多项式（characteristic polynomial）**，首一、$n$ 次 | — |
| $E_\lambda := \ker(A - \lambda I)$ | 特征子空间（eigenspace）；$\dim E_\lambda$ 为**几何重数** | — |
| 代数重数 | $\lambda$ 作为 $p_A$ 根的重数；恒有 几何重数 $\le$ 代数重数 | — |
| $\sigma(A)$ | 谱（spectrum）：全体特征值 | $\subset\mathbb{C}$ |
| $A^*$ | 共轭转置；实情形 $A^* = A^\top$ | — |
| $Q$ | 正交矩阵：$Q^\top Q = I$（复情形为酉矩阵 $Q^*Q = I$） | — |
| $\Lambda = \operatorname{diag}(\lambda_1,\dots,\lambda_n)$ | 特征值对角阵；对称情形约定 $\lambda_1 \le \lambda_2 \le \cdots \le \lambda_n$ | — |
| $R_A(\mathbf{x}) := \dfrac{\mathbf{x}^\top A\mathbf{x}}{\mathbf{x}^\top\mathbf{x}}$ | **Rayleigh 商（Rayleigh quotient）**，$\mathbf{x} \ne \mathbf{0}$ | $[A]$ |
| $K, M$ | 刚度矩阵（stiffness matrix）、质量矩阵（mass matrix） | $[K] = \mathrm{N/m}$，$[M] = \mathrm{kg}$（离散弹簧-质量系统） |
| $\omega$ | 角频率（angular frequency） | $\mathrm{rad/s}$ |
| $\hat{H}$ | Hamilton 算符（Hamiltonian），$E$ 为能量本征值 | $\mathrm{J}$ |

**两种观点**：

- **特征多项式观点（代数）**：$\lambda \in \sigma(A) \iff p_A(\lambda) = 0$。便于手算 $2\times 2$、$3\times 3$，但**不是**数值算法（§9.1）。
- **算子观点（几何）**：$\lambda$ 是特征值 $\iff$ $A - \lambda I$ 不是单射 $\iff$ 存在一维**不变子空间**（invariant subspace）$\operatorname{span}\{\mathbf{x}\}$，$A$ 在其上作用为乘以 $\lambda$。这一观点可推广到无穷维（微分算子），也是谱定理证明的主线。

---

## 4. Governing Principles | 基本原理

1. **可逆性判据**：方阵 $B$ 可逆 $\iff \ker B = \{\mathbf{0}\} \iff \det B \ne 0$。
2. **代数基本定理**：任一 $n \ge 1$ 次复系数多项式在 $\mathbb{C}$ 中至少有一个根。
3. **正交补的维数**：若 $W \subseteq \mathbb{R}^n$，则 $\dim W + \dim W^\perp = n$；单位向量 $\mathbf{q}$ 可扩充为 $\mathbb{R}^n$ 的规范正交基（Gram–Schmidt）。
4. **维数公式**：子空间 $S, T \subseteq \mathbb{R}^n$ 满足 $\dim(S\cap T) \ge \dim S + \dim T - n$。
5. **伴随的定义性质**：$\langle A\mathbf{x}, \mathbf{y}\rangle = \langle\mathbf{x}, A^*\mathbf{y}\rangle$。

**特征值问题（Eigenvalue Problem）**：求 $\lambda \in \mathbb{C}$ 与 $\mathbf{x} \ne \mathbf{0}$ 使 $A\mathbf{x} = \lambda\mathbf{x}$；**广义特征值问题**：$K\mathbf{x} = \lambda M\mathbf{x}$。

---

## 5. Mathematical Derivation | 数学推导

### 5.1 特征值 ⟺ 特征多项式的根

**Step 1** $A\mathbf{x} = \lambda\mathbf{x}$，$\mathbf{x} \ne \mathbf{0}$ $\iff$ $(A - \lambda I)\mathbf{x} = \mathbf{0}$ 有非零解 $\iff \ker(A - \lambda I) \ne \{\mathbf{0}\}$ [代数移项]。

**Step 2** $\iff A - \lambda I$ 不可逆 $\iff \det(A - \lambda I) = 0 \iff p_A(\lambda) = 0$ [基本原理 1]。

**Step 3（存在性）** $p_A$ 为 $n$ 次首一多项式，由代数基本定理，在 $\mathbb{C}$ 中恰有 $n$ 个根（计重数）。故**每个复方阵至少有一个特征值**。

> **注意**：实矩阵的特征值可以是复数，例如二维旋转 $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$，$p_A = \lambda^2 + 1$，$\lambda = \pm i$——旋转没有保持不变的实方向。

### 5.2 算子观点下的存在性（不用行列式）

此证明来自 Axler，展示"算子观点"的力量，并可推广。

**Step 1** 任取 $\mathbf{v} \ne \mathbf{0}$。$n+1$ 个向量 $\mathbf{v}, A\mathbf{v}, \dots, A^n\mathbf{v}$ 在 $n$ 维空间中必线性相关 [维数]：存在不全为零的 $a_0,\dots,a_n$ 使 $\sum_{k=0}^{n}a_kA^k\mathbf{v} = \mathbf{0}$。令 $m := \max\{k: a_k \ne 0\}$；$m \ge 1$（否则 $a_0\mathbf{v} = \mathbf{0}$ 迫使 $a_0 = 0$）。

**Step 2** 对多项式 $q(z) := \sum_{k=0}^{m}a_kz^k$ 在 $\mathbb{C}$ 上因式分解 [代数基本定理]：$q(z) = a_m(z-\mu_1)\cdots(z-\mu_m)$。于是

$$
\mathbf{0} = q(A)\mathbf{v} = a_m(A-\mu_1I)(A-\mu_2I)\cdots(A-\mu_mI)\mathbf{v}.
$$

**Step 3** 若每个 $A - \mu_jI$ 都是单射，则它们的乘积也是单射，作用于 $\mathbf{v} \ne \mathbf{0}$ 不可能得 $\mathbf{0}$。故至少一个 $A - \mu_jI$ 非单射，$\mu_j$ 即特征值。$\square$

### 5.3 实对称矩阵：特征值为实数，且特征向量可取实向量

**假设** A2：$A \in \mathbb{R}^{n\times n}$，$A = A^\top$。

**Step 1（特征值为实）** 设 $A\mathbf{x} = \lambda\mathbf{x}$，$\mathbf{x} \in \mathbb{C}^n\setminus\{\mathbf{0}\}$，$\lambda \in \mathbb{C}$ [§5.1 保证存在]。考虑标量 $s := \mathbf{x}^*A\mathbf{x}$：

$$
\bar s = (\mathbf{x}^*A\mathbf{x})^* = \mathbf{x}^*A^*\mathbf{x} = \mathbf{x}^*A\mathbf{x} = s \quad[\,A^* = \bar A^\top = A^\top = A\,],
$$

故 $s \in \mathbb{R}$。又 $s = \mathbf{x}^*(\lambda\mathbf{x}) = \lambda\lVert\mathbf{x}\rVert^2$，$\lVert\mathbf{x}\rVert^2 > 0$ 为实数，所以 $\lambda = s/\lVert\mathbf{x}\rVert^2 \in \mathbb{R}$。

**Step 2（实特征向量）** $\lambda$ 为实，$A - \lambda I$ 为实奇异矩阵，其实零空间非平凡（实系数齐次线性方程组的 Gauss 消元在 $\mathbb{R}$ 中进行）。故存在实特征向量。

**Step 3（不同特征值的特征向量正交）** 设 $A\mathbf{x} = \lambda\mathbf{x}$，$A\mathbf{y} = \mu\mathbf{y}$，$\lambda \ne \mu$：

$$
\lambda\,\mathbf{y}^\top\mathbf{x} = \mathbf{y}^\top A\mathbf{x} = (A^\top\mathbf{y})^\top\mathbf{x} = (A\mathbf{y})^\top\mathbf{x} = \mu\,\mathbf{y}^\top\mathbf{x}
\;\Longrightarrow\; (\lambda - \mu)\,\mathbf{y}^\top\mathbf{x} = 0 \;\Longrightarrow\; \mathbf{y}^\top\mathbf{x} = 0 .
$$

**物理含义**：在保守系统中，不同频率的振动模式互不交换能量（正交性 ⟹ 能量可按模式分解）。

> Step 3 不足以证明谱定理：重特征值时，特征子空间内的向量未必自动正交，且尚未证明特征向量的个数够 $n$ 个。§5.4 用归纳法同时解决这两点。

### 5.4 实对称谱定理（Real Symmetric Spectral Theorem）的完整证明

**定理**：若 $A \in \mathbb{R}^{n\times n}$ 对称，则存在正交矩阵 $Q$ 与实对角阵 $\Lambda$ 使

$$
\boxed{\,A = Q\Lambda Q^\top = \sum_{i=1}^{n}\lambda_i\,\mathbf{q}_i\mathbf{q}_i^\top\,}
$$

即 $\mathbb{R}^n$ 有一组由 $A$ 的特征向量构成的规范正交基。

**证明（对 $n$ 归纳）**

- **基础** $n = 1$：$A = [a]$，取 $Q = [1]$，$\Lambda = [a]$。
- **归纳假设**：结论对所有 $(n-1)\times(n-1)$ 实对称矩阵成立。
- **Step 1（取一个实特征对）** 由 §5.3，$A$ 有实特征值 $\lambda_1$ 与实单位特征向量 $\mathbf{q}_1$。
- **Step 2（正交补是不变子空间）** 令 $W := \mathbf{q}_1^\perp$，$\dim W = n-1$ [基本原理 3]。对任意 $\mathbf{w} \in W$：

$$
\mathbf{q}_1^\top(A\mathbf{w}) = (A^\top\mathbf{q}_1)^\top\mathbf{w} = (A\mathbf{q}_1)^\top\mathbf{w} = \lambda_1\mathbf{q}_1^\top\mathbf{w} = 0 ,
$$

  故 $A\mathbf{w} \in W$：**$A$ 把 $W$ 映入自身**。这里**对称性是关键**；对一般矩阵，$\mathbf{q}_1^\perp$ 不必不变。
- **Step 3（分块）** 把 $\mathbf{q}_1$ 扩充为规范正交基，令 $Q_1 := [\,\mathbf{q}_1\ \ \tilde Q\,]$，$\tilde Q \in \mathbb{R}^{n\times(n-1)}$ 的列为 $W$ 的规范正交基。则

$$
Q_1^\top AQ_1 = \begin{bmatrix}\mathbf{q}_1^\top A\mathbf{q}_1 & \mathbf{q}_1^\top A\tilde Q\\ \tilde Q^\top A\mathbf{q}_1 & \tilde Q^\top A\tilde Q\end{bmatrix} = \begin{bmatrix}\lambda_1 & \mathbf{0}^\top\\ \mathbf{0} & \tilde A\end{bmatrix},
$$

  其中 $\mathbf{q}_1^\top A\mathbf{q}_1 = \lambda_1$；$\tilde Q^\top A\mathbf{q}_1 = \lambda_1\tilde Q^\top\mathbf{q}_1 = \mathbf{0}$；右上块为左下块的转置（或由 Step 2）；$\tilde A := \tilde Q^\top A\tilde Q$ 满足 $\tilde A^\top = \tilde Q^\top A^\top\tilde Q = \tilde A$，是 $(n-1)$ 阶实对称阵。
- **Step 4（归纳）** 由归纳假设，$\tilde A = \tilde V\tilde\Lambda\tilde V^\top$，$\tilde V$ 正交。令

$$
Q := Q_1\begin{bmatrix}1 & \mathbf{0}^\top\\ \mathbf{0} & \tilde V\end{bmatrix},\qquad \Lambda := \begin{bmatrix}\lambda_1 & \\ & \tilde\Lambda\end{bmatrix}.
$$

  两个正交矩阵之积正交，且 $Q^\top AQ = \begin{bmatrix}1&\\&\tilde V^\top\end{bmatrix}\begin{bmatrix}\lambda_1&\\&\tilde A\end{bmatrix}\begin{bmatrix}1&\\&\tilde V\end{bmatrix} = \Lambda$。$\square$

**解释**：严格陈述之后的直观图像——对称矩阵沿一组**互相垂直**的方向做纯伸缩（伸缩因子可为负）。形式 $A = \sum\lambda_i\mathbf{q}_i\mathbf{q}_i^\top$ 把 $A$ 写成到各特征方向的正交投影的加权和。

**复 Hermitian 推广**：把 $^\top$ 换成 $^*$、正交换成酉，证明逐字成立（§5.3 Step 1 已在 $\mathbb{C}$ 中进行）。这正是量子力学有限维模型的数学基础。

**推论（正定性判据）**：对称 $A$ 正定 $\iff$ 全部 $\lambda_i > 0$。*证明*：$\mathbf{x}^\top A\mathbf{x} = \sum\lambda_i(\mathbf{q}_i^\top\mathbf{x})^2$；取 $\mathbf{x} = \mathbf{q}_j$ 得必要性，求和形式得充分性。

### 5.5 Rayleigh 商：特征值的变分刻画

**Step 1（坐标变换）** 令 $\mathbf{y} := Q^\top\mathbf{x}$。由谱定理及 $\lVert\mathbf{y}\rVert = \lVert\mathbf{x}\rVert$：

$$
R_A(\mathbf{x}) = \frac{\mathbf{x}^\top Q\Lambda Q^\top\mathbf{x}}{\mathbf{x}^\top\mathbf{x}} = \frac{\sum_{i}\lambda_iy_i^2}{\sum_iy_i^2}.
$$

**Step 2（界）** 这是 $\lambda_i$ 以非负权 $y_i^2/\sum y_j^2$ 的加权平均，因此

$$
\boxed{\,\lambda_1 = \min_{\mathbf{x}\ne\mathbf{0}}R_A(\mathbf{x}),\qquad \lambda_n = \max_{\mathbf{x}\ne\mathbf{0}}R_A(\mathbf{x})\,}
$$

分别在 $\mathbf{x} = \mathbf{q}_1$、$\mathbf{q}_n$ 处取到。

**Step 3（驻点 = 特征向量）** [商的求导法则]：

$$
\nabla R_A(\mathbf{x}) = \frac{2A\mathbf{x}\,(\mathbf{x}^\top\mathbf{x}) - (\mathbf{x}^\top A\mathbf{x})\,2\mathbf{x}}{(\mathbf{x}^\top\mathbf{x})^2} = \frac{2}{\mathbf{x}^\top\mathbf{x}}\big(A\mathbf{x} - R_A(\mathbf{x})\,\mathbf{x}\big).
$$

故 $\nabla R_A(\mathbf{x}) = \mathbf{0} \iff A\mathbf{x} = R_A(\mathbf{x})\mathbf{x}$：**Rayleigh 商的驻点恰为特征向量，驻值恰为特征值**。

**Step 4（二阶精度）** 若 $\mathbf{x} = \mathbf{q}_j + \boldsymbol\varepsilon$，$\lVert\boldsymbol\varepsilon\rVert$ 小，则驻点性质给出 $R_A(\mathbf{x}) = \lambda_j + O(\lVert\boldsymbol\varepsilon\rVert^2)$：**特征向量误差为一阶时，Rayleigh 商估计的特征值误差为二阶**。这是 Rayleigh–Ritz 法与 Rayleigh 商迭代高效的原因。

**物理含义**：对 $K\boldsymbol\phi = \omega^2M\boldsymbol\phi$，广义 Rayleigh 商 $\dfrac{\boldsymbol\phi^\top K\boldsymbol\phi}{\boldsymbol\phi^\top M\boldsymbol\phi} = \dfrac{\text{最大势能}}{\text{最大动能}/\omega^2}$——Rayleigh 原理：用任意合理的试探振型估计基频，结果总是**偏高**，且误差为二阶小量。量子力学中 $E_0 \le \langle\psi|\hat{H}|\psi\rangle/\langle\psi|\psi\rangle$ 是同一命题（变分法）。

### 5.6 Courant–Fischer 极小极大原理（Min-Max Principle）

§5.5 只刻画了最小与最大特征值。中间的 $\lambda_k$ 如何不借助其他特征向量来刻画？

**定理**（Courant–Fischer）：对实对称 $A$，特征值升序排列 $\lambda_1 \le \cdots \le \lambda_n$，

$$
\boxed{\,\lambda_k = \min_{\substack{S\subseteq\mathbb{R}^n\\ \dim S = k}}\ \max_{\mathbf{x}\in S\setminus\{\mathbf{0}\}}R_A(\mathbf{x})\,}
$$

**证明**

- **（$\le$ 方向，构造）** 取 $S_k := \operatorname{span}\{\mathbf{q}_1,\dots,\mathbf{q}_k\}$。对 $\mathbf{x} \in S_k$，$y_i = 0\ (i > k)$，由 §5.5 Step 1，$R_A(\mathbf{x}) \le \lambda_k$，且在 $\mathbf{q}_k$ 处取等。故 $\max_{S_k}R_A = \lambda_k$，从而 $\min_S\max \le \lambda_k$。
- **（$\ge$ 方向，维数论证）** 任取 $\dim S = k$。令 $T := \operatorname{span}\{\mathbf{q}_k,\dots,\mathbf{q}_n\}$，$\dim T = n-k+1$。由基本原理 4：$\dim(S\cap T) \ge k + (n-k+1) - n = 1$，故存在 $\mathbf{x} \in S\cap T$，$\mathbf{x} \ne \mathbf{0}$。由于 $\mathbf{x} \in T$，$y_i = 0\ (i < k)$，所以 $R_A(\mathbf{x}) = \sum_{i\ge k}\lambda_iy_i^2/\sum_{i\ge k}y_i^2 \ge \lambda_k$。于是 $\max_{S}R_A \ge \lambda_k$ 对每个 $S$ 成立，从而 $\min_S\max \ge \lambda_k$。$\square$

**推论 1（Rayleigh–Ritz 上界，FEM 频率偏高）**：设 $V \in \mathbb{R}^{n\times m}$ 列规范正交，Ritz 值 $\theta_1 \le \cdots \le \theta_m$ 为 $V^\top AV$ 的特征值。对 $k \le m$，$\theta_k = \min_{\dim S=k,\,S\subseteq\operatorname{col}V}\max R_A \ge \lambda_k$（在更小的子空间族中取极小，结果不会更小）。物理上：**协调有限元（conforming FEM）在一致质量矩阵下计算的固有频率是真实频率的上界**——有限元模型"偏刚"。[NEEDS VERIFICATION: 无穷维到有限维的严格版本需 $H^1$ 协调性与一致质量矩阵，见 Strang & Fix, *An Analysis of the Finite Element Method*, Ch. 6]

**推论 2（Weyl 扰动不等式）**：对对称 $A, E$，$\lvert\lambda_k(A+E) - \lambda_k(A)\rvert \le \lVert E\rVert_2$。*证明要点*：$R_{A+E}(\mathbf{x}) = R_A(\mathbf{x}) + R_E(\mathbf{x})$，且 $\lvert R_E\rvert \le \lVert E\rVert_2$，代入 min-max 即得。**结论：对称矩阵的特征值是完美良态的（绝对条件数为 1）**。

### 5.7 广义特征问题与振动方程

**Step 1（由运动方程导出）** 无阻尼多自由度系统 $M\ddot{\mathbf{x}} + K\mathbf{x} = \mathbf{0}$（A3–A5）。试探同步运动 $\mathbf{x}(t) = \boldsymbol\phi\cos(\omega t - \varphi)$ [分离变量]，代入得

$$
(K - \omega^2M)\boldsymbol\phi\cos(\omega t-\varphi) = \mathbf{0}\ \ \forall t \;\Longrightarrow\; \boxed{\,K\boldsymbol\phi = \omega^2M\boldsymbol\phi\,}.
$$

**Step 2（对称化）** $M$ 对称正定（A4），有 Cholesky 分解 $M = LL^\top$。令 $\mathbf{z} := L^\top\boldsymbol\phi$：

$$
K\boldsymbol\phi = \lambda LL^\top\boldsymbol\phi \iff \underbrace{L^{-1}KL^{-\top}}_{=:\,\tilde K\ (\text{对称})}\mathbf{z} = \lambda\mathbf{z}.
$$

$\tilde K$ 对称（$\tilde K^\top = L^{-1}K^\top L^{-\top} = \tilde K$），§5.4 适用：$\lambda_i$ 全实；$\mathbf{z}_i$ 规范正交。

**Step 3（$M$-正交性）** 回到原变量：$\delta_{ij} = \mathbf{z}_i^\top\mathbf{z}_j = \boldsymbol\phi_i^\top LL^\top\boldsymbol\phi_j = \boldsymbol\phi_i^\top M\boldsymbol\phi_j$，并由 $K\boldsymbol\phi_j = \lambda_jM\boldsymbol\phi_j$ 得 $\boldsymbol\phi_i^\top K\boldsymbol\phi_j = \lambda_j\delta_{ij}$。令 $\Phi := [\boldsymbol\phi_1,\dots,\boldsymbol\phi_n]$：

$$
\Phi^\top M\Phi = I,\qquad \Phi^\top K\Phi = \Lambda = \operatorname{diag}(\omega_1^2,\dots,\omega_n^2).
$$

**Step 4（模态解耦）** 代入 $\mathbf{x} = \Phi\boldsymbol\eta$ 并左乘 $\Phi^\top$：$\ddot\eta_i + \omega_i^2\eta_i = 0$，$n$ 个独立谐振子。$K$ 半正定 ⟹ $\omega_i^2 = \boldsymbol\phi_i^\top K\boldsymbol\phi_i \ge 0$，频率为实；$\omega_i = 0$ 对应刚体模态（$\ker K$）。

### 5.8 与 SVD 的联系：由对称特征分解构造 SVD

对任意 $A \in \mathbb{R}^{m\times n}$：

**Step 1** $A^\top A$ 对称半正定，由谱定理 $A^\top A = V\operatorname{diag}(\lambda_1,\dots,\lambda_n)V^\top$，$\lambda_i = \lVert A\mathbf{v}_i\rVert^2 \ge 0$。按降序排列，设前 $r$ 个为正。

**Step 2** 定义 $\sigma_i := \sqrt{\lambda_i}$，$\mathbf{u}_i := A\mathbf{v}_i/\sigma_i\ (i \le r)$。验证正交规范性：

$$
\mathbf{u}_i^\top\mathbf{u}_j = \frac{\mathbf{v}_i^\top A^\top A\mathbf{v}_j}{\sigma_i\sigma_j} = \frac{\sigma_j^2\,\mathbf{v}_i^\top\mathbf{v}_j}{\sigma_i\sigma_j} = \delta_{ij}.
$$

**Step 3** 把 $\{\mathbf{u}_i\}_{i\le r}$ 扩充为 $\mathbb{R}^m$ 的规范正交基；对 $i > r$，$A\mathbf{v}_i = \mathbf{0}$（因 $\lVert A\mathbf{v}_i\rVert^2 = \lambda_i = 0$）。于是 $AV = U\Sigma$，即 $A = U\Sigma V^\top$。$\square$

**对称嵌入**：$\begin{bmatrix}0 & A\\ A^\top & 0\end{bmatrix}$ 的非零特征值为 $\pm\sigma_i$，对应特征向量 $\tfrac{1}{\sqrt2}\begin{bmatrix}\mathbf{u}_i\\ \pm\mathbf{v}_i\end{bmatrix}$——SVD 本质上是一个对称特征问题。

> 数值上**不要**通过 $A^\top A$ 的特征分解计算 SVD：$\kappa$ 被平方（见 [`linear_least_squares.md`](linear_least_squares.md) §5.6）。

### 5.9 三个应用推导

**(a) 量子力学 $\hat{H}\psi = E\psi$。** 一维 Hamilton 算符 $\hat{H} = -\frac{\hbar^2}{2m}\frac{\mathrm{d}^2}{\mathrm{d}x^2} + V(x)$ 在区间 $[0, L]$、$\psi(0) = \psi(L) = 0$ 上，用 $N$ 个内点、步长 $h$ 的中心差分离散为

$$
H_h = \frac{\hbar^2}{2mh^2}\operatorname{tridiag}(-1, 2, -1) + \operatorname{diag}(V(x_1),\dots,V(x_N)),
$$

实对称 [§5.4 适用]：能级全实，本征态正交——这是"可观测量为自伴算子"在离散模型中的直接体现。基态能量 $E_0 = \min R_{H_h}$（变分原理）。

**(b) PCA。** 中心化数据 $X \in \mathbb{R}^{N\times d}$，样本协方差 $C = X^\top X/(N-1)$ 对称半正定。沿单位方向 $\mathbf{w}$ 的投影方差为 $\mathbf{w}^\top C\mathbf{w}$。问题 $\max\mathbf{w}^\top C\mathbf{w}$ s.t. $\mathbf{w}^\top\mathbf{w} = 1$ 的 Lagrange 函数 $\mathcal{L} = \mathbf{w}^\top C\mathbf{w} - \mu(\mathbf{w}^\top\mathbf{w} - 1)$，驻点条件 $C\mathbf{w} = \mu\mathbf{w}$ [Lagrange 乘子]；目标值 $= \mu$，故取最大特征值。第 $k$ 主成分由 Courant–Fischer（取 max-min 形式）给出。数值上用 $X$ 的 SVD：$\mathbf{w}_k = \mathbf{v}_k$，方差 $= \sigma_k^2/(N-1)$。

**(c) 线性系统稳定性。** $\dot{\mathbf{x}} = A\mathbf{x}$。若 $A = S\Lambda S^{-1}$ 可对角化（不要求对称），则 $\mathbf{x}(t) = Se^{\Lambda t}S^{-1}\mathbf{x}_0$，$\lVert\mathbf{x}(t)\rVert \le \kappa(S)\,e^{\alpha(A)t}\lVert\mathbf{x}_0\rVert$，其中谱横坐标 $\alpha(A) := \max_i\operatorname{Re}\lambda_i$。故 **渐近稳定 $\iff \alpha(A) < 0$**（不可对角化时结论仍成立，需 Jordan 形或 Schur 形证明；离散时间 $\mathbf{x}_{k+1} = A\mathbf{x}_k$ 对应谱半径 $\rho(A) < 1$）。**警告**：$\kappa(S)$ 很大（高度非正规，non-normal）时，即使 $\alpha < 0$ 也可能有巨大的瞬态增长——特征值不能说明全部故事。对称 $A$ 时 $\kappa(S) = 1$，无此问题。

---

## 6. Solvability / Existence & Uniqueness | 可解性与存在唯一性条件

| 问题 | 条件 | 结论 |
|---|---|---|
| $A\mathbf{x} = \lambda\mathbf{x}$，$A \in \mathbb{C}^{n\times n}$ | 无 | 恰有 $n$ 个复特征值（计代数重数）[§5.1] |
| 可对角化 $A = S\Lambda S^{-1}$ | 每个特征值的几何重数 = 代数重数；**充分条件**：$n$ 个互异特征值 | 否则存在 Jordan 块，如 $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ |
| 正交对角化 | **$A$ 实对称**（实情形）；**$A$ 正规** $AA^* = A^*A$（复情形，酉对角化） | §5.4 |
| 特征向量唯一性 | 单特征值：特征向量在相差非零标量倍意义下唯一（归一化后差一个符号/相位）；重特征值：只有特征子空间唯一 | 数值软件返回的特征向量符号是任意的——比较时需统一符号 |
| $K\boldsymbol\phi = \lambda M\boldsymbol\phi$ | $K$ 对称，$M$ 对称正定 | 实特征值，$M$-正交特征向量 [§5.7] |

**由 PDE 导出的特征问题需要边界条件**：例如 $-u'' = \lambda u$ 在 $(0,L)$ 上，Dirichlet 条件 $u(0)=u(L)=0$ 给出 $\lambda_n = (n\pi/L)^2$，$u_n = \sin(n\pi x/L)$；Neumann 条件给出 $\lambda_n = (n\pi/L)^2$，$n \ge 0$，$u_n = \cos(n\pi x/L)$（含 $\lambda_0 = 0$ 的常数模）。离散化后，Dirichlet 条件对应删去边界行列，Neumann 条件对应修改边界行——**两者都保持对称性**（若离散得当），这是自伴性在离散层面的体现。见 [`../differential_equations/wave_equation.md`](../differential_equations/wave_equation.md) §5.4 与 [`../differential_equations/heat_equation.md`](../differential_equations/heat_equation.md) §8。

---

## 7. Dimensional Analysis | 量纲分析

| 问题 | 量纲检验 |
|---|---|
| $A\mathbf{x} = \lambda\mathbf{x}$ | $[\lambda] = [A]$；特征向量方向无量纲（可任意缩放） |
| $K\boldsymbol\phi = \omega^2M\boldsymbol\phi$ | $[K]/[M] = (\mathrm{N/m})/\mathrm{kg} = \mathrm{s^{-2}}$ ⟹ $[\omega] = \mathrm{s^{-1}}$ ✓ |
| $\hat{H}\psi = E\psi$ | $\big[\tfrac{\hbar^2}{2m}\partial_x^2\big] = \dfrac{(\mathrm{J\,s})^2}{\mathrm{kg}\cdot\mathrm{m^2}} = \dfrac{\mathrm{J^2s^2}}{\mathrm{J\,s^2}} = \mathrm{J}$ ✓（用 $\mathrm{kg\,m^2} = \mathrm{J\,s^2}$） |
| Rayleigh 商 | $[R_A] = [\mathbf{x}]^2[A]/[\mathbf{x}]^2 = [A]$ ✓，与特征值同量纲 |
| PCA | $[C] = [\text{特征}]^2$；**特征单位不同时 PCA 结果依赖单位选择**——通常先标准化（相关矩阵 PCA） |

**标度与单位变换**：

- $A \to cA$ ⟹ $\lambda \to c\lambda$，特征向量不变。
- 改变状态变量单位，$\mathbf{x} = D\tilde{\mathbf{x}}$，得 $\tilde A = D^{-1}AD$：**相似变换保持特征值**（稳定性结论与单位无关 ✓），但**破坏对称性**（若 $D$ 非正交标量阵）。因此振动问题必须保持 $(K, M)$ 成对变换 $D^\top KD$、$D^\top MD$（合同变换），才能维持 §5.7 的对称结构。
- 无量纲化：振动问题以参考频率 $\omega_0 = \sqrt{k_0/m_0}$ 为尺度，$\tilde\lambda = \omega^2/\omega_0^2$。

---

## 8. Limiting Cases | 极限情形验证

| 情形 | 预期 | 验证 |
|---|---|---|
| $A$ 对角 | 特征值 = 对角元，特征向量 = 标准基 | $Q = I$ ✓ |
| $2\times2$ 对称 $\begin{bmatrix}a&b\\b&c\end{bmatrix}$ | $\lambda_\pm = \tfrac{a+c}{2} \pm \sqrt{\left(\tfrac{a-c}{2}\right)^2 + b^2}$ | 判别式为平方和 ⟹ 恒实 ✓（§5.3）；$b \to 0$ 回到对角元 ✓；$\lambda_+ - \lambda_- \ge 2\lvert b\rvert$：对称矩阵中耦合导致**能级排斥（level repulsion）** |
| 单自由度 $K = k$，$M = m$ | $\omega = \sqrt{k/m}$ | §5.7 直接给出 ✓ |
| 两质点–三弹簧（同 $k$、同 $m$），$K = k\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$ | $\omega_1 = \sqrt{k/m}$（同相），$\omega_2 = \sqrt{3k/m}$（反相） | 特征值 $k$、$3k$，特征向量 $(1,1)/\sqrt2$、$(1,-1)/\sqrt2$，正交 ✓ |
| 离散 Laplacian $T_N = \operatorname{tridiag}(-1,2,-1)/h^2$，$h = L/(N+1)$ | 连续极限 $-u'' = \lambda u$ 的 Dirichlet 特征值 $(j\pi/L)^2$ | 精确离散特征值 $\lambda_j = \dfrac{4}{h^2}\sin^2\!\dfrac{j\pi h}{2L}$，特征向量 $(\mathbf{v}_j)_i = \sin(j\pi x_i/L)$。固定 $j$、$h\to0$：$\lambda_j = (j\pi/L)^2\big(1 - \tfrac{(j\pi h)^2}{12L^2} + \cdots\big) \to (j\pi/L)^2$ ✓，且离散值偏**低**（有限差分不是 Rayleigh–Ritz 协调格式，推论 1 不适用） |
| 秩一矩阵 $A = \mathbf{u}\mathbf{u}^\top$ | $\lambda = \lVert\mathbf{u}\rVert^2$（一个），其余为 0 | $A\mathbf{u} = \mathbf{u}\lVert\mathbf{u}\rVert^2$；$\mathbf{u}^\perp \subseteq \ker A$ ✓ |
| 非对称反例 $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ | 谱定理失效 | $\lambda = 0$（代数重数 2，几何重数 1），不可对角化 ✓（A2 违背） |

**离散 Laplacian 特征值验证（显式计算）**：设 $v_i = \sin(i\theta)$，$\theta = j\pi h/L$。由 $\sin((i-1)\theta) + \sin((i+1)\theta) = 2\sin(i\theta)\cos\theta$ [和差化积]：

$$
\frac{-v_{i-1} + 2v_i - v_{i+1}}{h^2} = \frac{2 - 2\cos\theta}{h^2}\,v_i = \frac{4\sin^2(\theta/2)}{h^2}\,v_i .
$$

边界 $v_0 = \sin 0 = 0$，$v_{N+1} = \sin(j\pi) = 0$ 自动满足 Dirichlet 条件 ✓。

---

## 9. Numerical Implementation | 数值实现

### 9.1 为什么不通过特征多项式求根

特征多项式的根对系数极其敏感（Wilkinson 多项式 $\prod_{k=1}^{20}(x-k)$：$x^{19}$ 系数扰动 $2^{-23}$ 即令若干根变为复数）。而对称矩阵的特征值关于矩阵元是完美良态的（Weyl 不等式，§5.6）。**把良态问题转换为病态问题是数值分析的大忌**。实践中反方向操作：`numpy.roots` 正是通过求伴随矩阵（companion matrix）的特征值来求多项式根。

### 9.2 算法谱系

| 算法 | 用途 | 收敛性 / 代价 |
|---|---|---|
| 幂迭代（power iteration） | 最大模特征值 | 线性收敛，速率 $\lvert\lambda_2/\lambda_1\rvert$（按模降序） |
| 反幂迭代（+ 位移 $\mu$） | 最接近 $\mu$ 的特征值 | 速率 $\lvert\lambda_{\text{最近}}-\mu\rvert/\lvert\lambda_{\text{次近}}-\mu\rvert$；每步解一个线性系统 |
| Rayleigh 商迭代 | 对称矩阵单个特征对 | 局部**三次**收敛（利用 §5.5 Step 4 的二阶精度） |
| QR 算法（Householder 三对角化 + 隐式位移 QR） | 稠密对称矩阵全部特征值 | $O(n^3)$；三对角化约 $\tfrac43n^3$ flops [NEEDS VERIFICATION: 常数取自 Trefethen & Bau Lecture 26]；LAPACK `dsyevd`/`dsyevr` |
| Lanczos / 隐式重启 Lanczos（ARPACK） | 大型稀疏对称矩阵的少数特征值 | 只需矩阵-向量乘；`scipy.sparse.linalg.eigsh` |
| 位移-求逆（shift-invert）Lanczos | 结构振动的**最低**若干频率 | 对 $(K - \mu M)^{-1}M$ 做 Lanczos，把目标特征值变为最大模 |
| LOBPCG | 带预条件的大型对称（广义）特征问题 | 可利用 FEM 预条件子；DFT 软件常用 |

### 9.3 条件数与精度

- **对称特征值**：绝对误差 $\lesssim \lVert E\rVert_2 \approx u\lVert A\rVert_2$（Weyl）。**相对**精度对小特征值不保证：$\lambda_{\min}$ 的相对误差约 $u\,\kappa(A)$。
- **对称特征向量**：误差 $\lesssim \lVert E\rVert_2/\text{gap}_j$，$\text{gap}_j := \min_{i\ne j}\lvert\lambda_i - \lambda_j\rvert$（Davis–Kahan）。**近简并特征值的特征向量本身不确定**，只有它们张成的子空间是良态的。
- **非对称**：Bauer–Fike 定理 $\min_i\lvert\mu - \lambda_i\rvert \le \kappa(S)\lVert E\rVert$，$\mu \in \sigma(A+E)$；$\kappa(S)$ 可能巨大。

### 9.4 参考实现

```python
import numpy as np
import scipy.linalg as sla

# N 质点弹簧链（两端固定），质量 m、弹簧刚度 k：K phi = omega^2 M phi
N, k, m = 20, 1.0e3, 0.5                       # k [N/m], m [kg]
K = k * (2 * np.eye(N) - np.eye(N, k=1) - np.eye(N, k=-1))
M = m * np.eye(N)

omega2, Phi = sla.eigh(K, M)                    # 广义对称特征问题（内部做 Cholesky 对称化）
omega_num = np.sqrt(omega2)
j = np.arange(1, N + 1)
omega_exact = 2 * np.sqrt(k / m) * np.sin(j * np.pi / (2 * (N + 1)))   # §8 离散解析式

print("max |omega_num - omega_exact| =", np.max(np.abs(omega_num - omega_exact)))
print("M-orthogonality error =", np.linalg.norm(Phi.T @ M @ Phi - np.eye(N)))
```

### 9.5 关联实验（计划中）

- `05_experiments/linear_algebra/power_iteration_convergence/`：curriculum **E4**，验证收敛率 $\lvert\lambda_2/\lambda_1\rvert$ 与 Rayleigh 商迭代的三次收敛。（目录尚未创建）
- `05_experiments/linear_algebra/mass_chain_normal_modes/`：curriculum **E6**，与上面的离散解析式对照，并观察 $N \to \infty$ 的连续极限（弦振动，见 [`wave_equation.md`](../differential_equations/wave_equation.md)）。（目录尚未创建）
- `05_experiments/semiconductor/schrodinger1d_fdm/`：ROADMAP **IV.8**，无限深势阱能级 $E_n = n^2\pi^2\hbar^2/(2mL^2)$ 作为验证基准。（目录尚未创建）

---

## 10. Engineering Applications | 工程应用

| 领域 | 具体问题 | 特征值问题的角色 | 最先失效的假设 |
|---|---|---|---|
| **5 · 计算物理与材料** | 定态 Schrödinger 方程；Kohn–Sham 方程 $\big(-\tfrac{\hbar^2}{2m}\nabla^2 + v_{\text{eff}}[n]\big)\psi_i = \varepsilon_i\psi_i$；紧束缚能带 $H(\mathbf{k})\mathbf{c} = E(\mathbf{k})\mathbf{c}$ | Hermitian 特征问题，规模 $10^3$–$10^6$；自洽场迭代每步求一次最低若干特征对 | A1（连续谱 / 散射态需另行处理） |
| **4 · 先进制造与多物理场** | 结构模态分析、共振规避、主轴/机床颤振；主应力 = 应力张量特征值 | $K\boldsymbol\phi = \omega^2M\boldsymbol\phi$（FEM 组装）；shift-invert Lanczos 求最低频率；主应力方向 = 对称应力张量的正交特征向量 | A5（非比例阻尼、陀螺效应 ⟹ 复模态） |
| **1 · AI 与数据科学** | PCA / POD 降阶；谱聚类（图 Laplacian 第二特征向量，Fiedler 向量）；损失函数 Hessian 谱与训练稳定性（步长 $\eta < 2/\lambda_{\max}$） | Rayleigh 商最大化（§5.9b）；Courant–Fischer 给出最佳 $k$ 维子空间 | 特征量纲不一致（§7） |
| **3 · 机器人与具身智能** | 线性化闭环稳定性 $\alpha(A - BK) < 0$；LQR 闭环极点；可操作度椭球（manipulability ellipsoid，$JJ^\top$ 的特征分解） | 稳定性判据（§5.9c）；椭球主轴 = 特征向量，半轴长 = 奇异值 | 非正规性导致的瞬态增长（§5.9c 警告） |
| **2 · 半导体与集成电路** | MOS 反型层量子化子带：Schrödinger–Poisson 自洽 | 一维 Hermitian 特征问题，与 Poisson 方程交替迭代 | 有效质量近似失效于极薄沟道 |
| **6 · 计算机体系结构与 HPC** | 大规模稀疏特征求解器（Lanczos、LOBPCG、FEAST）；DFT 的稠密特征求解是超算主要负载之一 | 稀疏矩阵-向量乘（SpMV，内存带宽受限）+ 正交化（通信受限） | — |

---

## 11. References | 参考资料

1. S. Axler, *Linear Algebra Done Right*, 4th ed., Springer, 2024（开放获取）. **Ch. 5（Eigenvalues and Eigenvectors）**：§5A 无行列式的存在性证明；**Ch. 7（Operators on Inner Product Spaces）**：§7B Spectral Theorem，§7C Positive Operators，§7E–7F SVD。 [NEEDS VERIFICATION: 4e 节号]
2. R. A. Horn & C. R. Johnson, *Matrix Analysis*, 2nd ed., Cambridge Univ. Press, 2012. Ch. 1（特征值）、Ch. 2（酉相似、Schur、谱定理）、**Ch. 4（Hermitian matrices, Rayleigh quotient, Courant–Fischer, Weyl）**。
3. B. N. Parlett, *The Symmetric Eigenvalue Problem*, SIAM Classics, 1998. Ch. 1（基础）、Ch. 10–11（Rayleigh–Ritz、Courant–Fischer）、Ch. 13（Lanczos）。 [NEEDS VERIFICATION: 章号]
4. L. N. Trefethen & D. Bau III, *Numerical Linear Algebra*, SIAM, 1997. **Lectures 24–31**（特征值问题、Hessenberg/三对角化、Rayleigh 商迭代、QR 算法、SVD 计算）。 [NEEDS VERIFICATION: 讲次范围]
5. G. Strang, *Introduction to Linear Algebra*, 5th/6th ed., Wellesley-Cambridge Press. Ch. 6（Eigenvalues and Eigenvectors；§6.4/§6.5 对称矩阵与正定矩阵），Ch. 7（SVD）。
6. G. Strang & G. J. Fix, *An Analysis of the Finite Element Method*, 2nd ed., Wellesley-Cambridge Press, 2008. Ch. 6（Eigenvalue problems，Rayleigh–Ritz 上界）。 [NEEDS VERIFICATION: 章号]
7. R. Courant & D. Hilbert, *Methods of Mathematical Physics*, Vol. I, Wiley-Interscience, 1953. Ch. I §4（二次型的极小极大性质）、Ch. VI（变分方法与特征值）。 [NEEDS VERIFICATION: 节号]
8. L. N. Trefethen & M. Embree, *Spectra and Pseudospectra: The Behavior of Nonnormal Matrices and Operators*, Princeton Univ. Press, 2005.（§5.9c 非正规瞬态增长）
9. MIT OCW **18.06** *Linear Algebra*（Strang），Lectures 21–25（Eigenvalues, Diagonalization, Symmetric matrices, Positive definite）。 [NEEDS VERIFICATION: 讲次]

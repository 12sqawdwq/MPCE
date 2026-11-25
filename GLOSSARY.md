# GLOSSARY — 中英双语术语表

> 按领域组织；每条包含：中文术语、英文术语、标准符号或典型形式、简明定义。
> 定义力求精确而非通俗；更完整的讨论见对应推导文档。新增术语请遵循 [`CONTRIBUTING.md`](CONTRIBUTING.md) §3。
>
> 全局符号约定：标量为斜体 $a$；向量为粗体 $\mathbf{x}$；矩阵为大写 $A$；算符为 $\mathcal{L}$ 或 $\hat{H}$；$\Omega \subset \mathbb{R}^d$ 表示有界区域，$\partial\Omega$ 为其边界，$\mathbf{n}$ 为外法向量。

---

## 1. 数学（Mathematics）

### 1.1 线性代数（Linear Algebra）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 向量空间 | Vector Space | $V$ over $\mathbb{F}$ | 域 $\mathbb{F}$ 上对加法与数乘封闭、满足八条公理的集合 |
| 线性无关 | Linear Independence | $\sum_i c_i \mathbf{v}_i = \mathbf{0} \Rightarrow c_i = 0$ | 向量组中任何非平凡线性组合都不等于零向量 |
| 基 | Basis | $\{\mathbf{e}_i\}_{i=1}^n$ | 线性无关且张成整个空间的向量组；其元素个数为维数 |
| 秩 | Rank | $\operatorname{rank}(A)$ | 矩阵列空间（等价地，行空间）的维数 |
| 零空间（核） | Null Space (Kernel) | $\ker A = \{\mathbf{x} : A\mathbf{x} = \mathbf{0}\}$ | 被线性映射映为零向量的全体向量 |
| 秩-零化度定理 | Rank–Nullity Theorem | $\operatorname{rank}A + \dim\ker A = n$ | 对 $A \in \mathbb{F}^{m\times n}$，秩与零空间维数之和等于定义域维数 |
| 内积 | Inner Product | $\langle \mathbf{x}, \mathbf{y} \rangle$ | 满足共轭对称、对第一（或第二）变量线性、正定性的双变量函数 |
| 正交投影 | Orthogonal Projection | $P = P^2 = P^\top$ | 将向量映到子空间上最近点的幂等对称算子 |
| 特征值 / 特征向量 | Eigenvalue / Eigenvector | $A\mathbf{x} = \lambda\mathbf{x},\ \mathbf{x} \neq \mathbf{0}$ | 线性映射只做伸缩（因子 $\lambda$）的非零方向 |
| 谱定理 | Spectral Theorem | $A = Q\Lambda Q^\top$ | 实对称矩阵可被正交矩阵对角化，且特征值全为实数 |
| 奇异值分解 | Singular Value Decomposition (SVD) | $A = U\Sigma V^\top$ | 任意矩阵分解为正交阵 × 非负对角阵 × 正交阵；$\sigma_i$ 为奇异值 |
| 正定矩阵 | Positive Definite Matrix | $\mathbf{x}^\top A\mathbf{x} > 0,\ \forall \mathbf{x}\neq\mathbf{0}$ | 对称且二次型恒正；等价于全部特征值为正 |
| 条件数 | Condition Number | $\kappa(A) = \lVert A\rVert\,\lVert A^{-1}\rVert$ | 衡量线性系统解对数据扰动的敏感度；2-范数下 $\kappa_2 = \sigma_{\max}/\sigma_{\min}$ |
| 范数 | Norm | $\lVert\cdot\rVert$ | 满足正定性、齐次性与三角不等式的长度函数 |

### 1.2 分析与微积分（Analysis & Calculus）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 梯度 | Gradient | $\nabla f$ | 标量场的一阶偏导数组成的向量；指向函数增长最快的方向 |
| 雅可比矩阵 | Jacobian Matrix | $J_{ij} = \partial f_i / \partial x_j$ | 向量值函数的一阶偏导数矩阵；局部线性近似 |
| 黑塞矩阵 | Hessian Matrix | $H_{ij} = \partial^2 f / \partial x_i \partial x_j$ | 标量函数的二阶偏导数矩阵；刻画局部曲率 |
| 散度 | Divergence | $\nabla \cdot \mathbf{F}$ | 向量场在一点处单位体积的净外通量 |
| 旋度 | Curl | $\nabla \times \mathbf{F}$ | 向量场在一点处单位面积的环量密度（方向由右手定则给出） |
| 散度定理（Gauss 定理） | Divergence Theorem | $\int_\Omega \nabla\cdot\mathbf{F}\,\mathrm{d}V = \oint_{\partial\Omega}\mathbf{F}\cdot\mathbf{n}\,\mathrm{d}S$ | 区域内散度的体积分等于穿过边界的通量；守恒律微分形式的基础 |
| Stokes 定理 | Stokes' Theorem | $\int_S (\nabla\times\mathbf{F})\cdot\mathrm{d}\mathbf{S} = \oint_{\partial S}\mathbf{F}\cdot\mathrm{d}\mathbf{l}$ | 曲面上旋度的通量等于沿其边界的环量 |
| 泰勒展开 | Taylor Expansion | $f(\mathbf{x}+\mathbf{h}) = f + \nabla f^\top\mathbf{h} + \tfrac12\mathbf{h}^\top H\mathbf{h} + O(\lVert\mathbf{h}\rVert^3)$ | 光滑函数的多项式局部近似；截断误差分析的基础 |
| 傅里叶变换 | Fourier Transform | $\hat f(\xi) = \int f(x)e^{-2\pi i x\xi}\,\mathrm{d}x$ | 将函数分解为不同频率的复指数；平移不变线性算子的对角化工具（此处采用 $2\pi$ 在指数中的约定） |
| 卷积 | Convolution | $(f*g)(x) = \int f(y)g(x-y)\,\mathrm{d}y$ | 线性时不变系统的输入-输出关系；Fourier 变换将其化为乘积 |
| 狄拉克 δ 函数 | Dirac Delta | $\delta(x)$ | 满足 $\int f(x)\delta(x-a)\,\mathrm{d}x = f(a)$ 的广义函数（分布） |
| 希尔伯特空间 | Hilbert Space | $\mathcal{H}$ | 关于内积诱导范数完备的内积空间；如 $L^2(\Omega)$ |
| 索伯列夫空间 | Sobolev Space | $H^1(\Omega)$ | 函数及其弱导数均平方可积的函数空间；弱形式与 FEM 的自然框架 |

### 1.3 微分方程（Differential Equations）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 常微分方程 | Ordinary Differential Equation (ODE) | $\dot{\mathbf{x}} = \mathbf{f}(\mathbf{x}, t)$ | 未知函数只依赖一个自变量的微分方程 |
| 偏微分方程 | Partial Differential Equation (PDE) | $\mathcal{L}u = f$ | 未知函数依赖多个自变量、含偏导数的微分方程 |
| 适定性 | Well-Posedness | — | Hadamard 意义下：解存在、唯一，且连续依赖于数据 |
| 椭圆 / 抛物 / 双曲型 | Elliptic / Parabolic / Hyperbolic | $-\Delta u = f$；$u_t = \Delta u$；$u_{tt} = c^2\Delta u$ | 二阶线性 PDE 按主部系数矩阵特征值符号的分类；分别对应稳态、扩散、波动 |
| 边界条件 | Boundary Condition | Dirichlet：$u = g$；Neumann：$\partial_n u = h$；Robin：$\alpha u + \beta\partial_n u = r$ | 在 $\partial\Omega$ 上对解施加的约束 |
| 分离变量法 | Separation of Variables | $u(x,t) = X(x)T(t)$ | 将 PDE 化为若干 ODE 的解析方法；依赖于特征函数展开 |
| Sturm–Liouville 问题 | Sturm–Liouville Problem | $-(p y')' + q y = \lambda w y$ | 二阶自伴特征值问题；其特征函数关于权 $w$ 正交且完备 |
| 格林函数 | Green's Function | $\mathcal{L}G(x,\xi) = \delta(x-\xi)$ | 线性微分算子对点源的响应；解可写为 $u = \int G f\,\mathrm{d}\xi$ |
| 李雅普诺夫稳定性 | Lyapunov Stability | $V(\mathbf{x}) > 0,\ \dot V \le 0$ | 平衡点附近的轨迹保持在其任意小邻域内；可用 Lyapunov 函数判定 |

### 1.4 概率与统计（Probability & Statistics）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 随机变量 | Random Variable | $X: \Omega \to \mathbb{R}$ | 从样本空间到实数的可测函数 |
| 期望 / 方差 | Expectation / Variance | $\mathbb{E}[X]$；$\operatorname{Var}(X) = \mathbb{E}[(X-\mathbb{E}X)^2]$ | 分布的一阶矩与二阶中心矩 |
| 协方差矩阵 | Covariance Matrix | $\Sigma = \mathbb{E}[(\mathbf{X}-\boldsymbol\mu)(\mathbf{X}-\boldsymbol\mu)^\top]$ | 随机向量各分量的二阶联合中心矩；对称半正定 |
| 多元高斯分布 | Multivariate Gaussian | $\mathcal{N}(\boldsymbol\mu, \Sigma)$ | 密度 $\propto \exp(-\tfrac12(\mathbf{x}-\boldsymbol\mu)^\top\Sigma^{-1}(\mathbf{x}-\boldsymbol\mu))$；在仿射变换与条件化下封闭 |
| 中心极限定理 | Central Limit Theorem (CLT) | $\sqrt{n}(\bar X_n - \mu) \xrightarrow{d} \mathcal{N}(0,\sigma^2)$ | 独立同分布、方差有限的样本均值经标准化后依分布收敛于正态分布 |
| 贝叶斯定理 | Bayes' Theorem | $p(\theta\mid y) = p(y\mid\theta)p(\theta)/p(y)$ | 由先验与似然得到后验 |
| 最大似然估计 | Maximum Likelihood Estimation (MLE) | $\hat\theta = \arg\max_\theta p(y\mid\theta)$ | 选取使观测数据出现概率最大的参数 |
| 马尔可夫链 | Markov Chain | $P(X_{n+1}\mid X_n,\dots,X_0) = P(X_{n+1}\mid X_n)$ | 未来状态只依赖当前状态的随机过程 |

### 1.5 优化与变分（Optimization & Variational Methods）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 变分原理 | Variational Principle | $\delta J[u] = 0$ | 物理状态或问题的解是某泛函的驻点（常为极小值点） |
| 泛函 | Functional | $J: \mathcal{V} \to \mathbb{R}$ | 从函数空间到实数的映射，如 $J[u] = \int L(x, u, u')\,\mathrm{d}x$ |
| 欧拉-拉格朗日方程 | Euler–Lagrange Equation | $\dfrac{\partial L}{\partial u} - \dfrac{\mathrm{d}}{\mathrm{d}x}\dfrac{\partial L}{\partial u'} = 0$ | 泛函取驻值的必要条件 |
| 拉格朗日乘子 | Lagrange Multiplier | $\nabla f = \lambda\nabla g$ | 将等式约束优化化为无约束驻点问题的辅助变量 |
| 凸函数 | Convex Function | $f(t\mathbf{x}+(1-t)\mathbf{y}) \le tf(\mathbf{x})+(1-t)f(\mathbf{y})$ | 任意弦位于图像上方的函数；局部极小即全局极小 |
| KKT 条件 | Karush–Kuhn–Tucker Conditions | 驻点性、原始/对偶可行性、互补松弛 | 不等式约束优化的一阶必要条件；凸问题且满足约束规范时为充分条件 |
| 梯度下降 | Gradient Descent | $\mathbf{x}_{k+1} = \mathbf{x}_k - \eta\nabla f(\mathbf{x}_k)$ | 沿负梯度方向迭代的一阶优化方法 |

---

## 2. 物理（Physics）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 拉格朗日量 | Lagrangian | $L = T - V$ | 经典力学中动能与势能之差；作用量的被积函数 |
| 作用量 / Hamilton 原理 | Action / Hamilton's Principle | $S = \int_{t_1}^{t_2} L\,\mathrm{d}t,\ \delta S = 0$ | 真实运动轨迹使作用量取驻值 |
| 哈密顿量 | Hamiltonian | $H(\mathbf{q},\mathbf{p}) = \mathbf{p}\cdot\dot{\mathbf{q}} - L$ | Lagrangian 的 Legendre 变换；不显含时间且约束定常时等于总能量 |
| 相空间 | Phase Space | $(\mathbf{q}, \mathbf{p})$ | 广义坐标与广义动量张成的空间；Hamilton 流在其中保持辛结构 |
| 惯性张量 | Inertia Tensor | $I_{ij} = \int \rho(r^2\delta_{ij} - r_ir_j)\,\mathrm{d}V$ | 刚体角动量与角速度之间的线性映射 $\mathbf{L} = I\boldsymbol\omega$ |
| 麦克斯韦方程组 | Maxwell's Equations | $\nabla\cdot\mathbf{D}=\rho,\ \nabla\cdot\mathbf{B}=0,\ \nabla\times\mathbf{E}=-\partial_t\mathbf{B},\ \nabla\times\mathbf{H}=\mathbf{J}+\partial_t\mathbf{D}$ | 经典电磁场的完备方程组 |
| 泊松方程 | Poisson's Equation | $-\nabla\cdot(\varepsilon\nabla\phi) = \rho$ | 静电势与电荷密度的关系；椭圆型 PDE 的原型 |
| 坡印廷矢量 | Poynting Vector | $\mathbf{S} = \mathbf{E}\times\mathbf{H}$ | 电磁能流密度 |
| 熵 | Entropy | $S$；统计定义 $S = -k_B\sum_i p_i\ln p_i$ | 热力学态函数；统计力学中度量微观状态数（不确定度） |
| 配分函数 | Partition Function | $Z = \sum_i e^{-\beta E_i},\ \beta = 1/(k_BT)$ | 正则系综的归一化常数；所有热力学量可由 $\ln Z$ 导出 |
| 费米-狄拉克分布 | Fermi–Dirac Distribution | $f(E) = \dfrac{1}{e^{(E-\mu)/k_BT}+1}$ | 热平衡下费米子占据能级 $E$ 的概率 |
| 应力张量 | Stress Tensor | $\boldsymbol\sigma$，$\mathbf{t} = \boldsymbol\sigma\mathbf{n}$ | 连续介质内部单位面积上的力与面法向量之间的线性映射（Cauchy 应力） |
| 应变张量 | Strain Tensor | $\boldsymbol\varepsilon = \tfrac12(\nabla\mathbf{u} + \nabla\mathbf{u}^\top)$ | 小变形下位移梯度的对称部分 |
| 本构关系 | Constitutive Relation | 如 Hooke 定律 $\boldsymbol\sigma = \mathbb{C}:\boldsymbol\varepsilon$ | 封闭守恒律方程组的材料响应关系 |
| 纳维-斯托克斯方程 | Navier–Stokes Equations | $\rho(\partial_t\mathbf{u} + \mathbf{u}\cdot\nabla\mathbf{u}) = -\nabla p + \mu\Delta\mathbf{u} + \mathbf{f}$ | 牛顿流体的动量守恒方程（此为不可压缩、常粘度形式） |
| 薛定谔方程 | Schrödinger Equation | $i\hbar\,\partial_t\psi = \hat{H}\psi$ | 非相对论量子力学中波函数的演化方程；定态形式为 $\hat{H}\psi = E\psi$ |
| 对易子 | Commutator | $[\hat{A},\hat{B}] = \hat{A}\hat{B} - \hat{B}\hat{A}$ | 刻画两算符不可交换性；正则对易关系 $[\hat{x},\hat{p}] = i\hbar$ |
| 布洛赫定理 | Bloch's Theorem | $\psi_{\mathbf{k}}(\mathbf{r}) = e^{i\mathbf{k}\cdot\mathbf{r}}u_{\mathbf{k}}(\mathbf{r})$ | 周期势中的本征态可写为平面波乘以晶格周期函数 |
| 倒格子 | Reciprocal Lattice | $\mathbf{a}_i\cdot\mathbf{b}_j = 2\pi\delta_{ij}$ | 正格子的 Fourier 对偶；布里渊区（Brillouin zone）定义于其上 |
| 能带 | Energy Band | $E_n(\mathbf{k})$ | 周期势中电子本征能量随波矢的色散关系 |
| 漂移-扩散模型 | Drift-Diffusion Model | $\mathbf{J}_n = q\mu_n n\mathbf{E} + qD_n\nabla n$ | 半导体载流子电流 = 电场驱动的漂移 + 浓度梯度驱动的扩散；与 Poisson 方程及连续性方程耦合 |
| 爱因斯坦关系 | Einstein Relation | $D = \mu k_BT/q$ | 非简并条件下扩散系数与迁移率的关系 |
| 密度泛函理论 | Density Functional Theory (DFT) | $E[n]$；Kohn–Sham 方程 | 以电子密度而非多体波函数为基本变量的基态电子结构理论 |

---

## 3. 计算方法（Computational Methods）

| 中文 | English | 符号 / 形式 | 定义 |
|---|---|---|---|
| 离散化 | Discretization | $h$, $\Delta t$ | 将连续问题化为有限维代数问题的过程 |
| 截断误差 | Truncation Error | $\tau = O(h^p)$ | 将精确解代入离散格式所得的残差；$p$ 为格式精度阶 |
| 相容性 / 稳定性 / 收敛性 | Consistency / Stability / Convergence | — | 截断误差 → 0；误差不被放大；数值解 → 精确解 |
| Lax 等价定理 | Lax Equivalence Theorem | 相容 + 稳定 ⟺ 收敛 | 对适定线性初值问题的相容格式成立 |
| CFL 条件 | Courant–Friedrichs–Lewy Condition | $c\,\Delta t / h \le C_{\max}$ | 显式格式稳定的必要条件：数值依赖域须包含物理依赖域 |
| 有限差分法 | Finite Difference Method (FDM) | $u''(x) \approx \dfrac{u_{i+1}-2u_i+u_{i-1}}{h^2}$ | 用网格点上的差商近似导数 |
| 有限体积法 | Finite Volume Method (FVM) | $\dfrac{\mathrm{d}}{\mathrm{d}t}\int_{V_i} u + \oint_{\partial V_i}\mathbf{F}\cdot\mathbf{n} = 0$ | 在控制体上离散积分形式守恒律；天然保证离散守恒 |
| 有限元法 | Finite Element Method (FEM) | $u_h = \sum_j U_j\phi_j$ | 在分片多项式空间中求弱形式的 Galerkin 近似解 |
| 弱形式 | Weak Form | 求 $u\in V$ 使 $a(u,v) = \ell(v),\ \forall v\in V$ | 将 PDE 乘以检验函数并分部积分得到的积分形式；降低对解光滑性的要求 |
| 伽辽金方法 | Galerkin Method | $a(u_h, v_h) = \ell(v_h),\ \forall v_h \in V_h$ | 试探空间与检验空间相同的投影方法；误差满足 Galerkin 正交性 $a(u-u_h, v_h) = 0$ |
| Lax–Milgram 定理 | Lax–Milgram Theorem | $a$ 有界且强制 ⟹ 解存在唯一 | 弱形式适定性的基本定理 |
| 刚度矩阵 | Stiffness Matrix | $K_{ij} = a(\phi_j, \phi_i)$ | FEM 离散后线性系统的系数矩阵；对称强制问题中对称正定 |
| 共轭梯度法 | Conjugate Gradient (CG) | Krylov 子空间 $\mathcal{K}_k(A, \mathbf{r}_0)$ | 求解对称正定系统的迭代法；收敛速度取决于 $\sqrt{\kappa(A)}$ |
| 预条件 | Preconditioning | $M^{-1}A\mathbf{x} = M^{-1}\mathbf{b}$ | 用易求逆的 $M \approx A$ 改善谱分布以加速迭代收敛 |
| 辛积分器 | Symplectic Integrator | 如 Störmer–Verlet | 保持 Hamilton 系统辛结构的时间积分格式；长期能量误差有界 |
| 刚性问题 | Stiff Problem | $\max\lvert\lambda_i\rvert / \min\lvert\lambda_i\rvert \gg 1$（$\lambda_i$ 为 Jacobian 特征值） | 存在尺度差异巨大的时间常数，显式格式受稳定性限制须取极小步长 |
| 蒙特卡洛方法 | Monte Carlo Method | 误差 $O(N^{-1/2})$ | 用随机采样估计积分或期望；收敛速度与维数无关 |
| 马尔可夫链蒙特卡洛 | Markov Chain Monte Carlo (MCMC) | Metropolis–Hastings | 构造以目标分布为平稳分布的马尔可夫链进行采样 |
| 反问题 | Inverse Problem | 由 $\mathbf{y} = \mathcal{A}(\mathbf{x}) + \boldsymbol\epsilon$ 求 $\mathbf{x}$ | 由观测结果反推原因或参数；通常不适定 |
| 吉洪诺夫正则化 | Tikhonov Regularization | $\min_\mathbf{x}\lVert A\mathbf{x}-\mathbf{y}\rVert^2 + \alpha\lVert L\mathbf{x}\rVert^2$ | 通过添加惩罚项稳定不适定问题 |
| 自动微分 | Automatic Differentiation (AD) | 前向模式 / 反向模式 | 按链式法则对计算图精确求导（无截断误差）；反向传播是反向模式 AD |
| 物理信息神经网络 | Physics-Informed Neural Networks (PINNs) | $\mathcal{L} = \mathcal{L}_{\text{data}} + \lambda\lVert\mathcal{N}[u_\theta]\rVert^2$ | 将 PDE 残差作为损失函数项训练神经网络逼近解 |
| 神经算子 | Neural Operator | $\mathcal{G}_\theta: a \mapsto u$ | 学习函数空间之间映射（如 PDE 参数 → 解）的网络，如 FNO、DeepONet |

---

## 4. 工程应用（Engineering Applications）

| 中文 | English | 符号 / 形式 | 定义 | 领域 |
|---|---|---|---|---|
| 状态空间模型 | State-Space Model | $\dot{\mathbf{x}} = A\mathbf{x} + B\mathbf{u},\ \mathbf{y} = C\mathbf{x} + D\mathbf{u}$ | 用一阶 ODE 组描述动态系统的输入-状态-输出关系 | 3 |
| 能控性 / 能观性 | Controllability / Observability | $\operatorname{rank}[B, AB, \dots, A^{n-1}B] = n$ | 能否通过输入驱动到任意状态 / 能否由输出唯一确定状态 | 3 |
| 卡尔曼滤波 | Kalman Filter | 预测 + 更新；$K = P^-H^\top(HP^-H^\top + R)^{-1}$ | 线性高斯系统的最优（最小均方误差）递推状态估计器 | 3, 1 |
| 线性二次调节器 | Linear Quadratic Regulator (LQR) | $\mathbf{u} = -K\mathbf{x}$，$K$ 由 Riccati 方程得到 | 线性系统在二次代价下的最优状态反馈控制 | 3 |
| 模型预测控制 | Model Predictive Control (MPC) | 滚动时域优化 | 每个时刻求解有限时域最优控制问题，仅执行第一步 | 3, 4 |
| 迁移率 | Mobility | $\mu = v_d / E$ | 单位电场下载流子的平均漂移速度 | 2 |
| pn 结 | p-n Junction | 内建电势 $V_{bi}$ | p 型与 n 型半导体的界面；形成耗尽区与整流特性 | 2 |
| Scharfetter–Gummel 格式 | Scharfetter–Gummel Scheme | 指数拟合通量 | 漂移-扩散方程的稳定离散格式；在漂移主导时避免数值振荡 | 2 |
| 分子动力学 | Molecular Dynamics (MD) | 数值求解 $m_i\ddot{\mathbf{r}}_i = -\nabla_iU$ | 通过数值积分原子的牛顿方程模拟材料行为 | 5 |
| 计算流体力学 | Computational Fluid Dynamics (CFD) | — | 用数值方法求解流体控制方程 | 4 |
| 多物理场耦合 | Multiphysics Coupling | 单向 / 双向；分区 / 整体 | 多个物理场方程相互依赖的联合求解 | 4 |
| Roofline 模型 | Roofline Model | $P = \min(P_{\text{peak}}, I \cdot B)$ | 由算术强度 $I$（FLOP/Byte）与带宽 $B$ 界定程序可达性能上限 | 6 |
| 算术强度 | Arithmetic Intensity | $I = \text{FLOPs} / \text{Bytes}$ | 每字节内存访问对应的浮点运算数；判定计算受限或带宽受限 | 6 |
| 压缩稀疏行格式 | Compressed Sparse Row (CSR) | `values`, `col_idx`, `row_ptr` | 只存储非零元素的稀疏矩阵格式；SpMV 的标准载体 | 6 |
| 拉东变换 | Radon Transform | $\mathcal{R}f(\theta, s) = \int_{\mathbf{x}\cdot\boldsymbol\theta = s} f\,\mathrm{d}\ell$ | 函数沿直线的积分；CT 成像的正向模型 | 7 |
| 滤波反投影 | Filtered Back-Projection (FBP) | 斜坡滤波 + 反投影 | 基于 Fourier 切片定理的 CT 解析重建算法 | 7 |
| k 空间 | k-Space | $S(\mathbf{k}) = \int \rho(\mathbf{r})e^{-i2\pi\mathbf{k}\cdot\mathbf{r}}\,\mathrm{d}\mathbf{r}$ | MRI 中采集数据所在的空间频率域（理想模型）；图像由其逆 Fourier 变换重建 | 7 |
| 采样定理 | Nyquist–Shannon Sampling Theorem | $f_s > 2f_{\max}$ | 带限信号可由高于两倍最高频率的采样完全重建 | 7, 1 |

---

## 5. 常用符号速查（Notation Quick Reference）

| 符号 | 含义 | 符号 | 含义 |
|---|---|---|---|
| $\nabla$ | 梯度算子（nabla） | $\Delta = \nabla^2$ | 拉普拉斯算子（Laplacian） |
| $\partial_t$ | 对时间的偏导 | $\partial_n = \mathbf{n}\cdot\nabla$ | 法向导数 |
| $\langle\cdot,\cdot\rangle$ | 内积 | $\lVert\cdot\rVert_{L^2}$ | $L^2$ 范数 |
| $\delta_{ij}$ | Kronecker δ | $\delta(x)$ | Dirac δ |
| $O(\cdot)$ | 大 O 记号（渐近上界） | $\hbar$ | 约化 Planck 常数 |
| $k_B$ | Boltzmann 常数 | $q$ | 元电荷 |
| $\varepsilon_0$ | 真空介电常数 | $\mu_0$ | 真空磁导率 |

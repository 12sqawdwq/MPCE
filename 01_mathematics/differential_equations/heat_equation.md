# Heat Equation | 热传导方程

<!--
CONTRIBUTING 七问（简答）
1 定位：ROADMAP Phase II, II.3（抛物型 PDE 原型）、II.4（分离变量 / Sturm–Liouville）、II.8（三大经典方程实验）。
2 先修：MATH-VC-01/02（散度、Gauss 散度定理）；MATH-FA-01（fourier_transform.md：微分定理、Gauss 变换对）；一阶线性 ODE。
3 结构：守恒律 ∂t(能量) + ∇·(通量) = 源 + 本构关系（Fourier 定律）⟹ 扩散方程；−∇² 是自伴正算子 ⟹ 模态指数衰减。
4 推导：L1 必证——控制体能量守恒 → 积分形式 → 微分形式；无量纲化与 Fo；分离变量；热核；能量估计与唯一性；FTCS 稳定性。
5 计算：2D FTCS（已完成实验 06），r = αΔt(1/Δx²+1/Δy²) ≤ 1/2 的验证。
6 应用：领域 2（芯片热管理、掺杂扩散）、4（增材制造熔池）、6（隐式求解器 / HPC）、1（PINN 基准问题）。
7 代价：约 10–12 h（推导 6 h + 实验 4 h）。
-->

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-DE-03`（PDEs：抛物型原型）· `PHYS-TR-01`（Heat Conduction / Diffusion）· 关联 `MATH-VC-01`、`MATH-VC-02`、`MATH-FA-01`、`PHYS-CL-01` |
| Phase | Phase II — ROADMAP **II.3**、**II.4**、**II.8** |
| Prerequisites | `MATH-VC-02`（Gauss 散度定理）；[`fourier_transform.md`](fourier_transform.md)（微分定理 §5.4、Gauss 变换对 §5.6）；一阶线性 ODE |
| Primary References | Evans, *PDE*, Ch. 2.3；Strauss, *PDE: An Introduction*, Ch. 2, 4；Carslaw & Jaeger, *Conduction of Heat in Solids*；Incropera et al., *Heat and Mass Transfer*, Ch. 2, 5；LeVeque, *Finite Difference Methods*, Ch. 9 |

---

## 1. Physical Motivation | 物理动机

热量从高温处流向低温处，且流速与温度梯度成正比。把这一经验规律（Fourier 定律）与**能量守恒**结合，就得到所有扩散过程的原型方程。同一方程还描述：

- **质量扩散**（Fick 第二定律）：硅中掺杂原子、气体在聚合物中的渗透——只需把 $T\to C$、$\alpha\to D$。
- **概率扩散**：Brown 运动的密度满足 $\partial_t p = D\nabla^2 p$；热核就是 Gauss 分布。
- **数值与 AI**：扩散是图像平滑（Gauss 滤波）、扩散生成模型的前向过程、以及 PINN/神经算子的标准基准问题。

本文回答：(1) 方程如何从守恒律严格得到？(2) 为什么解会"抹平"、不可逆、且以 $L^2/\alpha$ 为特征时间？(3) 边界条件如何决定可用的正交展开？(4) 显式格式为何受 $\Delta t\propto\Delta x^2$ 的严格限制？

---

## 2. Physical Assumptions | 物理假设

| 编号 | 假设 | 含义 / 失效后果 |
|---|---|---|
| A1 | **连续介质**：$T(\mathbf x,t)$ 为光滑场 | 纳米尺度（特征长度 ≲ 声子平均自由程，Si 中约 100 nm 量级）需 Boltzmann 输运方程，Fourier 定律高估热导 |
| A2 | **Fourier 定律** $\mathbf q = -k\nabla T$（局部、瞬时、各向同性） | 超快激光加热（ps 级）需滞后模型（Cattaneo：变为双曲型）；各向异性材料 $k\to$ 张量 $\mathsf K$ |
| A3 | **常物性**：$k,\rho,c_p$ 与 $T$、$\mathbf x$ 无关 | 大温差下 $k(T)$ 使方程非线性；分层材料需分片求解 + 界面连续条件 |
| A4 | **静止介质**：无对流 | 流体中需加 $\mathbf u\cdot\nabla T$（对流-扩散，ROADMAP III.8） |
| A5 | **无相变 / 无化学反应**（或作为已知源项 $Q$） | 熔化/凝固需 Stefan 问题（移动边界、潜热） |

---

## 3. Mathematical Definitions | 数学定义

| 符号 | 定义 | 量纲（SI） |
|---|---|---|
| $T(\mathbf x,t)$ | 温度场 | K |
| $\mathbf q$ | 热流密度（单位时间穿过单位面积的热量） | W·m⁻² |
| $k$ | 热导率 | W·m⁻¹·K⁻¹ |
| $\rho,\ c_p$ | 密度、比热容 | kg·m⁻³，J·kg⁻¹·K⁻¹ |
| $\alpha = k/(\rho c_p)$ | 热扩散率（thermal diffusivity） | m²·s⁻¹ |
| $Q$ | 体积热源 | W·m⁻³ |
| $h$ | 对流换热系数（Robin 条件） | W·m⁻²·K⁻¹ |
| $Fo = \alpha t/L^2$ | Fourier 数：扩散时间 / 观察时间之比的倒数 | 1 |
| $Bi = hL/k$ | Biot 数：内部导热热阻 / 表面换热热阻 | 1 |
| $G(x,t)$ | 1D 热核 $\dfrac{1}{\sqrt{4\pi\alpha t}}e^{-x^2/(4\alpha t)}$ | m⁻¹ |

---

## 4. Governing Principles | 基本原理

1. **能量守恒**（热力学第一定律，固体中忽略做功）：控制体 $V$ 内内能的增加率 = 穿过边界 $\partial V$ 的净流入热流 + 内部生成热。
2. **Fourier 定律**：$\mathbf q = -k\nabla T$（本构关系，经验定律；负号保证热量顺梯度下降方向流动，与第二定律一致）。
3. **Gauss 散度定理**：对光滑向量场 $\mathbf F$，$\displaystyle\oint_{\partial V}\mathbf F\cdot\mathbf n\,dS = \int_V\nabla\cdot\mathbf F\,dV$。
4. **局部化引理**：若连续函数 $g$ 对**任意**控制体 $V$ 满足 $\int_V g\,dV = 0$，则 $g\equiv0$（否则在 $g(\mathbf x_0)\ne0$ 的小球上积分不为零）。

---

## 5. Mathematical Derivation | 数学推导

### 5.1 从守恒律到 $\partial_tT = \alpha\nabla^2T$

**Step 1（积分形式）** 固定控制体 $V$，内能 $E = \int_V\rho c_pT\,dV$。由 [原理 1]（$\mathbf n$ 为外法向，故流入为 $-\mathbf q\cdot\mathbf n$）：
$$
\frac{d}{dt}\int_V\rho c_pT\,dV = -\oint_{\partial V}\mathbf q\cdot\mathbf n\,dS + \int_VQ\,dV .
$$

**Step 2（散度定理）** $V$ 不随时间变化，导数移入积分；面积分由 [原理 3] 化为体积分：
$$
\int_V\Big(\rho c_p\,\partial_tT + \nabla\cdot\mathbf q - Q\Big)\,dV = 0\qquad\forall V .
$$

**Step 3（局部化）** 被积函数连续，由 [原理 4]：$\rho c_p\,\partial_tT + \nabla\cdot\mathbf q = Q$——这是一切守恒律的通用形式 $\partial_tu + \nabla\cdot\mathbf F = s$。

**Step 4（本构关系）** 代入 Fourier 定律 [原理 2]：$\rho c_p\,\partial_tT = \nabla\cdot(k\nabla T) + Q$。在 A3 下 $k$ 提到散度外：
$$
\boxed{\ \frac{\partial T}{\partial t} = \alpha\,\nabla^2T + \frac{Q}{\rho c_p},\qquad \alpha = \frac{k}{\rho c_p}\ }
$$

**分类**（II.3）：主部 $\alpha\nabla^2$ 在空间上椭圆，时间一阶 ⟹ **抛物型**。只有一组特征 $t=$ const：信息以无穷速度传播（§8）。

### 5.2 无量纲化与 Fourier 数

令 $\tilde{\mathbf x} = \mathbf x/L$，$\tilde t = t/t_c$，$\theta = (T-T_\infty)/\Delta T$。代入（$Q=0$）得 $\partial_{\tilde t}\theta = \frac{\alpha t_c}{L^2}\tilde\nabla^2\theta$。唯一的自然选择 $t_c = L^2/\alpha$ 使方程无参数：
$$
\partial_{Fo}\theta = \tilde\nabla^2\theta,\qquad Fo = \frac{\alpha t}{L^2}.
$$
**物理含义**：扩散距离 $\sim\sqrt{\alpha t}$；$Fo\ll1$ 时热扰动只渗入表层（半无限体近似），$Fo\gtrsim0.2$ 时单一最低模态主导（§5.4）。尺寸减半，时间缩短为 1/4。

### 5.3 稳态：Laplace / Poisson 方程

$\partial_tT = 0$ ⟹ $\nabla^2T = -Q/k$（Poisson），无源时 $\nabla^2T = 0$（Laplace，**椭圆型**）。性质：**平均值性质**——调和函数在任一球心处的值等于球面平均值 ⟹ **极值原理**：无源稳态温度的最大/最小值只在边界取得。1D 平板 $[0,L]$、两端 $T_0,T_L$：$T = T_0 + (T_L - T_0)x/L$，热流 $q = k(T_0 - T_L)/L$，即热阻 $R = L/(kA)$。

### 5.4 分离变量（II.4）：有限区间、Dirichlet 边界

求解 $T_t = \alpha T_{xx}$，$0<x<L$，$T(0,t) = T(L,t) = 0$，$T(x,0) = f(x)$。

**Step 1** 设 $T = X(x)\Theta(t)$，代入并除以 $\alpha X\Theta$：$\dfrac{\Theta'}{\alpha\Theta} = \dfrac{X''}{X} = -\lambda$（左边只依赖 $t$，右边只依赖 $x$，故为常数）。

**Step 2（Sturm–Liouville 问题）** $-X'' = \lambda X$，$X(0)=X(L)=0$。$\lambda\le0$ 只有零解；$\lambda>0$ 时 $X = \sin(\sqrt\lambda x)$ 要求 $\sqrt\lambda L = n\pi$：
$$
\lambda_n = (n\pi/L)^2,\qquad X_n = \sin(n\pi x/L),\qquad n = 1,2,\dots
$$
$-d^2/dx^2$ 在此边界下**自伴且正定**（分部积分，边界项为零）⟹ 本征值为正实数、本征函数正交完备。

**Step 3（时间因子 + 叠加）** $\Theta_n = e^{-\alpha\lambda_nt}$，由正交投影确定系数：
$$
\boxed{\ T(x,t) = \sum_{n=1}^{\infty}b_n\,e^{-\alpha(n\pi/L)^2t}\sin\frac{n\pi x}{L},\qquad b_n = \frac2L\int_0^Lf(x)\sin\frac{n\pi x}{L}dx\ }
$$
**含义**：第 $n$ 模态以时间常数 $\tau_n = L^2/(\alpha n^2\pi^2)$ 衰减，高频（细节）衰减快 $n^2$ 倍 ⟹ **平滑效应**。$t>0$ 时级数对 $x$ 无穷次可微，即使 $f$ 不连续。

### 5.5 无界域：Fourier 变换与热核

对 $x\in\mathbb R$ 作变换（[`fourier_transform.md`](fourier_transform.md) §5.4：$\widehat{T_{xx}} = -k^2\hat T$，此处 $k$ 为波数）：
$$
\partial_t\hat T(k,t) = -\alpha k^2\hat T \;\Longrightarrow\; \hat T(k,t) = \hat f(k)\,e^{-\alpha k^2t}.
$$
由 Gauss 变换对（同文 §5.6）取 $a = 1/(4\alpha t)$：$\mathcal F\big[e^{-x^2/4\alpha t}\big] = \sqrt{4\pi\alpha t}\,e^{-\alpha k^2t}$，故 $e^{-\alpha k^2t} = \hat G$，再由卷积定理：
$$
\boxed{\ T(x,t) = (G*f)(x) = \int_{-\infty}^{\infty}\frac{1}{\sqrt{4\pi\alpha t}}\,e^{-(x-y)^2/(4\alpha t)}f(y)\,dy\ }
$$
$G$ 是均值 0、方差 $\sigma^2 = 2\alpha t$ 的正态密度：点热源扩散成宽度 $\propto\sqrt t$ 的 Gauss 包；$\int G\,dx = 1$ 即总热量守恒。$d$ 维：$G_d = (4\pi\alpha t)^{-d/2}e^{-|\mathbf x|^2/4\alpha t}$。

### 5.6 能量估计、唯一性与不可逆性

对齐次 Dirichlet 或 Neumann 边界、$Q=0$，令 $\mathcal E(t) = \tfrac12\int_\Omega T^2dV$。乘 $T$ 积分并用 Green 第一恒等式：
$$
\frac{d\mathcal E}{dt} = \alpha\int_\Omega T\nabla^2T\,dV = \alpha\oint_{\partial\Omega}T\,\partial_nT\,dS - \alpha\int_\Omega|\nabla T|^2dV = -\alpha\int_\Omega|\nabla T|^2dV\le0 .
$$
**唯一性**：两解之差 $w$ 满足齐次问题且 $w(\cdot,0)=0$，故 $\mathcal E_w(t)\le\mathcal E_w(0) = 0$ ⟹ $w\equiv0$。**不可逆**：逆时间问题 $\partial_tT = -\alpha\nabla^2T$ 把第 $n$ 模放大 $e^{+\alpha\lambda_nt}$，是不适定的（Hadamard 意义）——"去模糊"需要正则化。

---

## 6. Boundary & Initial Conditions | 边界与初始条件

适定问题需要：初始温度 $T(\mathbf x,0) = f(\mathbf x)$ + 每段边界上**一个**条件。

| 类型 | 形式 | 物理 | 1D $[0,L]$ 两端同类时的本征函数 |
|---|---|---|---|
| Dirichlet（第一类） | $T = T_b$ | 恒温浴、相变界面 | $\sin(n\pi x/L)$，$n\ge1$ ⟹ **正弦变换**（DST） |
| Neumann（第二类） | $-k\,\partial_nT = q_b$；$q_b=0$ 为绝热 | 给定热流、对称面 | $\cos(n\pi x/L)$，$n\ge0$ ⟹ **余弦变换**（DCT）；$n=0$ 模不衰减 = 总热量守恒 |
| Robin（第三类） | $-k\,\partial_nT = h(T - T_\infty)$ | 对流冷却（散热片、空气） | $\cos(\mu_nx/L)$，$\mu_n\tan\mu_n = Bi$（$x=0$ 绝热、$x=L$ 对流） |

- **非齐次边界**：令 $T = T_{ss}(x) + v$，$T_{ss}$ 为 §5.3 稳态解，$v$ 满足齐次边界，再用 §5.4。
- **Robin 的两个极限**：$Bi\to0$ ⟹ Neumann（绝热；且体内近似等温，可用集总参数模型 $\rho c_pV\dot T = -hA(T-T_\infty)$，工程判据 $Bi<0.1$）；$Bi\to\infty$ ⟹ Dirichlet $T = T_\infty$。
- **相容性**：若 $f$ 与边界值在角点不一致，解在 $t>0$ 仍光滑，但 $t\to0^+$ 附近级数收敛慢、数值误差集中于角点。
- **纯 Neumann 稳态**存在的必要条件：$\oint q_b\,dS = \int_VQ\,dV$（净热量为零），且解只确定到一个常数。

---

## 7. Dimensional Analysis | 量纲分析

- $[\alpha] = \dfrac{\text{W·m}^{-1}\text{K}^{-1}}{\text{kg·m}^{-3}\cdot\text{J·kg}^{-1}\text{K}^{-1}} = \dfrac{\text{J·s}^{-1}\text{m}^{-1}}{\text{J·m}^{-3}} = \text{m}^2\text{s}^{-1}$ ✓。
- 方程两边：$[\partial_tT] = $ K/s，$[\alpha\nabla^2T] = $ m²s⁻¹·K·m⁻² = K/s ✓；$[Q/\rho c_p] = $ W·m⁻³ / (J·m⁻³K⁻¹) = K/s ✓。
- 热核：$[G] = $ m⁻¹，$[G*f] = $ m⁻¹·K·m = K ✓；指数 $x^2/(\alpha t)$ 无量纲 ✓。
- **Buckingham π**：变量 $\{T-T_\infty,\Delta T,x,L,t,\alpha,h,k\}$，基本量纲 {K, m, s, W}，得 $\theta = \Phi(x/L, Fo, Bi)$。
- **典型值**：Si $\alpha\approx9\times10^{-5}$ m²/s（$k\approx150$）、Cu $\approx1.1\times10^{-4}$、钢 $\approx1.2\times10^{-5}$、水 $\approx1.4\times10^{-7}$ m²/s。100 µm 厚 Si 芯片：$L^2/\alpha\approx0.1$ ms；1 cm 钢板：$\approx8$ s。

---

## 8. Limiting Cases | 极限情形验证

| 极限情形 | 预期 | 验证 |
|---|---|---|
| $t\to\infty$（Dirichlet 0） | $T\to0$，最慢模 $n=1$ 主导 | $e^{-\pi^2Fo}$；$Fo=0.2$ 时第 2 模相对第 1 模已衰减 $e^{-3\pi^2\cdot0.2}\approx0.003$ ✓ |
| $t\to\infty$（绝热 Neumann） | $T\to$ 初始平均值 | $n=0$ 余弦模不衰减，$b_0 = \frac1L\int f$ ✓ |
| $t\to0^+$ | $G\to\delta$，$T\to f$ | 方差 $2\alpha t\to0$，积分恒为 1 ✓ |
| 点源 $f = \delta(x)$ | 任意 $t>0$ 全空间 $T>0$ | $G>0$ 处处 ⟹ **无穷传播速度**（A2 的物理缺陷，Cattaneo 模型修正） ✓ |
| 稳态（$\partial_t=0$） | Laplace 方程、线性分布 | §5.3 ✓ |
| $\alpha\to0$ | 温度冻结 $T = f$ | $e^{-\alpha k^2t}\to1$ ✓ |
| 宽度标度 | 扩散距离 $\propto\sqrt{\alpha t}$ | Gauss 标准差 $\sqrt{2\alpha t}$ ✓ |

---

## 9. Numerical Implementation | 数值实现

### 9.1 显式 FTCS 与稳定性

2D 均匀网格，前向时间 + 中心空间（FTCS），$\mu_x = \alpha\Delta t/\Delta x^2$，$\mu_y = \alpha\Delta t/\Delta y^2$：
$$
T^{n+1}_{ij} = T^n_{ij} + \mu_x\big(T^n_{i+1,j} - 2T^n_{ij} + T^n_{i-1,j}\big) + \mu_y\big(T^n_{i,j+1} - 2T^n_{ij} + T^n_{i,j-1}\big).
$$
**von Neumann 分析**：代入 $T^n_{ij} = g^ne^{i(\theta_xi + \theta_yj)}$，用 $e^{i\theta} - 2 + e^{-i\theta} = -4\sin^2(\theta/2)$：
$$
g = 1 - 4\mu_x\sin^2\tfrac{\theta_x}{2} - 4\mu_y\sin^2\tfrac{\theta_y}{2}.
$$
$g\le1$ 恒成立；$g\ge-1$ 对所有波数（最坏 $\theta_x=\theta_y=\pi$）要求 $4(\mu_x+\mu_y)\le2$：
$$
\boxed{\ r := \alpha\,\Delta t\Big(\frac{1}{\Delta x^2} + \frac{1}{\Delta y^2}\Big)\le\frac12\ }
$$
1D 时为 $\alpha\Delta t/\Delta x^2\le1/2$。**代价**：$\Delta t\propto\Delta x^2$，网格加密 2 倍，步数增加 4 倍——刚性（stiffness）的体现。局部截断误差 $O(\Delta t + \Delta x^2)$，固定 $r$ 时全局误差 $O(\Delta x^2)$。

**替代方案**：Crank–Nicolson（无条件稳定、$O(\Delta t^2)$，但大 $r$ 时高频模 $g\to-1$ 产生振荡）；后向 Euler（L-稳定，抑制振荡）；隐式格式每步求解稀疏 SPD 系统 ⟹ 预条件 CG / 多重网格（领域 6）；周期域用谱方法 $\hat T_t = -\alpha k^2\hat T$ 可精确积分。

### 9.2 参考实现（NumPy，1D）

```python
import numpy as np

alpha, N = 1.0, 50
x = np.linspace(0.0, 1.0, N + 1); dx = x[1] - x[0]
rng = np.random.default_rng(0)
for r in (0.4, 0.6):                                  # 稳定 / 不稳定
    dt, steps = r * dx**2 / alpha, 500
    u = np.sin(np.pi * x) + 1e-10 * rng.standard_normal(N + 1)   # 微扰播种高频模
    u[0] = u[-1] = 0.0                                # Dirichlet
    for _ in range(steps):
        u[1:-1] += r * (u[2:] - 2 * u[1:-1] + u[:-2])
    exact = np.exp(-alpha * np.pi**2 * steps * dt) * np.sin(np.pi * x)
    print(f"r={r}: Fo={alpha*steps*dt:.3f}  max|u-exact| = {np.abs(u-exact).max():.2e}")
```

预期现象：$r=0.4$（$Fo=0.08$）误差约 $10^{-4}$ 量级（来自 $O(\Delta x^2)$ 的模态衰减率误差）；$r=0.6$ 时最高频模 $|g|\approx1.4$，500 步后放大约 $10^{72}$ 倍，误差 $\sim10^{60}$ 量级、呈锯齿状。[NEEDS VERIFICATION: 数值为手算估计，需运行确认]

### 9.3 关联实验

- [`05_experiments/heat_transfer/06_2d_heat_equation/`](../../05_experiments/heat_transfer/06_2d_heat_equation/)（已完成）：单位正方形、Dirichlet 0、初值 $\sin\pi x\sin\pi y$，精确解 $e^{-2\pi^2\alpha t}\sin\pi x\sin\pi y$。验证 (0) SymPy 残差为零；(1) 离散本征模放大因子 $g = 1 - 4r\sin^2(\pi h/2)$ 与 FTCS 逐步吻合至舍入误差；(2) $r=0.4$ 时 $O(h^2)$ 收敛；(3) $r=0.4$ 稳定 vs. $r=0.6$ 爆炸，即 §9.1 的界。

---

## 10. Engineering Applications | 工程应用

| 领域 | 具体问题 | 热方程的角色 | 最先失效的假设 |
|---|---|---|---|
| **2 · 半导体：芯片热管理** | 热点（hot spot）、结温、封装热阻、瞬态功率脉冲 | 稳态 Poisson $\nabla\cdot(k\nabla T) = -Q$ 给出热阻网络 $R = L/kA$；瞬态时间常数 $L^2/\alpha$（Si 芯片 ~0.1 ms）决定"热容缓冲"能吸收多短的功率脉冲；散热片表面为 Robin 条件 | A1（FinFET/GAA 纳米结构中声子弹道输运）；A3（$k_{\text{Si}}$ 随温度显著下降） |
| **2 · 半导体：掺杂扩散** | 离子注入后退火、预淀积（pre-deposition）与再分布（drive-in） | Fick 第二定律 $C_t = DC_{xx}$，$D = D_0e^{-E_a/k_BT}$。恒定表面浓度：$C = C_s\,\mathrm{erfc}\big(x/2\sqrt{Dt}\big)$；有限总量 $Q_0$（表面不透，Neumann）：$C = \frac{Q_0}{\sqrt{\pi Dt}}e^{-x^2/4Dt}$（半无限域中热核的镜像解）。结深 $\propto\sqrt{Dt}$ ⟹ "热预算" $Dt$ | A3（高浓度下 $D$ 依赖于 $C$；瞬态增强扩散 TED） |
| **4 · 制造：增材制造（金属 3D 打印）** | 熔池尺寸、冷却速率、残余应力 | 移动点热源的准稳态 Rosenthal 解 $T - T_0 = \frac{P}{2\pi kR}\exp\!\big(-\frac{v(R+\xi)}{2\alpha}\big)$（$\xi$ 沿扫描方向、$R$ 为到热源距离）；Péclet 数 $vL/\alpha$ 衡量对流 vs. 扩散；冷却速率决定微观组织 | A5（熔化/凝固潜热、Marangoni 对流）；A3（物性随温度剧变） |
| **6 · HPC** | 大规模瞬态热仿真 | 显式格式受 $\Delta t\le\Delta x^2/(2d\alpha)$ 限制 ⟹ 隐式格式 + 多重网格 / 预条件 CG；空间并行时为 halo 交换 | 网格各向异性使条件数恶化 |
| **1 · AI** | PINN、神经算子、扩散模型 | 热方程是 PINN 标准基准；扩散生成模型的前向过程是 Gauss 卷积（热核）；图像 Gauss 平滑 = 运行时间 $t = \sigma^2/2$ 的热方程 | 高频解 / 刚性问题使 PINN 训练困难（频谱偏置） |

---

## 11. References | 参考资料

1. L. C. Evans, *Partial Differential Equations*, 2nd ed., AMS, 2010. §2.3（热核、平均值性质、极值原理、能量法唯一性）。
2. W. A. Strauss, *Partial Differential Equations: An Introduction*, 2nd ed., Wiley, 2008. Ch. 2.4–2.5（扩散方程）、Ch. 4–5（分离变量、Fourier 级数）。
3. H. S. Carslaw & J. C. Jaeger, *Conduction of Heat in Solids*, 2nd ed., Oxford, 1959.（解析解大全：Robin 本征值、移动热源）
4. T. L. Bergman, A. S. Lavine, F. P. Incropera & D. P. DeWitt, *Fundamentals of Heat and Mass Transfer*, 7th ed., Wiley, 2011. Ch. 2（导热方程推导）、Ch. 5（瞬态导热、集总参数、$Bi$ 与 $Fo$）。 [NEEDS VERIFICATION: 章号凭记忆]
5. R. J. LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*, SIAM, 2007. Ch. 9（扩散方程、von Neumann 稳定性、Crank–Nicolson）。
6. S. M. Sze & M.-K. Lee, *Semiconductor Devices: Physics and Technology*, 3rd ed., Wiley, 2012.（杂质扩散：erfc 与 Gauss 分布）
7. D. Rosenthal, "The theory of moving sources of heat and its application to metal treatments," *Trans. ASME* 68:849–866, 1946.
8. G. Chen, *Nanoscale Energy Transport and Conversion*, Oxford, 2005.（Fourier 定律在纳米尺度的失效）

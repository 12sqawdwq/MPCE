# Wave Equation | 波动方程

<!--
CONTRIBUTING 七问（简答）
1 定位：ROADMAP Phase II, II.3（PDE 分类与经典解）、II.8（PDE 数值方法入门）。
2 先修：牛顿第二定律；MATH-VC-01（散度、旋度恒等式）；fourier_transform.md（MATH-FA-01）；heat_equation.md（分离变量）。
3 结构：双曲型 PDE 原型；与热方程对照——有限传播速度、能量守恒（而非耗散）、无光滑化效应。
4 推导：L1 必证——弦的小斜率推导、由 Maxwell 方程推出电磁波动方程、d'Alembert 公式、分离变量、能量守恒与唯一性、蛙跳格式的 CFL 条件。
5 计算：蛙跳格式在 C<1、C=1、C>1 时的行为（计划实验）。
6 应用：声学、电磁传播与互连、超声/地震成像、结构振动。
7 代价：约 10–12 h（推导 6 h + 实验 4 h）。
-->

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-DE-03`（Partial Differential Equations）· 关联 `PHYS-EM-01`、`PHYS-CM-02`、`MATH-FA-01`、`MATH-NA-03` |
| Phase | Phase II — ROADMAP **II.3**、**II.8** |
| Prerequisites | Newton 第二定律；`MATH-VC-01`（$\nabla\times\nabla\times = \nabla\nabla\cdot - \nabla^2$）；[`fourier_transform.md`](fourier_transform.md)；[`heat_equation.md`](heat_equation.md) §5.4（分离变量） |
| Primary References | Strauss, *PDE: An Introduction*, Ch. 2；Evans, *PDE*, §2.4；Griffiths, *Introduction to Electrodynamics*, Ch. 9；LeVeque, *Finite Difference Methods*, Ch. 10；Courant–Friedrichs–Lewy (1928) |

---

## 1. Physical Motivation | 物理动机

弹拨的琴弦、空气中的声音、光与无线电、地震、超声探头发出的脉冲——它们都以**有限速度传播**，并**携带能量而不（理想情况下）耗散**。与热方程（[`heat_equation.md`](heat_equation.md)）对比：

| | 热方程 $u_t = \alpha u_{xx}$ | 波动方程 $u_{tt} = c^2u_{xx}$ |
|---|---|---|
| 类型 | 抛物型 | 双曲型 |
| 传播速度 | 无限（但指数衰减） | 有限，$c$ |
| 能量 | 单调耗散 | 守恒 |
| 初值的不光滑 | 瞬间磨平 | 沿特征线原样传播 |
| 时间可逆性 | 否 | 是（$t\to-t$ 不变） |

本文回答：(1) 两个完全不同的物理系统——张紧的弦与真空电磁场——为何给出同一个方程？(2) 解的结构是什么（行波、驻波）？(3) 需要哪些初/边界条件？(4) 显式格式为何必须满足 CFL 条件 $c\Delta t/\Delta x\le1$？

---

## 2. Physical Assumptions | 物理假设

**弦（§5.1）**

| 编号 | 假设 | 失效后果 |
|---|---|---|
| S1 | 完全柔性：不抗弯，只传递切向张力 | 抗弯刚度引入 $u_{xxxx}$ 项 ⟹ 色散（钢琴弦的泛音偏高） |
| S2 | **小斜率**：$\lvert u_x\rvert\ll1$ | 大振幅时张力随伸长变化，方程非线性（Kirchhoff–Carrier） |
| S3 | 只有横向运动，无纵向位移 | 纵横耦合在大振幅下出现 |
| S4 | 线密度 $\rho$ 均匀，忽略重力与阻尼 | 阻尼 ⟹ 电报方程 $u_{tt} + \gamma u_t = c^2u_{xx}$ |

**电磁场（§5.2）**

| 编号 | 假设 | 失效后果 |
|---|---|---|
| E1 | 真空（或线性、均匀、各向同性、无损介质：$\varepsilon,\mu$ 为常数） | 色散介质中 $\varepsilon(\omega)$ ⟹ 波包展宽；导体中出现扩散项（趋肤效应） |
| E2 | 无自由电荷与电流：$\rho_f = 0$，$\mathbf J = 0$ | 有源时为非齐次波动方程（推迟势） |
| E3 | 经典场（光子数 ≫ 1） | 单光子层面需量子电动力学 |

---

## 3. Mathematical Definitions | 数学定义

| 符号 | 含义 | SI 单位 |
|---|---|---|
| $u(x,t)$ | 弦的横向位移 | m |
| $T_0$ | 弦的张力 | N |
| $\rho$ | 线密度 | kg·m⁻¹ |
| $c$ | 波速：弦 $\sqrt{T_0/\rho}$；真空 $1/\sqrt{\mu_0\varepsilon_0}$ | m·s⁻¹ |
| $\mathbf E$, $\mathbf B$ | 电场、磁感应强度 | V·m⁻¹，T |
| $\varepsilon_0$, $\mu_0$ | 真空介电常数、磁导率 | F·m⁻¹，H·m⁻¹ |
| $\omega$, $k$ | 角频率、角波数，$\omega = ck$ | s⁻¹，m⁻¹ |
| $Z = \rho c = \sqrt{T_0\rho}$ | 弦的特性阻抗 | kg·s⁻¹ |
| $C := c\Delta t/\Delta x$ | Courant 数 | 1 |
| $\square := \partial_t^2 - c^2\nabla^2$ | d'Alembert 算子 | — |

---

## 4. Governing Principles | 基本原理

1. **Newton 第二定律**：质量元的动量变化率等于合外力。
2. **Maxwell 方程组（真空，微分形式）**：
   $\nabla\cdot\mathbf E = 0,\quad \nabla\cdot\mathbf B = 0,\quad \nabla\times\mathbf E = -\partial_t\mathbf B,\quad \nabla\times\mathbf B = \mu_0\varepsilon_0\,\partial_t\mathbf E .$
3. **矢量恒等式**：$\nabla\times(\nabla\times\mathbf F) = \nabla(\nabla\cdot\mathbf F) - \nabla^2\mathbf F$（直角坐标分量）。
4. **链式法则 / 特征坐标变换**（d'Alembert 解）。

---

## 5. Mathematical Derivation | 数学推导

### 5.1 张紧弦：Newton 第二定律 + 小斜率

取弦元 $[x, x+\Delta x]$，两端张力 $T(x)$、$T(x+\Delta x)$ 沿切向，与水平夹角 $\theta(x)$，$\tan\theta = u_x$。

**Step 1（水平方向：无纵向运动，S3）**
$$
T(x+\Delta x)\cos\theta(x+\Delta x) - T(x)\cos\theta(x) = 0 \;\Longrightarrow\; T\cos\theta = T_0 = \text{const}.
$$

**Step 2（竖直方向，Newton 第二定律）** 弦元质量 $\rho\Delta x$（S2 下弧长 $\sqrt{1+u_x^2}\,\Delta x\approx\Delta x$）：
$$
\rho\,\Delta x\,u_{tt} = T\sin\theta\Big|_{x+\Delta x} - T\sin\theta\Big|_{x} = T_0\tan\theta\Big|_{x}^{x+\Delta x} = T_0\big[u_x(x+\Delta x,t) - u_x(x,t)\big].
$$
第二个等号用了 Step 1：$T\sin\theta = (T\cos\theta)\tan\theta = T_0u_x$——**此处精确**；小斜率假设实际上用在"$T\cos\theta = T_0$ 且 $T\approx T_0$"（$T = T_0\sqrt{1+u_x^2} = T_0 + O(u_x^2)$）以及质量元长度上。

**Step 3** 除以 $\Delta x$，令 $\Delta x\to0$：
$$
\boxed{\ u_{tt} = c^2u_{xx},\qquad c = \sqrt{T_0/\rho}\ }
$$
有外力（每单位长度 $f$）时右边加 $f/\rho$。

### 5.2 真空中的电磁波：由 Maxwell 方程推出

**Step 1** 对 Faraday 定律取旋度，用恒等式 [原理 3] 与 Gauss 定律 $\nabla\cdot\mathbf E = 0$：
$$
\nabla\times(\nabla\times\mathbf E) = \underbrace{\nabla(\nabla\cdot\mathbf E)}_{=0} - \nabla^2\mathbf E = -\partial_t(\nabla\times\mathbf B).
$$

**Step 2** 代入 Ampère–Maxwell 定律 $\nabla\times\mathbf B = \mu_0\varepsilon_0\partial_t\mathbf E$（空间与时间导数可交换）：
$$
-\nabla^2\mathbf E = -\mu_0\varepsilon_0\,\partial_t^2\mathbf E \;\Longrightarrow\; \boxed{\ \partial_t^2\mathbf E = c^2\nabla^2\mathbf E,\qquad c = \frac{1}{\sqrt{\mu_0\varepsilon_0}}\ }
$$
对 $\mathbf B$ 同理（对 Ampère–Maxwell 取旋度，用 $\nabla\cdot\mathbf B = 0$ 与 Faraday 定律）。代入 $\varepsilon_0 = 8.854\times10^{-12}$ F/m、$\mu_0\approx4\pi\times10^{-7}$ H/m 得 $c\approx2.998\times10^8$ m/s——Maxwell 由此断定光是电磁波。

**Step 3（平面波的横波性）** 设 $\mathbf E = \mathbf E_0e^{i(\mathbf k\cdot\mathbf x - \omega t)}$。波动方程 ⟹ $\omega = c|\mathbf k|$；$\nabla\cdot\mathbf E = i\mathbf k\cdot\mathbf E = 0$ ⟹ $\mathbf E\perp\mathbf k$；Faraday 定律 ⟹ $\mathbf B = \hat{\mathbf k}\times\mathbf E/c$。**注意**：每个分量满足波动方程是**必要不充分**的，散度约束必须另加。

**能量（Poynting 定理）**：由 $\mathbf E\cdot(\text{Ampère}) - \mathbf B/\mu_0\cdot(\text{Faraday})$ 及 $\nabla\cdot(\mathbf E\times\mathbf B) = \mathbf B\cdot\nabla\times\mathbf E - \mathbf E\cdot\nabla\times\mathbf B$，得 $\partial_tw + \nabla\cdot\mathbf S = 0$，$w = \tfrac12(\varepsilon_0E^2 + B^2/\mu_0)$，$\mathbf S = \mathbf E\times\mathbf B/\mu_0$。

### 5.3 d'Alembert 解（无界弦）

问题：$u_{tt} = c^2u_{xx}$，$x\in\mathbb R$，$u(x,0) = \phi(x)$，$u_t(x,0) = \psi(x)$。

**Step 1（算子因式分解）** $\partial_t^2 - c^2\partial_x^2 = (\partial_t - c\partial_x)(\partial_t + c\partial_x)$。

**Step 2（特征坐标）** 令 $\xi = x - ct$，$\eta = x + ct$。链式法则 [原理 4]：$\partial_x = \partial_\xi + \partial_\eta$，$\partial_t = -c\partial_\xi + c\partial_\eta$，故 $\partial_t + c\partial_x = 2c\,\partial_\eta$，$\partial_t - c\partial_x = -2c\,\partial_\xi$。方程化为
$$
-4c^2\,u_{\xi\eta} = 0 \;\Longrightarrow\; u = F(\xi) + G(\eta) = F(x - ct) + G(x + ct).
$$
**右行波 + 左行波**，形状不变，速度 $\pm c$。

**Step 3（代入初值）** $F + G = \phi$；$-cF' + cG' = \psi$，积分得 $-F + G = \frac1c\int_0^x\psi\,ds + K$。联立解出 $F, G$ 并代回：
$$
\boxed{\ u(x,t) = \frac{\phi(x-ct) + \phi(x+ct)}{2} + \frac{1}{2c}\int_{x-ct}^{x+ct}\psi(s)\,ds\ }
$$
**推论**：
- **依赖域**：$u(x,t)$ 只依赖于初值在 $[x-ct, x+ct]$ 上的取值；**影响域**：点 $x_0$ 的扰动只影响 $|x - x_0|\le ct$——有限传播速度。这是 §9 CFL 条件的连续来源。
- **不光滑性传播**：$\phi$ 的拐点/间断沿特征线 $x\pm ct = $ const 原样传播，不被磨平（对比热方程 §5.4）。
- **适定**：$\sup|u|\le\sup|\phi| + t\sup|\psi|$，对初值连续依赖。

### 5.4 分离变量：有限弦的驻波

问题：$0<x<L$，$u(0,t) = u(L,t) = 0$，初值 $\phi,\psi$。

设 $u = X(x)\Theta(t)$：$\dfrac{\Theta''}{c^2\Theta} = \dfrac{X''}{X} = -\lambda$。空间问题与热方程完全相同（[`heat_equation.md`](heat_equation.md) §5.4）：$X_n = \sin(n\pi x/L)$，$\lambda_n = (n\pi/L)^2$。但时间方程是**二阶**的：$\Theta'' + \omega_n^2\Theta = 0$，$\omega_n = n\pi c/L$——振荡而非衰减。
$$
u(x,t) = \sum_{n=1}^{\infty}\big(A_n\cos\omega_nt + B_n\sin\omega_nt\big)\sin\frac{n\pi x}{L},\quad
A_n = \frac2L\int_0^L\phi\sin\frac{n\pi x}{L}dx,\quad B_n = \frac{2}{\omega_nL}\int_0^L\psi\sin\frac{n\pi x}{L}dx .
$$
基频 $f_1 = \omega_1/2\pi = \dfrac{1}{2L}\sqrt{T_0/\rho}$（Mersenne 定律），泛音为整数倍——**谐和**。由 $\cos\omega_nt\sin k_nx = \tfrac12[\sin k_n(x+ct) + \sin k_n(x-ct)]$，驻波 = 两列反向行波的叠加，与 §5.3 一致。

### 5.5 能量守恒与唯一性

**Step 1** 定义 $E(t) = \displaystyle\int_0^L\Big(\tfrac12\rho u_t^2 + \tfrac12T_0u_x^2\Big)dx$（动能 + 弹性势能，后者来自伸长 $\sqrt{1+u_x^2} - 1\approx\tfrac12u_x^2$ 乘以张力）。

**Step 2** 求导并用方程 $\rho u_{tt} = T_0u_{xx}$：
$$
E'(t) = \int_0^L\big(\rho u_tu_{tt} + T_0u_xu_{xt}\big)dx = T_0\int_0^L\big(u_tu_{xx} + u_xu_{xt}\big)dx = T_0\int_0^L\partial_x(u_tu_x)\,dx = T_0\big[u_tu_x\big]_0^L .
$$

**Step 3** 固定端（$u_t = 0$）或自由端（$u_x = 0$）下边界项为零 ⟹ $E(t) = E(0)$。$-T_0u_tu_x$ 是经端点传输的功率。

**唯一性**：两解之差 $w$ 满足零初值、齐次边界，$E_w(t) = E_w(0) = 0$ ⟹ $w_t = w_x = 0$ ⟹ $w\equiv$ 常数 $= 0$。

---

## 6. Boundary and Initial Conditions | 边界条件与初始条件

**初始条件**：时间二阶 ⟹ 需要**两个**初值：位移 $u(x,0) = \phi$ 与速度 $u_t(x,0) = \psi$。

| 类型 | 形式 | 物理情形 | 反射 |
|---|---|---|---|
| Dirichlet | $u = 0$ | 弦端固定；理想导体表面切向 $\mathbf E = 0$ | 位移反相反射（奇延拓） |
| Neumann | $u_x = 0$ | 端点套在无摩擦竖杆上；声学硬壁 $\partial_np = 0$ | 同相反射（偶延拓） |
| Robin | $T_0u_x + \kappa u = 0$ | 弹簧支撑端 | 频率相关相移 |
| 吸收（阻抗匹配） | $u_t + cu_x = 0$（右端） | 无限长弦的截断；传输线匹配负载 | 1D 中对右行波**精确无反射**：$u = F(x - ct)$ 自动满足 |
| 界面（阻抗 $Z_1\to Z_2$） | $u$ 与 $T_0u_x$ 连续 | 两段不同密度的弦；声阻抗突变的组织界面 | 位移反射系数 $R = \dfrac{Z_1 - Z_2}{Z_1 + Z_2}$，透射 $\dfrac{2Z_1}{Z_1+Z_2}$ |

**特征线视角**：每个边界点上恰有一条特征线**进入**区域，因此每端需要且只需要一个边界条件。多维时吸收边界无法对所有入射角精确成立，需 PML（完美匹配层）。

---

## 7. Dimensional Analysis | 量纲分析

- 弦：$[T_0/\rho] = \text{N}/(\text{kg·m}^{-1}) = (\text{kg·m·s}^{-2})(\text{m·kg}^{-1}) = \text{m}^2\text{s}^{-2}$ ⟹ $[c] = $ m/s ✓。
- 电磁：$[\mu_0\varepsilon_0] = (\text{H/m})(\text{F/m}) = (\Omega\cdot\text{s})(\text{s}/\Omega)/\text{m}^2 = \text{s}^2/\text{m}^2$ ⟹ $[c] = $ m/s ✓。
- 能量密度：$[\rho u_t^2] = (\text{kg/m})(\text{m/s})^2 = $ J/m，$[T_0u_x^2] = $ N = J/m ✓。
- 无量纲化：$x^* = x/L$，$t^* = ct/L$ ⟹ $u_{t^*t^*} = u_{x^*x^*}$，**无自由参数**；特征时间 $L/c$（渡越时间）——对比热方程的 $L^2/\alpha$：波动时间随尺寸**线性**增长。
- 加阻尼 $\gamma u_t$ 后出现无量纲数 $\gamma L/c$（品质因数的倒数量级）。
- 数值：$C = c\Delta t/\Delta x$ 无量纲，表示一步之内波走过多少个网格。

---

## 8. Limiting Cases | 极限情形验证

| 极限情形 | 预期 | 验证 |
|---|---|---|
| $\psi = 0$ | 初始形状分裂成两个半幅脉冲，反向传播 | d'Alembert 第一项 ✓ |
| $\phi = 0$，$\psi = \delta(x - x_0)$ | 宽 $2ct$ 的矩形"台阶"，高 $1/2c$ | 积分项 = $\frac{1}{2c}\mathbf 1_{|x-x_0|<ct}$ ✓ |
| 稳态 $u_{tt} = 0$ | Laplace 方程，弦为直线 | ✓ |
| 色散关系 | $\omega = ck$，$v_g = v_p = c$：无色散 | 平面波代入 ✓；加刚度项后 $\omega^2 = c^2k^2 + \beta k^4$，有色散 |
| $t\to-t$ | 方程不变（可逆） | 只含 $\partial_t^2$ ✓ |
| 3D 球对称 | $u = \dfrac{F(r - ct)}{r}$，振幅 $\propto1/r$，能量 $\propto1/r^2$ | $\nabla^2u = \frac1r\partial_r^2(ru)$ ⟹ $ru$ 满足 1D 方程 ✓ |
| $Z_1 = Z_2$ | 无反射 | $R = 0$ ✓ |
| $Z_2\to\infty$（固定端）/ $Z_2\to0$（自由端） | $R = -1$ / $R = +1$ | 公式 ✓，与 Dirichlet/Neumann 一致 |
| 有限弦，$t = 2L/c$ | 回到初始状态（周期 $2L/c$） | $\omega_nt = 2n\pi$ ✓ |

---

## 9. Numerical Implementation | 数值实现

### 9.1 蛙跳（中心差分）格式与 CFL 条件

$$
u^{n+1}_i = 2u^n_i - u^{n-1}_i + C^2\big(u^n_{i+1} - 2u^n_i + u^n_{i-1}\big),\qquad C = \frac{c\Delta t}{\Delta x}.
$$
**相容性**：时间、空间均为二阶中心差分，截断误差 $O(\Delta t^2 + \Delta x^2)$。

**启动步**：由 Taylor 展开 $u^1 = u^0 + \Delta t\,\psi + \tfrac12\Delta t^2c^2u_{xx}$：$u^1_i = u^0_i + \Delta t\,\psi_i + \tfrac{C^2}{2}(u^0_{i+1} - 2u^0_i + u^0_{i-1})$（保持二阶精度）。

**von Neumann 分析**：代入 $u^n_i = g^ne^{i\theta i}$，令 $s = \sin(\theta/2)$：
$$
g^2 - 2\big(1 - 2C^2s^2\big)g + 1 = 0 .
$$
两根乘积为 1。记 $b = 1 - 2C^2s^2$：
- 若 $|b|\le1$，两根 $g = b\pm i\sqrt{1-b^2}$ 共轭且 $|g| = 1$——**无耗散**，与连续问题的能量守恒一致；
- 若 $|b|>1$，两根为实数且必有一根 $|g|>1$——**不稳定**。

$b\le1$ 恒成立；$b\ge-1 \iff C^2s^2\le1$，对所有 $\theta$（$s^2\le1$）成立当且仅当
$$
\boxed{\ C = \frac{c\,\Delta t}{\Delta x}\le1\ }\qquad\text{（CFL 条件）}
$$
**物理解释（Courant–Friedrichs–Lewy, 1928）**：格式的数值依赖域 $[x_i - n\Delta x, x_i + n\Delta x]$ 必须包含 §5.3 的连续依赖域 $[x_i - ct^n, x_i + ct^n]$，即 $c\Delta t\le\Delta x$。否则格式"看不到"决定解的初值，不可能收敛。CFL 是**必要**条件；对蛙跳格式它恰好也是充分的。

**数值色散**：令 $g = e^{-i\omega\Delta t}$，得 $\sin(\omega\Delta t/2) = C\sin(k\Delta x/2)$。$C = 1$ 时 $\omega = ck$ 精确——"magic time step"，格式在网格点上给出精确解（1D）；$C<1$ 时短波传播偏慢（相位滞后）。

**多维**：2D 均匀网格 $c\Delta t\sqrt{1/\Delta x^2 + 1/\Delta y^2}\le1$；3D 类推。电磁 FDTD（Yee 格式）满足同样形式的条件。

**对比热方程**：FTCS 要求 $\Delta t\propto\Delta x^2$（[`heat_equation.md`](heat_equation.md) §9.1），波动方程只需 $\Delta t\propto\Delta x$——双曲问题的显式格式代价低得多。

### 9.2 参考实现（NumPy）

```python
import numpy as np

def vibrating_string(C, N=100, periods=5, c=1.0, L=1.0):
    """固定端弦，初值 sin(pi x)、零初速；返回 periods 个周期后与精确解的最大误差。"""
    dx = L / N
    dt = C * dx / c
    x = np.linspace(0.0, L, N + 1)
    nsteps = int(round(periods * 2 * L / c / dt))
    u_prev = np.sin(np.pi * x)
    u = u_prev.copy()                                  # 启动步（psi = 0）
    u[1:-1] += 0.5 * C**2 * (u_prev[2:] - 2 * u_prev[1:-1] + u_prev[:-2])
    for _ in range(nsteps - 1):
        u_next = np.zeros_like(u)                      # Dirichlet: 端点恒为 0
        u_next[1:-1] = 2 * u[1:-1] - u_prev[1:-1] + C**2 * (u[2:] - 2 * u[1:-1] + u[:-2])
        u_prev, u = u, u_next
    exact = np.sin(np.pi * x) * np.cos(np.pi * c * nsteps * dt / L)
    return np.max(np.abs(u - exact)), np.max(np.abs(u))

for C in (0.5, 0.9, 1.0, 1.01):
    err, amp = vibrating_string(C)
    print(f"C = {C:4.2f}   max error = {err:.2e}   max|u| = {amp:.2e}")
```

预期现象：$C = 0.5, 0.9$ 的误差主要是相位误差，量级 $10^{-4}$–$10^{-3}$（由数值色散关系估计相对相速误差 $\approx(k\Delta x)^2(1-C^2)/24$，随 $C\to1$ 减小）；$C = 1.0$ 误差接近舍入水平；$C = 1.01$ 时舍入误差激发的最高频模以 $|g|>1$ 增长，数百步后 $\max|u|$ 爆炸。[NEEDS VERIFICATION: 具体数值需运行确认]

### 9.3 关联实验（计划中）

- `05_experiments/wave_propagation/01_1d_string_cfl/`：上述 CFL 扫描、数值色散关系 $\sin(\omega\Delta t/2) = C\sin(k\Delta x/2)$ 的测量、离散能量守恒检验。（目录尚未创建）
- `05_experiments/wave_propagation/02_fdtd_1d_maxwell/`：Yee 格式 + 吸收边界，验证界面反射系数 $R = (Z_1 - Z_2)/(Z_1 + Z_2)$。（目录尚未创建）

---

## 10. Engineering Applications | 工程应用

| 领域 | 具体问题 | 波动方程的角色 | 最先失效的假设 |
|---|---|---|---|
| **声学** | 房间声学、管乐器、降噪 | 线性化 Euler 方程 + 绝热状态方程 ⟹ $p_{tt} = c^2\nabla^2p$，$c = \sqrt{\gamma p_0/\rho_0}\approx343$ m/s（20 °C 空气）；频域为 Helmholtz 方程 $\nabla^2\hat p + k^2\hat p = 0$ | 小振幅（冲击波、高声强非线性）；黏性/热传导吸收 |
| **EM 传播 / 半导体互连** | 天线、波导、PCB/片上互连信号完整性 | 无损传输线电报方程 ⟹ $V_{zz} = L'C'V_{tt}$，$v = 1/\sqrt{L'C'}$，$Z_0 = \sqrt{L'/C'}$；阻抗不匹配处反射系数同 §6；FDTD 全波仿真受 CFL 约束 | E1（有损介质、趋肤效应 ⟹ 色散与衰减） |
| **7 · 超声成像** | B 超、弹性成像、HIFU | 软组织 $c\approx1540$ m/s；回波深度 $d = ct/2$；5 MHz 时 $\lambda\approx0.31$ mm 决定轴向分辨率；组织界面回波强度由声阻抗失配 $R = (Z_1 - Z_2)/(Z_1+Z_2)$ 决定（骨/软组织、气体/软组织界面近全反射） | 频率相关衰减（~0.5 dB/cm/MHz 量级）、非线性谐波成像 [NEEDS VERIFICATION: 衰减系数] |
| **地震成像** | 勘探地震、逆时偏移（RTM）、全波形反演（FWI） | 弹性波方程分解为 P 波 $c_P = \sqrt{(\lambda+2\mu)/\rho}$ 与 S 波 $c_S = \sqrt{\mu/\rho}$；RTM 利用方程的时间可逆性（§8）把记录的波场逆向传播回去成像；FWI 用伴随方法求梯度 | 各向异性、衰减（$Q$）、强非均匀 |
| **3/4 · 结构振动** | 杆的纵振、轴的扭振、索/弦振动 | 杆 $c = \sqrt{E/\rho}$，扭转 $c = \sqrt{G/\rho}$；固有频率 $\omega_n = n\pi c/L$（§5.4）；模态叠加用于避开共振 | 梁的弯曲振动是 4 阶 Euler–Bernoulli 方程 $\rho Au_{tt} + EIu_{xxxx} = 0$，**有色散**，不是波动方程 |
| **5 · 材料** | 声子、弹性常数测量 | 晶格动力学长波极限给出声学支 $\omega = c_sk$；超声脉冲回波法测 $c$ 反推弹性模量 | 短波长（布里渊区边界）色散 |

---

## 11. References | 参考资料

1. W. A. Strauss, *Partial Differential Equations: An Introduction*, 2nd ed., Wiley, 2008. **Ch. 1.3（弦的推导）、Ch. 2（d'Alembert 公式、因果性、能量）**、Ch. 4（分离变量）。 [NEEDS VERIFICATION: 节号]
2. L. C. Evans, *Partial Differential Equations*, 2nd ed., AMS, 2010. **§2.4（波动方程：d'Alembert、球面平均、能量法）**。
3. D. J. Griffiths, *Introduction to Electrodynamics*, 4th ed., Cambridge, 2017. **Ch. 9（电磁波）**、Ch. 8（Poynting 定理）。
4. J. D. Jackson, *Classical Electrodynamics*, 3rd ed., Wiley, 1999. Ch. 7（平面电磁波）。
5. R. Courant, K. Friedrichs & H. Lewy, "Über die partiellen Differenzengleichungen der mathematischen Physik," *Math. Ann.* 100:32–74, 1928.
6. R. J. LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations*, SIAM, 2007. Ch. 10（advection/wave，von Neumann 分析，CFL）。 [NEEDS VERIFICATION: 章号]
7. A. Taflove & S. C. Hagness, *Computational Electrodynamics: The Finite-Difference Time-Domain Method*, 3rd ed., Artech House, 2005.（Yee 格式、数值色散、PML）
8. L. E. Kinsler, A. R. Frey, A. B. Coppens & J. V. Sanders, *Fundamentals of Acoustics*, 4th ed., Wiley, 2000. Ch. 2–5（弦、声波方程、声阻抗）。
9. T. L. Szabo, *Diagnostic Ultrasound Imaging: Inside Out*, 2nd ed., Academic Press, 2014.
10. A. Tarantola, "Inversion of seismic reflection data in the acoustic approximation," *Geophysics* 49(8):1259–1266, 1984.（FWI 伴随梯度）

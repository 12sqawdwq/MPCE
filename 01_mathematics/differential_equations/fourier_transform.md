# Fourier Transform | 傅里叶变换

<!--
CONTRIBUTING 七问（简答）
1 定位：ROADMAP Phase II, II.5（Fourier 分析与谱方法）；为 II.3/II.8（热方程、波动方程的谱解法）提供工具。
2 先修：MATH-LA-01（内积、正交投影）；Riemann/Lebesgue 积分、复指数；linear_least_squares.md（有限维最佳逼近）。
3 结构：Fourier 级数 = L^2[-L,L] 中的正交展开（最小二乘在无穷维的推广）；Fourier 变换 = 平移不变算子的对角化。
4 推导：L1 必证——级数→积分极限、Plancherel、微分定理、卷积定理、Poisson 求和与混叠、FFT 的 O(N log N) 递推。
5 计算：谱微分的指数收敛 vs. 有限差分的代数收敛；混叠演示。
6 应用：领域 7（MRI k 空间、CT 中心切片定理）、5（倒格子）、2（Fourier 光学光刻）、1（Fourier 神经算子）。
7 代价：约 10–12 h（推导 6 h + 实验 4 h）。
-->

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-FA-01`（Fourier Transform）· 关联 `MATH-LA-01`、`MATH-FA-03`、`MATH-DE-03`、`PHYS-SS-01`、`PHYS-TR-01`、`PHYS-EM-01` |
| Phase | Phase II — ROADMAP **II.5** |
| Prerequisites | `MATH-LA-01`（内积空间、正交投影）；[`../linear_algebra/linear_least_squares.md`](../linear_algebra/linear_least_squares.md)（最佳逼近）；复数与复指数；广义积分 |
| Primary References | Stein & Shakarchi, *Fourier Analysis*, Ch. 2–5；Bracewell, *The Fourier Transform and Its Applications*；Trefethen, *Spectral Methods in MATLAB*；Cooley & Tukey (1965) |

---

## 1. Physical Motivation | 物理动机

许多物理系统是**线性且平移不变（linear, shift-invariant）**的：热传导、真空中的电磁波、小振幅声波、理想成像系统。对这类系统，复指数 $e^{ikx}$ 是**本征函数**——输入一个纯频率，输出仍是同一频率，只被乘上一个复数（增益与相移）。于是：

- 把任意信号拆成频率分量 ⟹ 每个分量独立演化 ⟹ 再合成。偏微分方程（PDE）变成代数方程或常微分方程（ODE）。
- 测量设备本身常常**直接测量 Fourier 分量**：MRI 采集的是 k 空间（k-space）数据，X 射线衍射测量的是电子密度的 Fourier 变换（模长），光刻成像系统是一个空间频率低通滤波器。
- 计算机只能处理有限个采样点：离散 Fourier 变换（DFT）及其快速算法（FFT）是连接连续理论与数字计算的桥梁，而**采样会引入混叠（aliasing）**。

本文回答：(1) Fourier 积分如何从 Fourier 级数严格（形式上）得到？(2) 为什么能量守恒（Parseval/Plancherel）？(3) 为什么微分变成乘法、卷积变成乘积？(4) 采样后哪些信息会丢失（Nyquist）？(5) FFT 为何是 $O(N\log N)$？

---

## 2. Physical Assumptions | 物理假设

| 编号 | 假设 | 含义 / 失效后果 |
|---|---|---|
| A1 | **线性**：系统满足叠加原理 | 非线性系统（湍流、强场光学）中频率分量相互耦合，产生和频/差频，Fourier 方法只能作为分析工具而非解法 |
| A2 | **平移不变（时不变/空间均匀）**：系数不依赖于 $x$ 或 $t$ | 非均匀介质中 $e^{ikx}$ 不再是本征函数；需 WKB、Bloch 波（周期介质，§10）或数值本征分解 |
| A3 | **信号可积或有限能量**：$f \in L^1(\mathbb{R})$ 或 $L^2(\mathbb{R})$ | 平面波、常数、阶跃不在 $L^2$ 中，需广义函数（分布）意义下的变换，如 $\hat 1 = 2\pi\delta$ |
| A4 | **周期性（级数情形）**：$f$ 在 $[-L,L]$ 上给出并周期延拓 | 若端点值不相等，延拓产生跳跃 ⟹ Gibbs 现象、系数仅 $O(1/n)$ 衰减（§6） |
| A5 | **均匀采样（DFT 情形）**：采样间隔 $\Delta x$ 恒定、窗口长度有限 | 非均匀采样（径向 MRI 轨迹）需 NUFFT；有限窗口导致频谱泄漏（leakage） |

---

## 3. Mathematical Definitions | 数学定义

本文采用**角波数（angular wavenumber）约定**，与物理/PDE 文献一致：

| 符号 | 定义 | 量纲 |
|---|---|---|
| $\langle f,g\rangle_{L}$ | $\displaystyle\int_{-L}^{L} f(x)\overline{g(x)}\,dx$ | $[f][g][x]$ |
| $c_n$ | Fourier 系数 $\displaystyle c_n = \frac{1}{2L}\int_{-L}^{L} f(x)e^{-ik_nx}\,dx$，$k_n = n\pi/L$ | $[f]$ |
| $\hat f(k) = \mathcal{F}[f](k)$ | $\displaystyle\int_{-\infty}^{\infty} f(x)\,e^{-ikx}\,dx$ | $[f]\cdot[x]$ |
| $\mathcal{F}^{-1}[\hat f](x)$ | $\displaystyle\frac{1}{2\pi}\int_{-\infty}^{\infty}\hat f(k)\,e^{ikx}\,dk$ | $[f]$ |
| $(f*g)(x)$ | 卷积 $\displaystyle\int f(y)g(x-y)\,dy$ | $[f][g][x]$ |
| $X_m$（DFT） | $\displaystyle X_m = \sum_{n=0}^{N-1}x_n\,e^{-2\pi i mn/N}$，逆变换 $x_n = \frac1N\sum_m X_m e^{2\pi imn/N}$ | $[x_n]$ |
| $k_{\mathrm{Ny}}$ | Nyquist 波数 $\pi/\Delta x$（等价地 Nyquist 频率 $f_s/2$） | $1/[x]$ |

**换算**：若用普通频率 $\xi = k/2\pi$（MRI、信号处理常用），则 $\hat f(\xi) = \int f e^{-2\pi i\xi x}dx$，逆变换无 $1/2\pi$ 因子。所有结论相同，只是 $2\pi$ 的位置不同。多维时 $kx \to \mathbf{k}\cdot\mathbf{x}$，逆变换因子为 $(2\pi)^{-d}$。

---

## 4. Governing Principles | 基本原理

1. **正交性**：$\langle e^{ik_mx}, e^{ik_nx}\rangle_L = 2L\,\delta_{mn}$。证明：$m\ne n$ 时 $\int_{-L}^{L}e^{i(m-n)\pi x/L}dx = \frac{2L\sin((m-n)\pi)}{(m-n)\pi} = 0$；$m=n$ 时被积函数为 1。
2. **正交投影 = 最佳逼近**（`MATH-LA-01`、linear_least_squares §5.2）：在正交基下，最小二乘系数就是逐个投影系数，无需求解正规方程。
3. **完备性**：$\{e^{ik_nx}\}_{n\in\mathbb{Z}}$ 在 $L^2[-L,L]$ 中完备（Stein & Shakarchi Ch. 3），即部分和在 $L^2$ 意义下收敛于 $f$。
4. **平移不变算子的本征函数**：若 $\mathcal{T}$ 线性且与平移 $\tau_a f(x) = f(x-a)$ 交换，则 $\mathcal{T}e^{ikx} = H(k)e^{ikx}$（传递函数 $H$）。

---

## 5. Mathematical Derivation | 数学推导

### 5.1 Fourier 级数：$L^2[-L,L]$ 中的最佳逼近

令 $S_N f := \sum_{|n|\le N} a_n e^{ik_nx}$，选系数使 $\lVert f - S_Nf\rVert_L^2$ 最小。

**Step 1（正规方程退化为投影）** 设计"矩阵"的列 $e^{ik_nx}$ 两两正交 [原理 1]，Gram 矩阵 $= 2L\,I$，正规方程给出
$$
a_n = \frac{\langle f, e^{ik_nx}\rangle_L}{\langle e^{ik_nx}, e^{ik_nx}\rangle_L} = \frac{1}{2L}\int_{-L}^{L}f(x)e^{-ik_nx}dx = c_n .
$$

**Step 2（Bessel 不等式与 Parseval）** 由 Pythagoras，$\lVert f\rVert^2 = \lVert S_Nf\rVert^2 + \lVert f - S_Nf\rVert^2 \ge 2L\sum_{|n|\le N}|c_n|^2$。由完备性 [原理 3]，$N\to\infty$ 时误差项 $\to 0$：
$$
\boxed{\ \frac{1}{2L}\int_{-L}^{L}|f|^2dx = \sum_{n=-\infty}^{\infty}|c_n|^2\ }\qquad\text{（Parseval 恒等式，级数形式）}
$$

### 5.2 从级数到积分：$L \to \infty$

**Step 1** 定义截断变换 $F_L(k) := \int_{-L}^{L}f(x)e^{-ikx}dx$，则 $c_n = F_L(k_n)/(2L)$。

**Step 2** 网格间距 $\Delta k = k_{n+1}-k_n = \pi/L$，即 $\frac{1}{2L} = \frac{\Delta k}{2\pi}$。于是在 $[-L,L]$ 上
$$
f(x) = \sum_{n}\frac{F_L(k_n)}{2L}e^{ik_nx} = \frac{1}{2\pi}\sum_n F_L(k_n)\,e^{ik_nx}\,\Delta k .
$$

**Step 3** 令 $L\to\infty$：$F_L \to \hat f$（$f\in L^1$ 时逐点成立），Riemann 和 $\to$ 积分：
$$
\boxed{\ f(x) = \frac{1}{2\pi}\int_{-\infty}^{\infty}\hat f(k)\,e^{ikx}\,dk,\qquad \hat f(k) = \int_{-\infty}^{\infty}f(x)e^{-ikx}dx\ }
$$
这一步是**形式**的（交换极限与求和）；严格证明见 Stein & Shakarchi Ch. 5（先对 Schwartz 函数用 Gauss 核逼近恒等证明反演公式，再延拓到 $L^2$）。

**物理含义**：离散谱线 $k_n$ 随 $L\to\infty$ 变得稠密；孤立脉冲需要**连续谱**表示。

### 5.3 Plancherel 定理（连续能量守恒）

对 5.1 的 Parseval 两边乘 $2L$，并用 $|c_n|^2 (2L) = |F_L(k_n)|^2\,\Delta k/(2\pi)$：
$$
\int_{-L}^{L}|f|^2dx = \frac{1}{2\pi}\sum_n |F_L(k_n)|^2\Delta k \;\xrightarrow{L\to\infty}\; \boxed{\ \int_{-\infty}^{\infty}|f(x)|^2dx = \frac{1}{2\pi}\int_{-\infty}^{\infty}|\hat f(k)|^2dk\ }
$$
更一般地 $\langle f,g\rangle = \frac{1}{2\pi}\langle\hat f,\hat g\rangle$：**$\mathcal{F}/\sqrt{2\pi}$ 是 $L^2(\mathbb{R})$ 上的酉算子**。物理上：信号总能量在时域与频域中计算结果相同；$|\hat f(k)|^2/2\pi$ 是能量谱密度。

### 5.4 微分定理

设 $f, f' \in L^1$ 且 $f(x)\to 0$（$|x|\to\infty$）。分部积分：
$$
\widehat{f'}(k) = \int f'(x)e^{-ikx}dx = \Big[f e^{-ikx}\Big]_{-\infty}^{\infty} + ik\int f e^{-ikx}dx = ik\,\hat f(k).
$$
归纳得 $\widehat{f^{(m)}} = (ik)^m\hat f$；多维 $\widehat{\nabla f} = i\mathbf{k}\hat f$，$\widehat{\nabla^2 f} = -|\mathbf{k}|^2\hat f$。

**推论（光滑性 ⟺ 衰减）**：若 $f^{(m)}\in L^1$，则 $|k|^m|\hat f(k)| \le \lVert f^{(m)}\rVert_1$，即 $\hat f = O(|k|^{-m})$。光滑函数的高频分量快速衰减——这是谱方法指数收敛（§9）的根源。

**对偶**：$\widehat{xf}(k) = i\,\hat f'(k)$（对 $\hat f$ 的定义式关于 $k$ 求导即得）。

### 5.5 卷积定理

对 $f,g\in L^1$，由 Fubini 定理交换积分次序，令 $z = x - y$：
$$
\widehat{f*g}(k) = \iint f(y)g(x-y)e^{-ikx}\,dy\,dx = \int f(y)e^{-iky}dy\int g(z)e^{-ikz}dz = \boxed{\hat f(k)\,\hat g(k)}
$$
**含义**：任何线性平移不变系统 $y = h*u$（$h$ 为脉冲响应）在频域中是逐点乘法 $\hat y = H\hat u$，$H = \hat h$ 即传递函数 [原理 4]。对偶地，$\widehat{fg} = \frac{1}{2\pi}\hat f*\hat g$（加窗 ⟹ 频谱被窗的变换"抹开"，即泄漏）。

### 5.6 关键变换对：Gauss 函数与不确定性原理

**Gauss**：$f = e^{-ax^2}$（$a>0$）。由 §5.4 对偶公式，$f' = -2axf$ 变换为 $ik\hat f = -2a\cdot i\hat f'$，即 $\hat f' = -\frac{k}{2a}\hat f$，解得 $\hat f(k) = \hat f(0)e^{-k^2/4a}$，$\hat f(0) = \int e^{-ax^2}dx = \sqrt{\pi/a}$：
$$
\mathcal{F}\big[e^{-ax^2}\big] = \sqrt{\pi/a}\;e^{-k^2/(4a)} .
$$
宽度 $\propto a^{-1/2}$ 的函数对应宽度 $\propto a^{1/2}$ 的谱：**越窄的脉冲需要越宽的带宽**。

**Heisenberg–Gabor 不等式**：对 $\lVert f\rVert_2 = 1$，定义 $\Delta x^2 = \int x^2|f|^2dx$，$\Delta k^2 = \frac{1}{2\pi}\int k^2|\hat f|^2dk$。由 Cauchy–Schwarz 与 $\int x\,(|f|^2)'dx = -1$（分部积分）：
$$
1 = \Big|\int x\,2\operatorname{Re}(\bar f f')\,dx\Big| \le 2\lVert xf\rVert\,\lVert f'\rVert = 2\,\Delta x\,\Delta k \;\Longrightarrow\; \Delta x\,\Delta k \ge \tfrac12 ,
$$
其中 $\lVert f'\rVert^2 = \frac{1}{2\pi}\int k^2|\hat f|^2 = \Delta k^2$ 用到了 Plancherel 与微分定理。等号当且仅当 $f$ 为 Gauss 函数。

### 5.7 采样、Poisson 求和与混叠

以间隔 $\Delta x$ 采样 $f_n = f(n\Delta x)$，定义离散时间 Fourier 变换 $F_s(k) := \Delta x\sum_n f_n e^{-ikn\Delta x}$。

**Poisson 求和公式**（Stein & Shakarchi Ch. 5 §3）：$\sum_n g(n\Delta x) = \frac{1}{\Delta x}\sum_j \hat g\!\left(\frac{2\pi j}{\Delta x}\right)$。取 $g(x) = f(x)e^{-ikx}$，$\hat g(q) = \hat f(q+k)$：
$$
\boxed{\ F_s(k) = \sum_{j=-\infty}^{\infty}\hat f\!\left(k + \frac{2\pi j}{\Delta x}\right)\ }
$$
采样谱是原谱以 $k_s = 2\pi/\Delta x$ 为周期的**周期叠加**。

- 若 $\hat f(k) = 0$ 对 $|k| \ge k_{\mathrm{Ny}} = \pi/\Delta x$（带限），各副本不重叠，$F_s = \hat f$ 于 $|k|<k_{\mathrm{Ny}}$，$f$ 可由 sinc 插值精确重建（Shannon–Nyquist 采样定理）。
- 否则波数 $k$ 与 $k \pm 2\pi/\Delta x$ 在采样点上**完全相同**：$e^{i(k+2\pi/\Delta x)n\Delta x} = e^{ikn\Delta x}$。高频被"折叠"为低频——**混叠**。例：9 Hz 余弦以 $f_s = 8$ Hz 采样，与 1 Hz 余弦的采样值逐点相等。

### 5.8 DFT 与 FFT

**DFT 是周期采样的 Fourier 级数**：$N$ 个点 $x_n$ 视为一个周期的采样，$X_m$ 正是 §5.1 系数的梯形公式近似（乘 $N$）。离散正交性 $\sum_{n=0}^{N-1}e^{2\pi i(m-m')n/N} = N\delta_{mm'}$（等比级数），给出逆变换与离散 Parseval $\sum|x_n|^2 = \frac1N\sum|X_m|^2$。

**FFT（Cooley–Tukey, radix-2）**：设 $N = 2M$，$\omega_N = e^{-2\pi i/N}$。按偶/奇下标拆分：
$$
X_m = \underbrace{\sum_{r=0}^{M-1}x_{2r}\,\omega_M^{rm}}_{E_m} + \omega_N^{m}\underbrace{\sum_{r=0}^{M-1}x_{2r+1}\,\omega_M^{rm}}_{O_m},\qquad
X_{m+M} = E_m - \omega_N^{m}O_m ,
$$
（用到 $\omega_N^2 = \omega_M$ 与 $\omega_N^{M} = -1$，且 $E,O$ 以 $M$ 为周期）。两个长度 $M$ 的 DFT 加 $O(N)$ 次"蝶形"运算：$T(N) = 2T(N/2) + O(N) \Rightarrow T(N) = O(N\log_2N)$，而直接求和为 $O(N^2)$。

---

## 6. Existence, Convergence & Boundary Effects | 存在性、收敛性与边界效应

Fourier 变换本身无边界/初始条件；本节给出**变换存在的条件**及**有限区间/周期延拓带来的"边界"效应**。

| 情形 | 结论 |
|---|---|
| $f\in L^1(\mathbb{R})$ | $\hat f$ 存在、有界（$\lvert\hat f\rvert\le\lVert f\rVert_1$）、连续，且 $\hat f(k)\to0$（Riemann–Lebesgue 引理） |
| $f\in L^2(\mathbb{R})$ | $\hat f$ 由 $L^1\cap L^2$ 稠密延拓定义（Plancherel），反演在 $L^2$ 意义下成立，不保证逐点 |
| $f$ 分段光滑（Dirichlet 条件） | 级数/积分在连续点收敛于 $f(x)$，在跳跃点收敛于 $\tfrac12[f(x^+)+f(x^-)]$ |
| 跳跃间断（含周期延拓的端点不连续） | 系数 $c_n = O(1/n)$；部分和在跳跃附近过冲约 **9%** 的跳跃高度且不随 $N$ 消失（Gibbs 现象）；$L^2$ 误差仍 $\to 0$ |
| $f\in C^{m-1}$ 周期，$f^{(m)}$ 分段连续 | $c_n = O(n^{-m-1})$ |
| 周期解析函数 | $c_n$ 指数衰减 ⟹ 谱方法指数收敛 |
| 广义函数 | $\hat\delta = 1$，$\hat1 = 2\pi\delta$，$\widehat{e^{ik_0x}} = 2\pi\delta(k-k_0)$ |

**DFT 的隐含边界条件**：DFT 总是把数据视作**周期**的。若 $x_0 \ne x_{N}$（延拓后不连续），能量泄漏到所有频率；对策是加窗（Hann 等）、补零或选择匹配的正弦/余弦变换（对应 Dirichlet/Neumann 边界，见 [`heat_equation.md`](heat_equation.md) §6）。

---

## 7. Dimensional Analysis | 量纲分析

- $[k] = [x]^{-1}$（rad/m 或 rad/s），所以 $kx$ 无量纲，指数函数有意义。
- $[\hat f] = [f][x]$：例如电压信号 $f$ 以 V 计，则 $\hat f$ 以 V·s = V/Hz 计——即**谱密度**，不是幅值。
- Plancherel 两边：$[f]^2[x]$ 与 $[\hat f]^2[k] = [f]^2[x]^2[x]^{-1}$ 一致 ✓。
- 微分定理：$[\widehat{f'}] = [f][x]^{-1}[x] = [f]$，$[ik\hat f] = [x]^{-1}[f][x] = [f]$ ✓。
- 不确定性 $\Delta x\Delta k \ge 1/2$ 无量纲 ✓；乘以 $\hbar$ 得 $\Delta x\Delta p\ge\hbar/2$（$p = \hbar k$）。
- 采样：$k_{\mathrm{Ny}} = \pi/\Delta x$；用频率表示 $f_{\mathrm{Ny}} = f_s/2$。频率分辨率 $\Delta f = 1/(N\Delta t) = 1/T_{\text{window}}$。
- DFT 的 $X_m$ 与 $x_n$ 同量纲；近似连续变换需乘 $\Delta x$：$\hat f(k_m) \approx \Delta x\,X_m$。

---

## 8. Limiting Cases | 极限情形验证

| 极限情形 | 预期 | 验证 |
|---|---|---|
| $L\to\infty$ | 级数 → 积分 | §5.2 ✓ |
| $f = \delta(x)$ | 平坦谱，所有频率等幅 | $\hat\delta(k) = e^{0} = 1$ ✓ |
| $a\to0^+$（Gauss 变宽 → 常数） | $\hat f \to 2\pi\delta(k)$ | $\sqrt{\pi/a}\,e^{-k^2/4a}$ 积分恒为 $2\pi$ 且宽度 $\to0$ ✓ |
| $a = 1/2$ | Gauss 是 $\mathcal{F}$ 的本征函数（差常数） | $\mathcal{F}[e^{-x^2/2}] = \sqrt{2\pi}e^{-k^2/2}$ ✓ |
| $\mathcal{F}^4$ | $\mathcal{F}^2f(x) = 2\pi f(-x)$，故 $\mathcal{F}^4 = (2\pi)^2 I$ | 直接由反演公式 ✓ |
| 带限信号，$\Delta x < \pi/k_{\max}$ | 无混叠，精确重建 | §5.7 副本不重叠 ✓ |
| $N\to\infty$，$\Delta x\to0$，$N\Delta x\to\infty$ | $\Delta x\,X_m \to \hat f(k_m)$ | 梯形公式 → 积分 ✓ |
| 卷积与 $\delta$ | $f*\delta = f$ | $\hat f\cdot1 = \hat f$ ✓ |

---

## 9. Numerical Implementation | 数值实现

### 9.1 要点

- **频率排序**：`numpy.fft.fft` 输出顺序为 $m = 0,1,\dots,N/2-1,-N/2,\dots,-1$；用 `np.fft.fftfreq(N, d=dx)` 得到普通频率，乘 $2\pi$ 得角波数。
- **谱微分**：$f' = \mathcal{F}^{-1}[ik\hat f]$。对偶数 $N$，Nyquist 模 $k_{N/2}$ 的奇数阶导数应置零（该模在实信号中不对称）。
- **收敛性**：对周期解析函数，谱微分误差随 $N$ **指数下降**，二阶中心差分仅 $O(N^{-2})$。
- **谱方法求解 PDE**：线性常系数 PDE 在 Fourier 空间解耦为 ODE，例如热方程 $\hat u_t = -\alpha k^2\hat u$（见 [`heat_equation.md`](heat_equation.md) §5.5）；非线性项用伪谱法（物理空间相乘，2/3 规则去混叠）。
- **代价**：FFTW/MKL 对任意 $N$ 都是 $O(N\log N)$，但 $N$ 为小素数之积时最快。

### 9.2 参考实现（NumPy）

```python
import numpy as np

# (1) 谱微分：f(x) = exp(sin x) 在 [0, 2pi) 上周期解析
for N in (8, 16, 32, 64):
    L = 2 * np.pi
    x = np.arange(N) * L / N
    k = 2 * np.pi * np.fft.fftfreq(N, d=L / N)   # 角波数
    k[N // 2] = 0.0                               # 奇数阶导数：Nyquist 模置零
    f = np.exp(np.sin(x))
    df = np.real(np.fft.ifft(1j * k * np.fft.fft(f)))
    print(f"N={N:3d}  max error = {np.max(np.abs(df - np.cos(x) * f)):.2e}")

# (2) 离散 Parseval：sum|x|^2 == sum|X|^2 / N
rng = np.random.default_rng(0)
s = rng.standard_normal(1000)
S = np.fft.fft(s)
print("Parseval rel. diff:", abs(s @ s - np.sum(abs(S) ** 2) / s.size) / (s @ s))

# (3) 混叠：9 Hz 余弦以 8 Hz 采样，与 1 Hz 余弦逐点相等
t = np.arange(16) / 8.0
print("alias diff:", np.max(np.abs(np.cos(2 * np.pi * 9 * t) - np.cos(2 * np.pi * t))))
```

预期现象：(1) 误差从 $N=8$ 到 $N=32$ 下降约十个数量级以上并在 $N\approx 32$–$64$ 处触及机器精度（$\sim10^{-14}$）；(2)(3) 差值在 $10^{-15}$ 量级。[NEEDS VERIFICATION: 具体数值需运行确认]

### 9.3 关联实验（计划中）

- `05_experiments/fourier_analysis/spectral_vs_fd_derivative/`：谱微分 vs. 二阶/四阶有限差分的收敛阶对比（半对数图上的直线 vs. 双对数图上的直线）。（目录尚未创建）
- `05_experiments/fourier_analysis/aliasing_gibbs/`：混叠与 Gibbs 过冲（约 9%）的数值测量。（目录尚未创建）

---

## 10. Engineering Applications | 工程应用

| 领域 | 具体问题 | Fourier 的角色 | 最先失效的假设 |
|---|---|---|---|
| **3 · PDE 求解 / HPC** | 周期域上的湍流 DNS、相场模型、Poisson 求解 | 谱方法把 $\nabla^2$ 对角化为 $-\lvert\mathbf{k}\rvert^2$；大规模 3D FFT 需全局转置（all-to-all），是通信瓶颈 | A2（复杂几何、非周期边界） |
| **7 · 医学成像：MRI** | k 空间采样与重建 | 梯度场 $\mathbf G$ 下信号 $s(t) = \int\rho(\mathbf r)e^{-i2\pi\mathbf k(t)\cdot\mathbf r}d\mathbf r$，$\mathbf k(t) = \frac{\gamma}{2\pi}\int_0^t\mathbf G\,dt'$；图像 = 逆 FFT。视野 FOV $= 1/\Delta k$，采样不足 ⟹ 图像折叠（混叠，§5.7）；分辨率 $= 1/(2k_{\max})$ | A5（非笛卡尔轨迹需 NUFFT；欠采样需压缩感知） |
| **7 · 医学成像：CT** | 滤波反投影（FBP） | **中心切片定理**：投影 $p_\theta(s)$ 的 1D 变换 = 物体 2D 变换沿角度 $\theta$ 直线的取值；FBP 中斜坡滤波 $\lvert k\rvert$ 来自极坐标 Jacobian | 有限角度采样（极坐标网格外的高频稀疏） |
| **EM · 光学** | 波包传播、色散、Fourier 光学、光刻成像 | 波包 = 平面波的 Fourier 叠加，群速度 $v_g = d\omega/dk$；透镜后焦面场 ∝ 物面场的 2D Fourier 变换；光刻投影系统是截止频率 $NA/\lambda$ 的低通滤波器 ⟹ 最小半节距 $\approx k_1\lambda/NA$ | A1（高强度非线性光学）；矢量效应（高 NA） |
| **5 · 晶体与材料** | 倒格子、X 射线衍射、平面波 DFT | 晶格周期函数 $n(\mathbf r) = \sum_{\mathbf G}n_{\mathbf G}e^{i\mathbf G\cdot\mathbf r}$，倒格矢满足 $\mathbf a_i\cdot\mathbf b_j = 2\pi\delta_{ij}$；Laue 条件 $\Delta\mathbf k = \mathbf G$；Bloch 定理与布里渊区是 §5.7"周期性 ⟺ 离散/周期谱"的直接推论 | 缺陷、非晶、表面（破坏周期性） |
| **1 · AI 与数据科学** | Fourier 神经算子（FNO）、CNN 加速 | 卷积定理：大卷积核用 FFT 计算；FNO 在截断的 Fourier 模上学习乘子 $R(\mathbf k)$ | 非周期数据需补零/加窗 |
| **3 · 机器人与控制** | 频域设计、振动分析 | Bode 图即传递函数 $H(i\omega)$；加速度计信号的 FFT 识别共振峰 | A2（时变系统需短时 Fourier / 小波） |

---

## 11. References | 参考资料

1. E. M. Stein & R. Shakarchi, *Fourier Analysis: An Introduction*, Princeton Univ. Press, 2003. Ch. 2（Fourier 级数基本性质）、Ch. 3（$L^2$ 收敛）、**Ch. 5（$\mathbb{R}$ 上的 Fourier 变换，Poisson 求和，Heisenberg 不等式）**、Ch. 7（有限 Fourier 分析与 FFT）。 [NEEDS VERIFICATION: 章号凭记忆]
2. R. N. Bracewell, *The Fourier Transform and Its Applications*, 3rd ed., McGraw-Hill, 2000.（工程视角、采样与变换对表）
3. L. N. Trefethen, *Spectral Methods in MATLAB*, SIAM, 2000. Ch. 1–4（谱微分与收敛率）。
4. J. W. Cooley & J. W. Tukey, "An Algorithm for the Machine Calculation of Complex Fourier Series," *Math. Comp.* 19(90):297–301, 1965.
5. G. B. Folland, *Fourier Analysis and Its Applications*, AMS, 1992.（分布意义下的变换，PDE 应用）
6. N. W. Ashcroft & N. D. Mermin, *Solid State Physics*, 1976. Ch. 5（倒格子）、Ch. 6（X 射线衍射）。
7. A. C. Kak & M. Slaney, *Principles of Computerized Tomographic Imaging*, IEEE Press, 1988 (SIAM reprint 2001). Ch. 3（中心切片定理、滤波反投影）。
8. D. G. Nishimura, *Principles of Magnetic Resonance Imaging*, Stanford, 2010.（k 空间形式化）
9. J. W. Goodman, *Introduction to Fourier Optics*, 3rd ed., 2005.（透镜的 Fourier 变换性质、相干成像传递函数）

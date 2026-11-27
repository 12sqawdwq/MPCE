# Fundamental Theorem of Calculus & Integration Techniques | 微积分基本定理与积分技巧

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识（一元微积分），无独立节点；为 `MATH-VC-02`、`MATH-FA-04`、`MATH-VAR-01`、`COMP-07`、`COMP-08` 的共同基础 |
| Phase | 进入 Phase I 之前的前置补习（Stewart Ch. 5–7 水平） |
| Prerequisites | 极限与连续；导数（链式法则、乘积法则）；拉格朗日中值定理 |
| Primary References | Stewart, *Calculus*, Ch. 5–7；Spivak, *Calculus*, Ch. 13–14, 19 |

---

## 1. 核心思想

- **定积分**是黎曼和的极限，表示"累积量"（有向面积）。
- **微积分基本定理**说明求导与积分互为逆运算：区域内部导数的积分等于边界上的函数值（带方向）。
- **积分技巧**都是把求导法则倒过来用：
  - 换元法来自链式法则；
  - 分部积分来自乘积法则；
  - 部分分式来自代数分解。
- **高维推广**：梯度定理、格林定理、斯托克斯定理和散度定理，统一写成

$$
\int_\Omega \mathrm{d}\omega=\int_{\partial\Omega}\omega
$$

## 2. 推导（每步写依据）

### 2.1 定积分的定义（黎曼和）

1. **分割**：取 $a=x_0<x_1<\cdots<x_n=b$，记 $\Delta x_i=x_i-x_{i-1}$，网格宽度 $\lVert P\rVert=\max_i\Delta x_i$。
2. **取样点**：在每个小区间里任取 $\xi_i\in[x_{i-1},x_i]$。
3. **作黎曼和**：

$$
S(P,\xi)=\sum_{i=1}^n f(\xi_i)\,\Delta x_i
$$

4. **取极限**：如果 $\lVert P\rVert\to0$ 时 $S$ 收敛到同一个数 $I$，且与分割方式、取点方式都无关，就记 $\int_a^b f(x)\,\mathrm{d}x=I$。

- **依据**：闭区间上的连续函数一定可积。
- **由定义直接得到的性质**：
  - 线性；
  - 区间可加，并约定 $\int_b^a f=-\int_a^b f$；
  - 保序：若 $m\le f\le M$，则 $m(b-a)\le\int_a^b f\le M(b-a)$。

### 2.2 积分中值定理

若 $f$ 在 $[a,b]$ 上连续，则存在 $\xi\in[a,b]$，使得

$$
\int_a^b f(x)\,\mathrm{d}x=f(\xi)(b-a)
$$

**证明**：

1. 由**最值定理**，$f$ 能取到最小值 $m$ 和最大值 $M$。
2. 由**保序性**，$\mu=\frac{1}{b-a}\int_a^b f\in[m,M]$。
3. 由**介值定理**，存在 $\xi$ 使 $f(\xi)=\mu$。∎

### 2.3 第一基本定理

设 $f$ 在 $[a,b]$ 上连续，$F(x)=\int_a^x f(t)\,\mathrm{d}t$，则 $F'(x)=f(x)$。

**直觉**：把 $x$ 向右推一点 $h$，新增面积约等于 $f(x)\,h$。

**证明**：

1. 由**区间可加性**：$F(x+h)-F(x)=\int_x^{x+h}f(t)\,\mathrm{d}t$。
2. 由**积分中值定理**：上式等于 $f(\xi_h)\,h$，其中 $\xi_h$ 介于 $x$ 与 $x+h$ 之间。$h<0$ 时结论相同。
3. 由 $\lvert\xi_h-x\rvert\le\lvert h\rvert$ 得 $\xi_h\to x$；再由 $f$ 的**连续性**得 $f(\xi_h)\to f(x)$。
4. 因此

$$
F'(x)=\lim_{h\to0}\frac{F(x+h)-F(x)}{h}=f(x)
$$

端点处取单侧导数即可。∎

**补充**：

- 变上限为函数时，由链式法则：$\frac{\mathrm{d}}{\mathrm{d}x}\int_a^{g(x)}f(t)\,\mathrm{d}t=f(g(x))\,g'(x)$。
- 连续性不能去掉。例如 $f=\operatorname{sgn}t$ 时 $F(x)=\lvert x\rvert$，在 $0$ 处不可导。

### 2.4 第二基本定理（牛顿–莱布尼茨公式）

若 $f$ 连续，$G'=f$，则

$$
\int_a^b f(x)\,\mathrm{d}x=G(b)-G(a)
$$

**证明**：

1. 由第一基本定理，$F(x)=\int_a^x f$ 也是 $f$ 的原函数。
2. $(G-F)'=0$。由**拉格朗日中值定理的推论**（导数恒为零的函数在区间上是常数），$G=F+C$。
3. 代入 $x=a$：$F(a)=0$，所以 $C=G(a)$。
4. 代入 $x=b$：$\int_a^b f=F(b)=G(b)-G(a)$。∎

特别地，若 $f'$ 连续，则 $\int_a^b f'(x)\,\mathrm{d}x=f(b)-f(a)$。

### 2.5 高维推广

| 定理 | 区域 | 边界 | 公式 |
|---|---|---|---|
| 牛顿–莱布尼茨 | 区间 | 两个端点 | $\int_a^b f'\,\mathrm{d}x=f(b)-f(a)$ |
| 梯度定理 | 曲线 $C$ | 起点 $A$、终点 $B$ | $\int_C\nabla\varphi\cdot\mathrm{d}\mathbf r=\varphi(B)-\varphi(A)$ |
| 格林定理 | 平面区域 $D$ | 闭曲线 | $\iint_D(Q_x-P_y)\,\mathrm{d}A=\oint_{\partial D}P\,\mathrm{d}x+Q\,\mathrm{d}y$ |
| 斯托克斯定理 | 曲面 $S$ | 边界曲线 | $\iint_S(\nabla\times\mathbf F)\cdot\mathrm{d}\mathbf S=\oint_{\partial S}\mathbf F\cdot\mathrm{d}\mathbf r$ |
| 散度定理 | 立体 $V$ | 闭曲面 | $\iiint_V\nabla\cdot\mathbf F\,\mathrm{d}V=\iint_{\partial V}\mathbf F\cdot\mathbf n\,\mathrm{d}S$ |

### 2.6 积分技巧的推导

**第一类换元（凑微分）**

依据是链式法则 $\frac{\mathrm{d}}{\mathrm{d}x}F(g(x))=f(g(x))\,g'(x)$，其中 $F'=f$。倒过来用：

$$
\int f(g(x))\,g'(x)\,\mathrm{d}x=\int f(u)\,\mathrm{d}u\Big|_{u=g(x)}
$$

**第二类换元**

令 $x=\varphi(t)$，其中 $\varphi$ 单调可导：

$$
\int f(x)\,\mathrm{d}x=\int f(\varphi(t))\,\varphi'(t)\,\mathrm{d}t\Big|_{t=\varphi^{-1}(x)}
$$

**分部积分**

依据是乘积法则 $(uv)'=u'v+uv'$。两边积分再移项：

$$
\int u\,\mathrm{d}v=uv-\int v\,\mathrm{d}u,\qquad \int_a^b uv'\,\mathrm{d}x=\big[uv\big]_a^b-\int_a^b u'v\,\mathrm{d}x
$$

可以理解为：把导数从一个因子挪到另一个因子上，代价是一个边界项和一个负号。

**部分分式**

依据是多项式的因式分解。步骤：

1. 若分子次数不低于分母次数，先做多项式除法；
2. 把分母分解成一次因式和不可约二次因式；
3. 按因式拆分：
   - $(x-a)$ 对应 $\frac{A}{x-a}$；
   - $(x-a)^k$ 对应 $\frac{A_1}{x-a}+\cdots+\frac{A_k}{(x-a)^k}$；
   - $x^2+px+q$ 对应 $\frac{Bx+C}{x^2+px+q}$。

## 3. 关键结论

- $\frac{\mathrm{d}}{\mathrm{d}x}\int_a^x f=f(x)$；$\int_a^b f'=f(b)-f(a)$。
- 定积分换元时，上下限要同时换。
- 三角代换与根式代换：
  - $\sqrt{a^2-x^2}$：用 $x=a\sin t$；
  - $\sqrt{a^2+x^2}$：用 $x=a\tan t$；
  - $\sqrt{x^2-a^2}$：用 $x=a\sec t$；
  - $\sqrt[n]{ax+b}$：令 $t=\sqrt[n]{ax+b}$，化为有理函数。
- 选 $u$ 的口诀 LIATE，越靠前越优先作 $u$：对数、反三角、多项式、三角、指数。剩下的部分作 $\mathrm{d}v$。
- 循环型积分：两次分部积分的选法要一致，然后解方程。例如

$$
\int e^x\sin x\,\mathrm{d}x=\frac{e^x(\sin x-\cos x)}{2}+C
$$

### 例题

| 积分 | 方法 | 结果 |
|---|---|---|
| $\int xe^{x^2}\,\mathrm{d}x$ | 凑微分，$u=x^2$ | $\frac12e^{x^2}+C$ |
| $\int\tan x\,\mathrm{d}x$ | 凑微分，$u=\cos x$ | $-\ln\lvert\cos x\rvert+C$ |
| $\int_0^{\pi/2}\sin^3x\cos x\,\mathrm{d}x$ | 凑微分并换限 | $\frac14$ |
| $\int_0^a\sqrt{a^2-x^2}\,\mathrm{d}x$ | $x=a\sin t$ | $\frac{\pi a^2}{4}$ |
| $\int\frac{\mathrm{d}x}{1+\sqrt x}$ | $t=\sqrt x$ | $2\sqrt x-2\ln(1+\sqrt x)+C$ |
| $\int xe^x\,\mathrm{d}x$ | 分部积分 | $(x-1)e^x+C$ |
| $\int\ln x\,\mathrm{d}x$ | 分部积分 | $x\ln x-x+C$ |
| $\int x^2\sin x\,\mathrm{d}x$ | 两次分部积分 | $-x^2\cos x+2x\sin x+2\cos x+C$ |
| $\int\frac{\mathrm{d}x}{x^2-1}$ | 部分分式 | $\frac12\ln\left\lvert\frac{x-1}{x+1}\right\rvert+C$ |

## 4. 应用

**散度定理与斯托克斯定理**：守恒律的积分形式，也是有限体积法（FVM）的基础。

**FEM 弱形式**：对 $-u''=f$，乘以检验函数 $v$（满足 $v(0)=v(1)=0$），积分后再分部积分：

$$
\int_0^1u'v'\,\mathrm{d}x=\int_0^1fv\,\mathrm{d}x
$$

- 对 $u$ 的光滑性要求从二阶导数降到一阶导数；
- 边界项自然地给出 Neumann 边界条件；
- 高维情形用格林公式（散度定理）完成同样的步骤。

**Euler–Lagrange 方程**：对 $J[y]=\int L(x,y,y')\,\mathrm{d}x$ 做变分，得到 $\delta J=\int(L_y\eta+L_{y'}\eta')\,\mathrm{d}x$。对第二项分部积分后，由 $\eta$ 的任意性得

$$
L_y-\frac{\mathrm{d}}{\mathrm{d}x}L_{y'}=0
$$

**其他用途**：

- 换元：坐标变换、FEM 参考单元映射（雅可比行列式是 $\varphi'(t)$ 的高维版本）；
- 数值积分：矩形公式、梯形公式、Simpson 公式和高斯求积，本质上都是选取好的黎曼和；
- 部分分式：拉普拉斯逆变换、传递函数；
- 分部积分：$\Gamma(n+1)=n\Gamma(n)$ 的递推、傅里叶系数的衰减估计、伴随算子；泰勒公式积分余项的推导见 [`taylor_formula.md`](taylor_formula.md)。

## 5. 练习

### A. 基础

1. $\int_0^1(3x^2+2x)\,\mathrm{d}x$
2. $\int\cos(3x+1)\,\mathrm{d}x$
3. $\int\frac{2x}{x^2+5}\,\mathrm{d}x$
4. $\frac{\mathrm{d}}{\mathrm{d}x}\int_1^x\sqrt{1+t^3}\,\mathrm{d}t$

### B. 进阶

5. $\frac{\mathrm{d}}{\mathrm{d}x}\int_x^{x^2}e^{-t^2}\,\mathrm{d}t$
6. $\int x\cos x\,\mathrm{d}x$
7. $\int\frac{\mathrm{d}x}{x^2+4x+3}$
8. $\int\frac{\mathrm{d}x}{x^2\sqrt{1+x^2}}$
9. $\int_1^e x\ln x\,\mathrm{d}x$

### C. 提高

10. $\int e^{2x}\cos3x\,\mathrm{d}x$
11. $\int\arctan x\,\mathrm{d}x$
12. $\lim_{x\to0}\frac{\int_0^x\sin t^2\,\mathrm{d}t}{x^3}$
13. 设 $I_n=\int_0^{\pi/2}\sin^nx\,\mathrm{d}x$。用分部积分证明 $I_n=\frac{n-1}{n}I_{n-2}$，并求 $I_4$。
14. 构造一个可积但不连续的 $f$，使 $F(x)=\int_0^xf$ 在某点不可导。
15. 对 $-(k(x)u')'=f$，$x\in(0,1)$，边界条件为 $u(0)=0$、$k(1)u'(1)=g$，推导弱形式，并指出 $g$ 出现在哪一项。

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）

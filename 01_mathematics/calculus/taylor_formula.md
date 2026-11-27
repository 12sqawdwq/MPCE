# Taylor Formula | 泰勒公式

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识（一元微积分），无独立节点；为 `MATH-NA-01`、`MATH-NA-03`、`COMP-05`、`COMP-06`、`COMP-15` 的共同基础 |
| Phase | 进入 Phase I 之前的前置补习（Stewart Ch. 11 水平） |
| Prerequisites | 导数；微积分基本定理；分部积分 |
| Primary References | Stewart, *Calculus*, Ch. 11.10–11.11；Spivak, *Calculus*, Ch. 20；LeVeque, *Finite Difference Methods*, Ch. 1 |

---

## 1. 核心思想

用多项式逼近函数：构造多项式 $P_n$，使它在点 $a$ 处与 $f$ 的函数值以及 1 到 $n$ 阶导数全部相等。匹配的阶数越高，在 $a$ 附近贴合得越紧。

- 只匹配 $f(a)$：水平线。
- 再匹配 $f'(a)$：切线。
- 再匹配 $f''(a)$：抛物线（弯曲程度也对上）。

## 2. 推导一：系数匹配

设 $P_n(x)=\sum_{k=0}^n c_k(x-a)^k$。

$(x-a)^k$ 求 $k$ 次导得到常数 $k!$。更低次的项求导后为 0，更高次的项在 $x=a$ 处为 0。因此要求 $P_n^{(k)}(a)=f^{(k)}(a)$ 时，只剩下一项：

$$
k!\,c_k=f^{(k)}(a)\quad\Rightarrow\quad c_k=\frac{f^{(k)}(a)}{k!}
$$

$$
P_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k
$$

$a=0$ 时称为麦克劳林公式。

## 3. 推导二：反复分部积分（带精确误差）

**第 0 步**（微积分基本定理）：

$$
f(x)=f(a)+\int_a^x f'(t)\,\mathrm{d}t
$$

**第 1 步**：分部积分。取 $u=f'(t)$，$v=-(x-t)$，其中 $x$ 视为常数，$t$ 为积分变量：

$$
\int_a^x f'(t)\,\mathrm{d}t=\Big[-f'(t)(x-t)\Big]_a^x+\int_a^x f''(t)(x-t)\,\mathrm{d}t=f'(a)(x-a)+\int_a^x f''(t)(x-t)\,\mathrm{d}t
$$

**第 2 步**：再分部积分。取 $u=f''(t)$，$v=-\frac{(x-t)^2}{2}$：

$$
\int_a^x f''(t)(x-t)\,\mathrm{d}t=\frac{f''(a)}{2}(x-a)^2+\int_a^x f'''(t)\frac{(x-t)^2}{2}\,\mathrm{d}t
$$

**重复 $n$ 次**，得到下面的精确等式（积分余项）：

$$
f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k+\int_a^x \frac{f^{(n+1)}(t)}{n!}(x-t)^n\,\mathrm{d}t
$$

## 4. 余项

$(x-t)^n$ 在积分区间上不变号，由积分中值定理得到**拉格朗日余项**：

$$
R_n(x)=\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1},\qquad \xi\text{ 介于 }a\text{ 与 }x\text{ 之间}
$$

- **误差上界**：若 $|f^{(n+1)}|\le M$，则 $|R_n|\le\frac{M}{(n+1)!}|x-a|^{n+1}$。
- **步长写法**（数值分析常用）：

$$
f(a+h)=\sum_{k=0}^{n}\frac{h^k}{k!}f^{(k)}(a)+O(h^{n+1})
$$

误差由第一个被舍去的项决定。

## 5. 常用展开（在 x = 0 处）

| 函数 | 展开 | 收敛范围 |
|---|---|---|
| $e^x$ | $1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots$ | 全体实数 |
| $\sin x$ | $x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots$ | 全体实数 |
| $\cos x$ | $1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots$ | 全体实数 |
| $\ln(1+x)$ | $x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots$ | $-1<x\le1$ |
| $(1+x)^\alpha$ | $1+\alpha x+\frac{\alpha(\alpha-1)}{2}x^2+\cdots$ | $\lvert x\rvert<1$ |

几点说明：

- 有限项的泰勒公式（带余项）总是成立。无穷级数则不一定收敛。
- 反例：$e^{-1/x^2}$（在 $x=0$ 处补充定义为 0）在 0 处各阶导数都为 0，函数本身却不恒为 0。它的泰勒级数不收敛到原函数。
- 欧拉公式：在 $e^x$ 的级数中代入 $x=i\theta$，按实部、虚部分组，得到 $e^{i\theta}=\cos\theta+i\sin\theta$。

## 6. 应用

1. **求极限**：例如 $\lim_{x\to0}\frac{x-\sin x}{x^3}=\frac16$。
2. **小量近似**：
   - 小角近似 $\sin\theta\approx\theta$ 把单摆方程化为简谐振动。
   - 在平衡点附近把势能展开到二阶，得到 $M\ddot{q}+Kq=0$。
3. **有限差分**：由 $f(x\pm h)=f\pm hf'+\frac{h^2}{2}f''\pm\frac{h^3}{6}f'''+O(h^4)$ 可得：
   - 前向差分 $\frac{f(x+h)-f(x)}{h}=f'+O(h)$，一阶精度。
   - 中心差分 $\frac{f(x+h)-f(x-h)}{2h}=f'+O(h^2)$，二阶精度。
   - 二阶导差分 $\frac{f(x+h)-2f(x)+f(x-h)}{h^2}=f''+O(h^2)$，即离散拉普拉斯算子，见 [`heat_equation.md`](../differential_equations/heat_equation.md)。
   - 在 log–log 图上画误差对 $h$ 的曲线，斜率就是收敛阶。
4. **ODE**：
   - 欧拉法只保留一阶项，全局误差为 $O(h)$。
   - RK4 让格式与真解的展开一直匹配到 $h^4$，全局误差为 $O(h^4)$。见实验 [`03_numerical_ode_solver`](../../05_experiments/dynamics/03_numerical_ode_solver/README.md)。
5. **牛顿法**：
   - 在 $x_k$ 处做一阶展开并令其为零，得到 $x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}$。
   - 在单根附近二次收敛：$e_{k+1}\approx Ce_k^2$。
6. **多元与优化**：
   - 二阶展开为 $f(\mathbf{x}+\mathbf{h})\approx f+\nabla f^\top\mathbf{h}+\frac12\mathbf{h}^\top H\mathbf{h}$。
   - 梯度下降只用一阶项。
   - 在驻点处，Hessian 的特征值全为正是极小值，有正有负是鞍点。
   - 牛顿步为 $\mathbf{h}=-H^{-1}\nabla f$。
7. **线性化**：控制中的 $\dot{\mathbf{x}}=A\mathbf{x}+B\mathbf{u}$、EKF、半导体小信号模型，都是一阶泰勒展开。

## 7. 一句话总结

泰勒公式用某一点的各阶导数构造多项式，误差由第一个被舍去的项决定。几乎所有数值方法的设计和误差分析都建立在它之上。

## 8. 练习

1. 将 $\frac{1}{1-x}$ 在 0 处展开到 $x^3$，并用它近似 $\frac{1}{0.9}$。
2. 求 $\lim_{x\to0}\frac{e^x-1-x}{x^2}$。
3. 用 $1+x+\frac{x^2}{2}$ 近似 $e^{0.1}$，用拉格朗日余项估计误差上界。
4. 推导 $\frac{-f(x+2h)+4f(x+h)-3f(x)}{2h}$ 是 $f'(x)$ 的几阶近似。

## 9. 我的疑问与补充

（学习中遇到的问题记在这里）

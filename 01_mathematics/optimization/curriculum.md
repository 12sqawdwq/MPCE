# 变分法与最优化 Calculus of Variations & Optimization

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `MATH-VAR-01`（变分法）· `MATH-OPT-01`（凸优化与对偶）· `MATH-OPT-02`（非凸与随机梯度优化） |
| Phase | Phase II（II.7 变分法）；优化部分贯穿至 Phase VI（VI.1–VI.2） |
| Prerequisites | 多元微积分（梯度、Hessian、Lagrange 乘子）；线性代数（正定矩阵、特征值）；分部积分 |
| Primary References | Gelfand & Fomin, *Calculus of Variations*；Boyd & Vandenberghe, *Convex Optimization*；Nocedal & Wright, *Numerical Optimization* 2e |

---

## 1. 定位

"求某个量的最小值"是力学、数值方法、控制和机器学习共同的语言：

- 力学中的最小作用量原理（Lagrange、Hamilton 力学）；
- FEM 中的能量最小化与弱形式；
- 最优控制、MPC；
- DFT 中的能量泛函极小化；
- 神经网络训练（SGD、Adam）。

变分法是先修图中的**五个瓶颈先修之一**。

## 2. 必须掌握的知识点

### 2.1 有限维优化基础

- [ ] 无约束极值：一阶必要条件 $\nabla f=0$，二阶条件（Hessian 正定）
- [ ] 等式约束：Lagrange 乘子法
- [ ] 不等式约束：KKT 条件

### 2.2 变分法 `MATH-VAR-01`

- [ ] 泛函与变分的概念
- [ ] Euler–Lagrange 方程的推导：$\frac{\partial L}{\partial y}-\frac{\mathrm d}{\mathrm dx}\frac{\partial L}{\partial y'}=0$
- [ ] 经典问题：最速降线、悬链线、测地线、最小旋转曲面
- [ ] 不显含自变量时的首次积分（Beltrami 恒等式）
- [ ] 约束变分：等周问题、积分约束的 Lagrange 乘子
- [ ] 多自变量与高阶导数情形
- [ ] 自然边界条件
- [ ] 与物理的联系：Hamilton 原理 $\delta\int L\,\mathrm dt=0$，费马原理
- [ ] Ritz 方法：用有限个基函数近似求泛函极值，这是 FEM 的前身

### 2.3 凸优化 `MATH-OPT-01`

- [ ] 凸集、凸函数及其判别（Hessian 半正定）
- [ ] 凸问题的局部最优即全局最优
- [ ] 线性规划、二次规划、最小二乘
- [ ] Lagrange 对偶、弱对偶与强对偶、Slater 条件
- [ ] 正则化：$\ell_2$（Tikhonov）与 $\ell_1$（稀疏、LASSO）

### 2.4 数值优化算法与非凸优化 `MATH-OPT-02`

- [ ] 梯度下降、步长选择与线搜索（Armijo 条件）
- [ ] 收敛速度与条件数的关系
- [ ] 牛顿法、拟牛顿法（BFGS、L-BFGS）
- [ ] 共轭梯度法
- [ ] 随机梯度下降（SGD）、动量、Adam
- [ ] 非凸问题：鞍点、局部极小、初值依赖

## 3. 学时

约 120 h（变分法 40 h，凸优化 40 h，数值优化 40 h）。

## 4. 验收标准

- 能推导 Euler–Lagrange 方程，并解出最速降线问题。
- 能从 Hamilton 原理推出单摆的运动方程。
- 能写出一个带约束二次规划问题的 KKT 条件和对偶问题。
- 能用 Python 实现梯度下降和牛顿法，并在病态二次函数上比较收敛速度。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| Euler–Lagrange 方程 | Lagrange 力学 `PHYS-CM-02`、最优控制 |
| Ritz 方法、能量泛函 | FEM `COMP-07`、DFT `PHYS-QM-02` |
| KKT、二次规划 | MPC、机器人轨迹优化 `ENG-ROB-02` |
| 正则化 | 反问题 `COMP-11`、医学成像 `ENG-MED-02` |
| SGD、Adam | PINN `COMP-12`、神经算子 `COMP-13` |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）

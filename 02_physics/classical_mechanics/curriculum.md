# 分析力学 Classical Mechanics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `PHYS-CM-01`（牛顿力学）· `PHYS-CM-02`（Lagrange 力学）· `PHYS-CM-03`（Hamilton 力学）· `PHYS-CL-01`（守恒律与 Noether 定理） |
| Phase | Phase III（III.1–III.3，M5–M6） |
| Prerequisites | [大学物理·力学](../university_physics/01_mechanics.md)；变分法 `MATH-VAR-01`；ODE；线性代数（特征值、正交矩阵） |
| Primary References | Taylor, *Classical Mechanics* (2005)；Goldstein, Poole & Safko 3e；Tong, *Classical Dynamics* |

---

## 1. 定位

大学物理用"力"描述运动；分析力学改用"能量"和"变分原理"描述运动。好处是：坐标可以任意选、约束容易处理、守恒律与对称性直接对应，并且为量子力学（Hamilton 形式）、机器人动力学和辛积分器提供了框架。

## 2. 必须掌握的知识点

### 2.1 牛顿力学复习与提高 `PHYS-CM-01`

- [ ] 非惯性系与惯性力；转动参考系中的科里奥利力
- [ ] 有心力问题：等效势、开普勒问题、轨道方程
- [ ] 质点组：质心、动量定理、角动量定理

### 2.2 Lagrange 力学 `PHYS-CM-02`（III.1）

- [ ] 约束、自由度、广义坐标
- [ ] 达朗贝尔原理与虚功原理
- [ ] Hamilton 原理 $\delta\int_{t_1}^{t_2}L\,\mathrm dt=0$，$L=T-V$
- [ ] Lagrange 方程 $\frac{\mathrm d}{\mathrm dt}\frac{\partial L}{\partial\dot q_i}-\frac{\partial L}{\partial q_i}=0$
- [ ] 循环坐标与广义动量守恒
- [ ] 带约束系统的 Lagrange 乘子法

### 2.3 守恒律与对称性 `PHYS-CL-01`

- [ ] Noether 定理：时间平移对称 ⇒ 能量守恒；空间平移 ⇒ 动量守恒；转动 ⇒ 角动量守恒

### 2.4 小振动

- [ ] 平衡点附近的线性化：$M\ddot{\mathbf q}+K\mathbf q=0$
- [ ] 广义特征值问题 $K\mathbf a=\omega^2M\mathbf a$ 与简正坐标

### 2.5 Hamilton 力学 `PHYS-CM-03`（III.2）

- [ ] Legendre 变换，$H=\sum p_i\dot q_i-L$
- [ ] Hamilton 正则方程 $\dot q=\frac{\partial H}{\partial p}$，$\dot p=-\frac{\partial H}{\partial q}$
- [ ] 相空间、相流、刘维尔定理
- [ ] Poisson 括号，与量子对易子的对应
- [ ] 正则变换与辛结构；辛积分器为什么能长期保持能量

### 2.6 刚体动力学（III.3）

- [ ] 旋转矩阵、$SO(3)$、欧拉角
- [ ] 惯性张量、主轴（对称矩阵的特征值问题）
- [ ] 欧拉方程，自由陀螺，进动与章动

### 2.7 非线性动力学

- [ ] 相图、不动点、稳定性
- [ ] 混沌：双摆、对初值的敏感依赖

## 3. 学时

约 100 h。

## 4. 验收标准

- 能用 Lagrange 方法推导双摆、带约束滑块等系统的运动方程。
- 能求多自由度小振动系统的简正频率与简正模。
- 能从 Lagrangian 得到 Hamiltonian 并写出正则方程。
- 能用 Python 比较显式 Euler、RK4 与辛积分器在长时间积分下的能量漂移。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| Lagrange 方程、刚体动力学 | 机器人动力学 $M(q)\ddot q+C\dot q+g=\tau$ `ENG-ROB-02` |
| Hamilton 形式、Poisson 括号 | 量子力学 `PHYS-QM-01`、统计力学 `PHYS-SM-01` |
| 辛结构 | ODE 时间积分器 `COMP-05`、分子动力学 |
| 小振动特征值问题 | 结构模态分析 `ENG-MFG-02` |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）

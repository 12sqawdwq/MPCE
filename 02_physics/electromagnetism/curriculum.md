# 电动力学 Electromagnetism

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | `PHYS-EM-01`（Maxwell 方程组） |
| Phase | Phase III（III.4–III.5，M6–M7） |
| Prerequisites | [大学物理·电磁学](../university_physics/04_electromagnetism.md)；向量微积分（散度定理、斯托克斯定理）；PDE 与分离变量；Green 函数 |
| Primary References | Griffiths, *Introduction to Electrodynamics* 5e；Jackson 3e（选读）；Tong, *Electromagnetism* |

---

## 1. 定位

大学物理以积分形式和对称性问题为主；电动力学改用微分形式，把电磁问题化成 PDE 边值问题。这正是半导体器件仿真（Poisson 方程）、电磁仿真（FDTD）和光学成像的数学模型。

## 2. 必须掌握的知识点

### 2.1 数学工具

- [ ] 梯度、散度、旋度在直角、柱、球坐标中的表达式
- [ ] 散度定理、斯托克斯定理、δ 函数、Helmholtz 定理

### 2.2 静电学（III.4）

- [ ] 微分形式：$\nabla\cdot\mathbf E=\rho/\varepsilon_0$，$\nabla\times\mathbf E=0$
- [ ] 电势与 Poisson 方程 $\nabla^2V=-\rho/\varepsilon_0$、Laplace 方程
- [ ] 边界条件与唯一性定理
- [ ] 镜像法
- [ ] 分离变量法（直角、球坐标，Legendre 多项式）
- [ ] 多极展开
- [ ] 介质中的电场：极化 $\mathbf P$、电位移 $\mathbf D$、$\nabla\cdot(\varepsilon\nabla V)=-\rho_f$

### 2.3 静磁学（III.4）

- [ ] $\nabla\cdot\mathbf B=0$，$\nabla\times\mathbf B=\mu_0\mathbf J$
- [ ] 毕奥–萨伐尔定律、矢势 $\mathbf A$
- [ ] 磁介质：磁化 $\mathbf M$、$\mathbf H$

### 2.4 电动力学与电磁波（III.5）

- [ ] 法拉第定律、位移电流、Maxwell 方程组的完整微分形式
- [ ] 能量守恒：坡印廷定理
- [ ] 动量守恒与 Maxwell 应力张量（了解）
- [ ] 电磁波方程，平面波、偏振
- [ ] 介质中的电磁波：反射、折射、菲涅耳公式
- [ ] 导体中的电磁波：趋肤深度
- [ ] 波导与谐振腔（了解）
- [ ] 标势与矢势、规范变换（库仑规范、洛伦兹规范）
- [ ] 推迟势、偶极辐射

## 3. 学时

约 100 h。

## 4. 验收标准

- 能从积分形式推导 Maxwell 方程组的微分形式。
- 能用分离变量法求解矩形区域内的 Laplace 方程，并用有限差分数值求解作对照、验证收敛。
- 能从 Maxwell 方程组推导电磁波方程和真空光速。
- 能用坡印廷定理解释电磁场的能量流动。

## 5. 与后续内容的衔接

| 本模块内容 | 后续去向 |
|---|---|
| Poisson 方程、边界条件 | 半导体漂移–扩散模型 `PHYS-SS-03`、TCAD `ENG-SEMI-02` |
| Maxwell 方程组时域形式 | FDTD、有限差分 `COMP-06` |
| 守恒律形式 | 有限体积法 `COMP-08` |
| 电磁波、衍射 | 光刻成像、MRI |

## 6. 我的疑问与补充

（学习中遇到的问题记在这里）

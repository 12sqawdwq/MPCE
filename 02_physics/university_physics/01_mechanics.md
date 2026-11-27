# 力学 Mechanics

| 字段 | 内容 |
|---|---|
| Knowledge Graph Node ID | 前置知识，无独立节点；通向 `PHYS-CM-01`、`PHYS-CM-02`、`PHYS-CL-01` |
| Phase | 进入 Phase I 之前的前置补习（大学物理） |
| Prerequisites | 导数与积分；向量点积、叉积 |
| Primary References | Halliday, Resnick & Walker, *Fundamentals of Physics*, Ch. 2–13；MIT 8.01 |

---

## 1. 核心思想

力学研究物体怎样运动、为什么这样运动。全部内容可以归结为三条主线：

- **牛顿定律**：力决定加速度，适合求每一时刻的状态。
- **守恒律**：能量、动量、角动量守恒，适合只关心始末状态的问题。
- **刚体转动**：把平动的规律一一对应地搬到转动上。

## 2. 运动学

- 位置 $\mathbf r(t)$，速度 $\mathbf v=\frac{\mathrm d\mathbf r}{\mathrm dt}$，加速度 $\mathbf a=\frac{\mathrm d\mathbf v}{\mathrm dt}$。
- 匀加速直线运动：$v=v_0+at$，$x=x_0+v_0t+\frac12at^2$，$v^2=v_0^2+2a(x-x_0)$。
  - 依据：对 $a$ 积分一次得 $v$，再积分一次得 $x$。
- 抛体运动：水平方向匀速，竖直方向匀加速，两个方向独立。
- 圆周运动：
  - 角速度 $\omega=\frac{\mathrm d\theta}{\mathrm dt}$，线速度 $v=\omega r$；
  - 向心加速度 $a_n=\frac{v^2}{r}=\omega^2r$，切向加速度 $a_t=\frac{\mathrm dv}{\mathrm dt}$。
- 相对运动：$\mathbf v_{AC}=\mathbf v_{AB}+\mathbf v_{BC}$（伽利略变换）。

## 3. 牛顿定律

1. **第一定律**：不受力的物体保持静止或匀速直线运动。它定义了惯性参考系。
2. **第二定律**：$\mathbf F=m\mathbf a$，更一般地写成 $\mathbf F=\frac{\mathrm d\mathbf p}{\mathrm dt}$。
3. **第三定律**：作用力与反作用力大小相等、方向相反，作用在不同物体上。

常见力：

| 力 | 表达式 | 说明 |
|---|---|---|
| 重力 | $mg$ | 地面附近 |
| 弹簧力 | $F=-kx$ | 胡克定律，线性回复力 |
| 摩擦力 | $f\le\mu_sN$（静），$f=\mu_kN$（动） | 方向与相对运动（趋势）相反 |
| 拉力、支持力 | 由约束决定 | 需要通过方程组求出 |

**解题流程**：选研究对象 → 画受力图 → 建坐标系 → 列分量方程 → 联立求解 → 检查量纲和极限情况。

**非惯性系**：在加速参考系中需要加惯性力 $-m\mathbf a_0$；在转动参考系中还有离心力和科里奥利力 $-2m\boldsymbol\omega\times\mathbf v$。

## 4. 功与能

- 功：$W=\int\mathbf F\cdot\mathrm d\mathbf r$。
- 动能定理：$W_{\text{合}}=\Delta E_k$，其中 $E_k=\frac12mv^2$。
  - 依据：$\mathbf F\cdot\mathrm d\mathbf r=m\frac{\mathrm d\mathbf v}{\mathrm dt}\cdot\mathbf v\,\mathrm dt=\mathrm d\big(\tfrac12mv^2\big)$。
- 保守力：做功与路径无关，可以定义势能，$\mathbf F=-\nabla U$。
  - 重力势能 $mgh$，弹性势能 $\frac12kx^2$，万有引力势能 $-\frac{GMm}{r}$。
- 机械能守恒：只有保守力做功时，$E_k+U$ 不变。
- 功率：$P=\frac{\mathrm dW}{\mathrm dt}=\mathbf F\cdot\mathbf v$。

## 5. 动量

- 动量 $\mathbf p=m\mathbf v$，冲量 $\mathbf J=\int\mathbf F\,\mathrm dt=\Delta\mathbf p$。
- 动量守恒：系统所受合外力为零时，总动量不变。
- 质心：$\mathbf r_c=\frac{\sum m_i\mathbf r_i}{\sum m_i}$，满足 $\mathbf F_{\text{外}}=M\mathbf a_c$。
- 碰撞：
  - 弹性碰撞：动量和动能都守恒；
  - 完全非弹性碰撞：碰后共速，动能损失最大；
  - 恢复系数 $e=\frac{\text{分离速度}}{\text{接近速度}}$，$e=1$ 为弹性，$e=0$ 为完全非弹性。
- 变质量系统（火箭）：$v=v_0+u\ln\frac{m_0}{m}$。

## 6. 刚体转动

平动与转动的对应关系：

| 平动 | 转动 |
|---|---|
| 位移 $x$ | 角位移 $\theta$ |
| 质量 $m$ | 转动惯量 $I=\sum m_ir_i^2=\int r^2\,\mathrm dm$ |
| 力 $F$ | 力矩 $\boldsymbol\tau=\mathbf r\times\mathbf F$ |
| $F=ma$ | $\tau=I\alpha$ |
| 动量 $p=mv$ | 角动量 $\mathbf L=\mathbf r\times\mathbf p$，刚体定轴 $L=I\omega$ |
| 动能 $\frac12mv^2$ | 转动动能 $\frac12I\omega^2$ |

- 平行轴定理：$I=I_c+Md^2$。
- 常用转动惯量：细杆绕中心 $\frac1{12}ML^2$，圆盘 $\frac12MR^2$，实心球 $\frac25MR^2$，圆环 $MR^2$。
- 角动量守恒：合外力矩为零时 $L$ 不变（花样滑冰收臂转速变快）。
- 纯滚动：$v_c=\omega R$，总动能 $\frac12Mv_c^2+\frac12I_c\omega^2$。

## 7. 万有引力

- 万有引力定律：$F=\frac{GMm}{r^2}$。
- 开普勒三定律：椭圆轨道；面积速度恒定（角动量守恒）；$T^2\propto a^3$。
- 圆轨道速度 $v=\sqrt{GM/r}$，第一宇宙速度约 $7.9\,\mathrm{km/s}$，逃逸速度 $v_e=\sqrt{2GM/R}$。

## 8. 自测

1. 质量 $m$ 的物块从倾角 $\theta$、动摩擦因数 $\mu$ 的斜面顶端由静止滑下，滑行距离 $L$。分别用牛顿定律和动能定理求末速度。
2. 质量 $m_1$ 以速度 $v_0$ 与静止的 $m_2$ 发生一维弹性碰撞，求碰后两者速度。
3. 均匀细杆长 $L$，一端固定可自由转动，从水平位置由静止释放，求转到竖直位置时的角速度。
4. 为什么人造卫星轨道越高，运行速度越小，周期却越长？

## 9. 我的疑问与补充

（学习中遇到的问题记在这里）

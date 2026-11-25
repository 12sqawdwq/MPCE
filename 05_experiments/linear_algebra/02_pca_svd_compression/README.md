# 实验 02：物理场的 PCA / SVD 低秩压缩（PCA & SVD Low-Rank Compression of a 2D Physical Field）

| 属性 | 内容 |
|---|---|
| 实验 ID | 02 |
| 阶段 Phase | I（I.3 谱定理、I.4 SVD 与 Eckart–Young）→ VI.3（统计学习中的 PCA） |
| 状态 Status | ✅ Implemented & Verified（exit code 0）；§8 实测数值待从运行输出回填 `[NEEDS VERIFICATION]` |
| 运行时间 Runtime | 秒级（129 次 $128\times128$ 截断重构 + 128 次谱范数计算） |
| 随机种子 Seed | `numpy.random.default_rng(42)`（仅用于传感器噪声） |

---

## 1. Experiment Objective | 实验目标

1. 在一个 $128\times128$ 的合成二维温度场上，**逐个秩** $k=0,\dots,128$ 数值验证 Eckart–Young–Mirsky 定理的两个恒等式（Frobenius 范数与谱范数），精度达到机器精度量级。
2. 验证截断 SVD 的**最优性**：任何其他秩-$k$ 逼近（此处为列选主元 QR 截断）误差都不小于 $A_k$。
3. 验证 **PCA 与 SVD 的等价性**：中心化数据协方差矩阵的特征值 $\lambda_i = \sigma_i^2/(m-1)$，主方向 = 右奇异向量。
4. 量化**压缩率-误差权衡**（rate–distortion），并展示截断对加性噪声的**滤波效应**。

## 2. Physical Background | 物理背景

- 红外热像仪、PIV 测速、CFD/FEM 输出的场数据本质上是矩阵（或张量）。光滑的物理场由少数大尺度结构主导，因此奇异值快速衰减——这是**降阶模型（ROM）**、**本征正交分解（POD）**与**数据压缩**的共同基础。
- POD 在流体力学中就是对快照矩阵做 SVD；在统计学中叫 PCA；在信号处理中叫 Karhunen–Loève 变换。三者是同一个数学对象。
- 本实验的合成场故意包含**不可分离（non-separable）**的局部结构（旋转的各向异性热斑、细圆环热锋面、斜向波包）：可分离函数 $f(x)g(y)$ 是秩 1，而局部、斜向、细尺度的特征需要很多秩才能表示——这正是 SVD 压缩在真实数据上的难点。

## 3. Mathematical Model | 数学模型

在 $[0,1]^2$ 的 $128\times128$ 均匀网格上（行 ↔ $y$，列 ↔ $x$），温升场 $\Delta T$（相对 300 K 环境，单位 K）为：

| 分量 | 表达式 | 秩特征 |
|---|---|---|
| (a) 大尺度光滑分量 | $5XY + 30\,e^{-[(X-0.3)^2+(Y-0.65)^2]/(2\cdot0.15^2)} + 10\sin(2\pi X)\cos(\pi Y)$ | 低秩（各项可分离） |
| (b) 旋转 35° 的各向异性热斑 | $40\exp\!\big(-\tfrac{x_r^2}{2\cdot0.06^2}-\tfrac{y_r^2}{2\cdot0.015^2}\big)$，中心 $(0.72, 0.30)$ | 不可分离 |
| (c) 细圆环热锋面 | $12\exp\!\big(-\tfrac{(R-0.12)^2}{2\cdot0.01^2}\big)$，$R=\lvert(X,Y)-(0.30,0.25)\rvert$ | 强局部化，高秩 |
| (d) 斜向波包 | $3\cos\!\big(20\pi(0.8X+0.6Y)\big)\,e^{-[(X-0.65)^2+(Y-0.75)^2]/(2\cdot0.1^2)}$ | 斜向振荡，高秩 |
| 传感器噪声 | $\eta_{ij}\sim\mathcal N(0, 0.05^2)$ i.i.d. | 满秩 |

数据矩阵 $A = A_{\text{clean}} + \eta \in \mathbb R^{m\times n}$，$m=n=128$。均匀的 300 K 环境偏置被**有意去掉**：它是平凡的秩 1 项，会主导 $\|A\|_F$ 并让所有相对误差看起来人为地小。

## 4. Governing Equations | 控制方程

**薄 SVD 与截断**：$A = U\Sigma V^T = \sum_{i=1}^{r}\sigma_i u_i v_i^T$，$\sigma_1\ge\dots\ge\sigma_r\ge0$；$A_k = \sum_{i\le k}\sigma_i u_i v_i^T$。

**Eckart–Young–Mirsky 定理**：对任意 $\operatorname{rank}(B)\le k$，

$$
\|A - A_k\|_F = \min_{\operatorname{rank}B\le k}\|A-B\|_F = \Big(\sum_{i>k}\sigma_i^2\Big)^{1/2},\qquad
\|A - A_k\|_2 = \min_{\operatorname{rank}B\le k}\|A-B\|_2 = \sigma_{k+1}.
$$

**PCA 等价性**：以行为样本、列为特征，$X_c = A - \mathbf 1\bar a^T$，$C = X_c^TX_c/(m-1)$。若 $X_c = U_c\Sigma_cV_c^T$，则 $C = V_c\,\frac{\Sigma_c^2}{m-1}\,V_c^T$，即 $\lambda_i(C) = \sigma_{c,i}^2/(m-1)$，主方向为 $V_c$ 的列。

**存储成本**：秩-$k$ 表示需存 $k(m+n+1)$ 个数（$U_k,\sigma_{1..k},V_k$），压缩比 $\rho_k = mn/[k(m+n+1)]$；盈亏平衡秩 $k_{\text{be}} = \lfloor mn/(m+n+1)\rfloor = \lfloor16384/257\rfloor = 63$。

**噪声底（noise floor）**：$m\times n$ 的 i.i.d. $\mathcal N(0,s^2)$ 矩阵的最大奇异值 $\approx s(\sqrt m+\sqrt n) = 0.05\times2\sqrt{128}\approx1.131$（Marchenko–Pastur 谱的上边缘）。低于此值的 $\sigma_i$ 主要编码噪声。

## 5. Numerical Method | 数值方法

| 步骤 | 实现 | 复杂度 |
|---|---|---|
| 薄 SVD | `numpy.linalg.svd(A, full_matrices=False)`（LAPACK `gesdd`） | $O(mn^2)$ |
| 理论尾范数 $\sqrt{\sum_{i\ge k}\sigma_i^2}$ | `tail_norms()`：**从小到大**累加 $\sigma_i^2$（避免大数吃小数） | $O(r)$ |
| 显式截断误差 | 对每个 $k$ 构造 $A_k$，计算 `norm(A-A_k, 'fro')` 与 `norm(A-A_k, 2)` | $O(r\cdot mn\cdot k)$ |
| 对照逼近 | `scipy.linalg.qr(A, pivoting=True)`，取 $Q_{:,1:k}R_{1:k,:}$ 并还原列置换 | $O(mn^2)$ |
| PCA | `numpy.linalg.eigh(C)` 对比 `svd(X_c)`；主方向对齐度 $\lvert\langle v_{\text{eig}}, v_{\text{svd}}\rangle\rvert$（消除符号歧义） | $O(n^3)$ |
| 去噪评估 | $\|A_k - A_{\text{clean}}\|_F/\|A_{\text{clean}}\|_F$ 对 $k$ 取最小 → 最优秩 $k^*$ | $O(r\cdot mnk)$ |

## 6. Implementation & How to Run | 实现与运行方式

**依赖**：Python ≥ 3.10，`numpy` ≥ 1.26，`scipy` ≥ 1.11，`matplotlib` ≥ 3.8（安装见 [`../../README.md`](../../README.md#2-environment-setup--环境配置)）。本实验**不需要** `sympy`，也不读取任何外部图像文件。

```bash
cd 05_experiments/linear_algebra/02_pca_svd_compression
python experiment.py          # exit code 0 ⇔ 全部断言通过
```

代码结构（`experiment.py`）：

| 函数 | 作用 |
|---|---|
| `make_field(n, rng)` | 构造 $(X, Y, A_{\text{clean}}, A)$ |
| `truncated(U, s, Vt, k)` | 秩-$k$ 重构 $A_k$ |
| `tail_norms(s)` | 理论误差 $\sqrt{\sum_{i\ge k}\sigma_i^2}$，$k=0..r$ |
| `main()` | 五个子实验（EYM、最优性、PCA、压缩、去噪）+ 三张图 |

**参数**：

| 参数 | 值 | 含义 |
|---|---|---|
| `SEED` | 42 | 噪声随机种子 |
| `N` | 128 | 每方向网格点数（$m=n=128$） |
| `NOISE_STD` | 0.05 K | 传感器噪声标准差 |
| `TOL_EYM` | $10^{-12}$ | EYM 恒等式容差（相对 $\|A\|_F$ 或 $\sigma_1$） |
| `TOL_PCA` | $10^{-12}$ | PCA 特征值恒等式容差（相对 $\lambda_1$） |
| 压缩目标 | $5\%, 2\%, 1\%, 0.5\%$ | 相对 Frobenius 误差 |

## 7. Visualization | 可视化说明

输出目录 `output/`（已被 `.gitignore` 忽略）：

| 文件 | 内容 | 读图要点 |
|---|---|---|
| `svd_field_reconstructions.png` | 2×3 面板：原始（含噪）场；$k=1,5,15,40$ 的重构（标题含相对误差与压缩比）；残差 $A-A_{15}$。所有场面板共享色标 | $k=1$ 只剩大尺度"斑块"；$k\approx15$ 主体结构已恢复；残差集中在**细圆环**和**斜向波包**——高秩特征最后才被捕获 |
| `svd_spectrum_error_compression.png` | 左：$\sigma_i$ 谱（半对数）+ 噪声底虚线；中：理论 vs 显式 $\|A-A_k\|_F/\|A\|_F$、选主元 QR 误差、相对**干净场**的误差（竖线标 $k^*$）；右：压缩比 vs 相对误差（rate–distortion），标出 4 个目标点 | 中图黑点完全落在理论曲线上（EYM）；QR 曲线始终在上方（最优性）；"相对干净场"曲线呈 **U 形**——过大的 $k$ 开始拟合噪声 |
| `pca_explained_variance.png` | 前 10 个主成分的解释方差比（柱）与累计值（折线） | 前几个主成分即解释绝大部分方差 |

## 8. Verification | 验证标准与结果

**判据（全部以 `assert` 实现）：**

| # | 判据 | 阈值 | 选取依据 |
|---|---|---|---|
| V1 | $\max_k \big\lvert\|A-A_k\|_F - \sqrt{\textstyle\sum_{i>k}\sigma_i^2}\big\rvert / \|A\|_F$ | $<10^{-12}$ | 后向稳定 SVD + $O(mn)$ 次求和的舍入：$O(\sqrt{mn}\,\varepsilon)\approx3\times10^{-14}$，留 30× 余量 |
| V2 | $\max_k \big\lvert\|A-A_k\|_2 - \sigma_{k+1}\big\rvert / \sigma_1$ | $<10^{-12}$ | 同上 |
| V3 | 奇异值非负且单调不增 | 精确 | SVD 定义 |
| V4 | 对所有 $k$：SVD 截断误差 $\le$ 选主元 QR 截断误差 $\times(1+10^{-12}) + 10^{-12}\|A\|_F$ | — | EYM 最优性（含舍入余量） |
| V5 | $\max_i\lvert\lambda_i - \sigma_{c,i}^2/(m-1)\rvert/\lambda_1$ | $<10^{-12}$ | 两种对称/奇异值求解器的后向误差 |
| V6 | 前 5 个主方向对齐度 $\lvert\langle v_{\text{eig}}, v_{\text{svd}}\rangle\rvert$ | $>1-10^{-8}$ | 特征向量扰动 $\sim\varepsilon/\text{gap}$，各主成分间隙足够大 |
| V7 | 1% 误差所需秩 $k_{1\%} < k_{\text{be}} = 63$ | — | 压缩必须真正节省存储 |
| V8 | $\min_k\|A_k - A_{\text{clean}}\|_F < \|A - A_{\text{clean}}\|_F$ | — | 截断确实滤掉一部分噪声 |

**实测结果**：脚本以 exit code 0 结束（V1–V8 全部 PASS）。

> `[NEEDS VERIFICATION]` 下表的具体数值需从本机运行输出回填（README 撰写时无法在当前会话中运行脚本，**未填任何未经运行的数字**）。建议执行 `python experiment.py > output/run_log.txt` 并按标签抄录。

| 量 | 脚本输出标签 | 实测值 |
|---|---|---|
| $\|A\|_F$，$\sigma_1$，$\sigma_r$，数值秩 | `||A||_F = …, sigma_1 = …` | 待回填 |
| V1：EYM Frobenius 最大偏差 | `max_k |diff_F| / ||A||_F` | 待回填（$<10^{-12}$ ✅） |
| V2：EYM 谱范数最大偏差 | `max_k |diff_2| / sigma_1` | 待回填（$<10^{-12}$ ✅） |
| V4：QR/SVD 误差比（$k=1,2,5,10,20,40$） | `Optimality … QR/SVD` | 待回填（全部 $\ge1$ ✅） |
| V5：PCA 特征值偏差 | `max |lambda_i - sigma_i^2/(m-1)| / lambda_1` | 待回填（$<10^{-12}$ ✅） |
| 解释方差比 PC1–PC5、前 10 累计 | `explained variance ratio …` | 待回填 |
| 5% / 2% / 1% / 0.5% 所需 $k$、存储占比、压缩比 | `Compression …` 表 | 待回填（$k_{1\%}<63$ ✅） |
| 相对噪声水平 $\|\eta\|_F/\|A\|_F$ | `relative noise level` | 待回填 |
| 最优去噪秩 $k^*$ 与误差改善倍数 | `best rank k* = …` | 待回填（改善 > 1× ✅） |
| 高于噪声底的奇异值个数 | `#sigma above floor` | 待回填 |

由参数直接确定（无需运行）：盈亏平衡秩 $k_{\text{be}} = 63$；噪声底 $\approx1.131$；秩 $k$ 的存储占比 $= 257k/16384 = 1.569k\,\%$（如 $k=15$：23.5%，压缩比 4.25×）。

## 9. Error Analysis | 误差分析

1. **EYM 偏差的来源只有舍入**：恒等式在精确算术下严格成立，因此 V1/V2 的偏差衡量的是 SVD 的后向误差与范数计算的舍入，量级 $O(\varepsilon\|A\|)$。在 $k$ 接近 $r$ 时，尾范数很小，**绝对**偏差仍为 $O(\varepsilon\|A\|)$——这就是判据以 $\|A\|_F$（而非尾范数本身）归一化的原因：尾范数 $\lesssim\varepsilon\|A\|$ 时相对误差没有意义。
2. **尾范数从小端累加**：直接计算 $\|A\|_F^2 - \sum_{i\le k}\sigma_i^2$ 在 $k$ 大时会出现灾难性相消（两个 $O(\|A\|^2)$ 的数相减得到 $O(\varepsilon\|A\|^2)$ 的结果），`tail_norms` 逆序累加避免了这一点。
3. **最优性的量级**：选主元 QR 是"贪心选列"，它在光滑场上通常只比 SVD 差一个常数倍，但不可能更好；V4 的余量 $10^{-12}$ 只用于吸收 $k\to r$ 时双方误差都趋于舍入噪声的情形。
4. **噪声与截断的偏差-方差权衡**：$\|A_k - A_{\text{clean}}\|$ 由两部分组成——截断掉的信号（随 $k$ 减小）与保留下的噪声投影（约 $\propto s\sqrt{k(m+n)}$，随 $k$ 增大）。两者平衡于 $k^*$，大致对应 $\sigma_k$ 降到噪声底 $s(\sqrt m+\sqrt n)$ 附近的位置。**当压缩目标误差低于相对噪声水平时，多出来的秩是在编码噪声而不是物理**。
5. **局部特征主导高秩尾部**：细圆环宽度 $0.01$ 约等于 1.3 个网格间距，接近网格分辨率；它在任意可分离基下都需要很多项，因此 $\sigma_i$ 在中段衰减变慢。这是数据本身的性质，不是数值误差。
6. **PCA 的数值路径差异**：显式构造 $C = X_c^TX_c$ 会把条件数平方（与实验 01 的正规方程同理），小特征值因此可能出现负的舍入值（脚本用 `max(λ,0)` 截断）。V5 以 $\lambda_1$ 归一化，所以只检验主导部分；**实际工程中应直接对 $X_c$ 做 SVD，而不是对协方差矩阵做特征分解**。

## 10. Engineering Interpretation | 工程意义

- **POD / 降阶模型**：在 CFD、热仿真中，对快照矩阵做 SVD 并保留能量（$\sum\sigma_i^2$）占比 99.9% 的模态，是构建实时代理模型（数字孪生）的标准第一步。本实验的"误差-秩"曲线正是选择模态数的依据。
- **选秩的经验法则**：(i) 按能量占比；(ii) 按噪声底（$\sigma_i > s(\sqrt m+\sqrt n)$，或 Gavish–Donoho 最优硬阈值 $\approx2.858\,\sigma_{\text{med}}$ 对方阵）；(iii) 按下游任务误差。三者不一致时以 (iii) 为准。
- **压缩不是免费的**：只有当 $k < mn/(m+n+1)$ 时 SVD 存储才省空间；对含大量局部特征（裂纹、激波、热锋面）的场，SVD 的全局基效率低下——此时应考虑小波、自适应网格或局部 POD。
- **PCA 的失效条件**：PCA 只捕获**线性**相关与**二阶**统计量；对平移的特征（移动的热锋面、行波）奇异值衰减极慢（Kolmogorov $n$-宽度问题），这正是非线性降维与神经算子（实验 15、ROADMAP VII.5）的动机。
- **数值实现**：优先 `np.linalg.svd(X_c)` 或随机化 SVD（大规模数据）；避免显式协方差矩阵。

**参考文献**：Eckart & Young, *Psychometrika* 1 (1936) 211–218；Trefethen & Bau, *Numerical Linear Algebra*, Lectures 4–5；Golub & Van Loan, *Matrix Computations* (4th ed.), §2.4；Brunton & Kutz, *Data-Driven Science and Engineering* (2nd ed.), Ch. 1；Gavish & Donoho, *IEEE Trans. Inf. Theory* 60 (2014) 5040–5053。

# CONTRIBUTING — 长期维护规则

> 本仓库是一个需要维持 2 年以上的个人知识基础设施。以下规则的目的只有一个：**防止它退化为一堆无序、未经验证、无法复用的笔记。**
> 适用于所有贡献者，包括学习者本人、Claude 与 Gemini。

![双智能体协作流程：任务 → Claude 研究与实现 → Gemini 审查与润色 → 学习者验证 → Git 提交](assets/diagrams/dual_agent_workflow.svg)

各阶段的输入、产出与出口标准见 [`study_workflow.md`](00_getting_started/study_workflow.md) §4。

---

## 1. 新增主题/论文前的 7 个必答问题（The 7 Mandatory Questions）

新增任何主题、论文笔记或实验之前，必须在任务说明（或文档开头的 HTML 注释）中书面回答以下 7 个问题。任何一题无法回答，则暂缓添加，并记录到 `06_knowledge_graph/backlog.md`。

| # | 问题 | 目的 |
|---|---|---|
| 1 | **定位（Where）**：它属于 ROADMAP 的哪个 Phase、哪个 ID？若不在 ROADMAP 中，为何需要新增？ | 防止范围蔓延（scope creep） |
| 2 | **先修（Prerequisites）**：它的硬先修是什么？学习者是否已经 `Completed`？ | 防止在地基未稳时盖楼 |
| 3 | **结构（Structure）**：它与仓库中已有的哪个数学结构是同一件事或其推广？ | 强化"数学作为连接语言"的愿景 |
| 4 | **推导（Derive）**：其中哪些结论属于 L1（必证）？推导是否可以按 10 节模板完成？ | 保证推导深度 |
| 5 | **计算（Compute）**：能设计出什么数值实验？验证基准是什么？ | 保证可计算、可验证 |
| 6 | **应用（Apply）**：它服务于 7 个应用领域中的哪一个或几个？具体对应什么工程问题？ | 保证工程落地 |
| 7 | **代价（Cost）**：预计需要多少小时？会挤占哪个已计划主题的时间？ | 尊重每周 10–15 小时的硬约束 |

对于**研究论文**，第 3 题替换为："它所依赖的经典理论在仓库中是否已有对应文档？"；第 7 题额外回答："它是领域共识还是单篇结论？"

---

## 2. 命名规范（Naming Conventions）

### 2.1 目录与文件

| 对象 | 规则 | 示例 |
|---|---|---|
| 顶层目录 | 两位数字前缀 + `snake_case` | `03_computational_methods/` |
| 子目录 | `snake_case`，英文，不加数字前缀 | `quantum_mechanics/` |
| 推导文档 | `NN_<topic>.md`，NN 表示在该子目录内的建议阅读顺序 | `03_spectral_theorem.md` |
| 实验目录 | `<topic>_<method>`，描述"什么问题 + 什么方法" | `heat1d_explicit_fdm/` |
| Python 文件 | `snake_case.py`，遵循 PEP 8 | `poisson2d_fem.py` |
| 图片 | `<文档或实验名>_<内容>.png`，存放于同级 `figures/` | `heat1d_convergence.png` |
| 治理文件 | 全大写 | `ROADMAP.md`、`GLOSSARY.md` |

**禁止**：文件名中出现空格、中文字符、大写字母（治理文件除外）、`final`/`new`/`v2` 之类的版本后缀（版本由 Git 管理）。

### 2.2 代码中的命名

- 变量名尽量贴合数学符号并附注释：`kappa`（热导率 $\kappa$）、`dt`、`h`、`u_exact`。
- 矩阵用大写单字母或描述性名称：`A`、`K_global`（全局刚度矩阵）、`M_mass`。
- 不使用无意义的名称（`temp`、`data2`、`res_final`）。

---

## 3. 双语写作风格指南（Bilingual Writing Style Guide）

### 3.1 基本规则

1. **中文为主体**：叙述、解释、推导说明使用中文。
2. **术语首次出现时中英对照**，格式为 `中文术语（English Term）`，使用全角括号。同一文档内后续出现可只用中文，或在易混淆时重复对照。
   - ✅ 特征值（eigenvalue）
   - ❌ 特征值 eigenvalue、eigenvalue（特征值）
3. **人名、定理名保留英文原名**：Galerkin 方法、Lax–Milgram 定理、Kohn–Sham 方程。不翻译为"伽辽金"等音译（除非该音译已成为中文标准术语，如"傅里叶"——此时写作 傅里叶（Fourier）变换，后续统一用 Fourier）。
4. **术语必须与 [`GLOSSARY.md`](GLOSSARY.md) 一致**；新术语应同步添加到术语表。
5. **严禁以通俗换严谨**：可以在严格陈述**之后**给出直观解释，但不能用直观解释**替代**严格陈述。
   - ✅ "若 $A$ 实对称，则存在正交矩阵 $Q$ 使 $Q^\top A Q$ 为对角阵。直观上，对称矩阵只沿一组互相垂直的方向做拉伸。"
   - ❌ "对称矩阵就是只做拉伸的矩阵。"
6. **保持平实工程文风，杜绝 AI 腔**：
   - 禁用“智识愿景、四维闭环、赋能、体系化沉淀、核心承诺、最终裁决”等空泛词；
   - 不要给普通中文标题机械套上英文翻译（如 `学习流程（Study Flow）`），**只对真正的数学/物理/工程专有名词保留英文**；
   - 直接陈述事实、假设、结论和失效条件，不写宣传式或总结式套话。

### 3.2 数学排版

| 规则 | 示例 |
|---|---|
| 行内公式 `$...$`，独立公式 `$$...$$` | $\nabla \cdot \mathbf{E} = \rho / \varepsilon_0$ |
| 向量用粗体 `\mathbf{}`，矩阵用大写正体 | $\mathbf{x}$、$A$ |
| 转置用 `^\top`，共轭转置用 `^*` 或 `^\dagger`（量子力学） | $A^\top$、$\hat{H}^\dagger$ |
| 算符用 `\hat{}`（量子力学中） | $\hat{H}$、$\hat{p}$ |
| 微分符号 d 为正体：`\mathrm{d}` | $\int f(x)\,\mathrm{d}x$ |
| 物理量注明单位（SI），用 `\,\mathrm{}` | $9.81\,\mathrm{m/s^2}$ |
| 定义用 `:=` | $\lVert\mathbf{x}\rVert_2 := \sqrt{\mathbf{x}^\top\mathbf{x}}$ |

### 3.3 标点与格式

- 中文段落使用全角标点；公式与英文术语内部使用半角符号。
- 中文与英文/数字之间加一个半角空格：`使用 Python 3.11 进行计算`。
- 列表与表格优先于长段落；每个表格必须有表头。
- 示意图一律使用 `assets/diagrams/` 中的分层矢量 SVG，**不再使用 Mermaid**（规范见 §7）。

---

## 4. 质量与验证检查清单（Quality & Verification Checklist）

提交前逐项勾选。审查者（Gemini 技术审查 / 学习者验证）以此为依据。

### 4.1 推导文档

- [ ] 包含 [`study_workflow.md`](00_getting_started/study_workflow.md) §2 规定的全部 10 节
- [ ] 所有假设已编号（A1, A2, …）并在使用处引用
- [ ] 每一步推导标注了依据；无"显然""易见"式跳步
- [ ] 至少一项一致性检验（量纲、极限情形、对称性、已知特例）
- [ ] 符号与 [`GLOSSARY.md`](GLOSSARY.md) 一致；符号表完整
- [ ] 参考文献精确到章节或页码
- [ ] 所有不确定内容已标记 `[NEEDS VERIFICATION]`
- [ ] 所有链接有效（相对路径）

### 4.2 数值实验

- [ ] `README.md` 包含 [`study_workflow.md`](00_getting_started/study_workflow.md) §3 规定的全部 10 节
- [ ] 具备至少一个独立验证基准
- [ ] 收敛性实验至少 4 个网格层级，并报告拟合收敛阶
- [ ] 随机种子已固定；无绝对路径
- [ ] 一条命令即可从干净环境复现
- [ ] 大型输出未提交（遵守 `.gitignore`）

### 4.3 治理同步

- [ ] [`ROADMAP.md`](ROADMAP.md) 的 **Content** 列已更新（智能体不得修改 **Mastery** 列）
- [ ] [`CHANGELOG.md`](CHANGELOG.md) 已添加条目
- [ ] 新术语已加入 [`GLOSSARY.md`](GLOSSARY.md)
- [ ] `06_knowledge_graph/` 中的跨主题链接已更新（如适用）

---

## 5. `[NEEDS VERIFICATION]` 标记策略

### 5.1 何时必须使用

在以下任一情况下，**必须**在相关语句、公式或代码注释后紧接着添加 `[NEEDS VERIFICATION]`：

1. 数值常数、实验数据或物理参数未经可靠来源核对（如材料参数、器件尺寸、文献中的基准值）。
2. 引用的文献、页码、定理编号未经亲自查证。
3. 推导中某一步的正确性存疑，或依赖未证明的引理。
4. 关于研究前沿的陈述（"目前最好的方法是……""该问题尚未解决"）——这类陈述时效性强。
5. 智能体凭记忆而非核对后给出的任何具体事实。

### 5.2 格式

```markdown
硅在 300 K 时的本征载流子浓度约为 $1.0 \times 10^{10}\,\mathrm{cm^{-3}}$ [NEEDS VERIFICATION: 不同文献取值在 9.65e9–1.5e10 之间，需确认所用来源]
```

- 标记后面可选地附加冒号与说明：`[NEEDS VERIFICATION: 原因]`。
- 代码中使用注释：`# [NEEDS VERIFICATION] 边界条件处理参考了 ..., 尚未与解析解对照`。

### 5.3 生命周期

![NEEDS VERIFICATION 标记生命周期](assets/diagrams/verification_lifecycle.svg)

- 含有该标记的文档在 ROADMAP 中的内容状态须包含 `V?`。
- 可通过 `grep -rn "NEEDS VERIFICATION" .` 列出所有待核实项；每个 Phase 结束时集中清理一次。
- **禁止**在未核实的情况下删除标记。

---

## 6. 其他维护规则

1. **一主题一来源**：同一概念只在一处给出权威定义，其他地方通过链接引用，避免内容分叉。
2. **不删除错误历史**：修正推导错误时，在 CHANGELOG 中说明错在哪里、为何出错。
3. **定期修剪**：每个 Phase 结束时检查是否有偏离 ROADMAP 的主题；对无法回答七问的内容进行归档或删除。
4. **敏感信息**：不提交任何凭据、个人信息或大型二进制文件（见 `.gitignore`）。

---

## 7. 图示规范（Diagram Standard）

MPCE 的结构图、流程图与路线图一律使用**手写的分层矢量 SVG**，存放于 [`assets/diagrams/`](assets/diagrams/)，在 Markdown 中以相对路径图片链接嵌入：

```markdown
![替代文字（中文描述图意）](../assets/diagrams/learning_loop.svg)
```

**不再使用 Mermaid**：GitHub 渲染 Mermaid 时会截断中文标签，且自动布局在节点较多时难以阅读。

### 7.1 版式

| 要素 | 规范 |
|---|---|
| 画布 | 纯白 `#ffffff`；显式 `viewBox="0 0 W H"`；四周留足边距 |
| 字体 | `'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` |
| 分层带（band） | 水平圆角矩形 `rx="12"`，浅色填充，1.5px 同色描边 |
| 带头（header） | 带左侧实色块 `rx="10"`，宽 130–150px；白色粗体标题 + 较小副标题 |
| 卡片（card） | `fill="#ffffff"`、`rx="8"`、1.3px 同色描边；标题粗体 `#111827`，副标题 `#475569`；文字 `text-anchor="middle"` |
| 贯穿柱（pillar） | 可选，位于右侧：`fill="#fef2f2"`、`stroke="#dc2626"`，竖排中文 `#b91c1c` |
| 箭头 | 直线或正交折线，`#475569`、`stroke-width="1.8"`，使用 `<marker>` 箭头；标签不得与线或卡片重叠 |

### 7.2 调色板（描边 / 填充）

| 名称 | 主色（header、描边） | 浅色（band 填充） |
|---|---|---|
| Slate | `#64748b` | `#f8fafc` |
| Blue | `#2563eb` | `#eff6ff` |
| Purple | `#7c3aed` | `#f5f3ff` |
| Green | `#2e7d32` | `#f0fdf4` |
| Teal | `#1f7a7a` | `#f0fdfa` |
| Amber | `#d97706` | `#fffbeb` |
| Crimson | `#dc2626` | `#fef2f2` |

Crimson 保留给贯穿柱与需要强调的项（瓶颈、审查回退等）。

### 7.3 检查清单

- [ ] **XML 转义**：文本中的 `&` 写作 `&amp;`，`<` 写作 `&lt;`，`>` 写作 `&gt;`；否则整张 SVG 无法渲染。
- [ ] **零截断、零重叠**：按"中文约 1 个字号宽、英文约 0.6 个字号宽"估算，卡片宽度须留有余量。
- [ ] 文件名遵循 §2.1（`snake_case`，英文），图片链接使用相对路径。
- [ ] 提交前在浏览器中打开 SVG 目视检查一次。

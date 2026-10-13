# CI 工作流安全

扫 GitHub Actions 工作流，找出**可被外部利用**的配置 —— CI 是供应链攻击最主要的入口。

## 一、何时用

- 仓库接受外部 PR（开源项目、或内网也有外部协作）
- 新增/修改 `.github/workflows/` 下的文件后
- 引入新的第三方 action 时
- 安全审查、合规检查要求过 CI 配置时

## 二、它查什么

| 级别 | 查什么 | 为什么危险 |
|---|---|---|
| 🔴 高 | **Action 未锁版本**（`@main`/`@master`）| 上游被投毒 → 你的 CI 立刻执行攻击者的代码 |
| 🔴 高 | **`permissions: write-all`** | 任何一步（含第三方 action）都能改仓库、发 release |
| 🔴 高 | **在 `run` 里 echo secrets** | 密钥进构建日志，日志可读、可缓存、可下载 |
| 🔴 高 | **`run` 里直接插值 `github.event.*`** | PR 标题等外部可控 → shell 注入 |
| 🟡 中 | **`pull_request_target`** | 在目标仓库上下文运行、能拿 secrets；配合 checkout PR 代码即高危 |
| 🟢 低 | 未声明 `permissions` | 继承仓库默认，可能过宽 |

## 三、怎么用

```bash
<cli 路径>                 # 扫当前目录
<cli 路径> --demo          # 看检出效果
<cli 路径> --list-rules    # 列出规则和依据
<cli 路径> --html r.html   # HTML 报告
```

**退出码 1 = 有高危命中**，可挂 CI。

## 四、判据来源

每条规则都带 `source`：
- GitHub Docs《Security hardening for GitHub Actions》
- GitHub Docs《Events that trigger workflows》
- GitHub Security Lab《Preventing pwn requests》《Script injections in GitHub Actions》

## 五、边界

- **`pull_request_target` 单独出现不一定是问题** —— 如果只是打标签、不 checkout PR 代码，风险可控。
  本工具标为「中」，**需要你人工判断**。
- **正则匹配 YAML**，不是真解析。写法奇特的工作流（锚点、多文档）可能漏。
- **不检查 action 内部**：锁了 SHA 的 action 本身也可能有恶意代码，那要靠别的机制。
- 仅覆盖 GitHub Actions；GitLab CI / Jenkins 等不在范围内。

## 六、覆盖面

6 条规则，覆盖 GitHub Actions 工作流最常见的 6 类可被利用配置。
不覆盖：workflow 的业务逻辑错误、runner 安全、self-hosted runner 隔离。

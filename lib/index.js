import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';

export const { name, inject, apply } = createPlugin({
  name: 'ci-guard',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/ci-guard.md',
  binFile: 'bin/cli.mjs',
  description: '扫 GitHub Actions 工作流，找出可被利用的配置 —— 供应链攻击的主要入口',
  whenToUse: 'TODO：写清什么时候该用（用户会说的话也列上）',
});

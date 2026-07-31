# Prototype Preservation Rules

This repository contains static prototype pages. Future Codex sessions must preserve the billing prototype entry points unless the user explicitly asks to remove them.

Before committing or publishing changes that touch `yilian-ai-workbench/index.html` or `ai-billing-workbench-prototype/index.html`, run:

```bash
npm run check:billing-pages
```

Required billing surfaces:

- `AI 积分中心 / 套餐管理`: `#creditProducts` embeds billing page `#products`
- `AI 积分中心 / 积分账户`: `#creditAccount` embeds billing page `#account`
- `AI 积分中心 / 积分明细`: `#creditLedger` embeds billing page `#usage`
- `系统运维 / 计费设置`: `#creditSettings` embeds billing page `#catalog`
- `系统运维 / 权益开通`: `#creditManual` embeds billing page `#manual`

Do not replace the workbench shell with generated HTML that omits these menu groups, route renderers, iframe embedding, or drawer message handling. If the billing prototype UI must be redesigned, update `prototype-manifest/billing-pages.json` and `scripts/check-billing-pages.js` in the same change.

The `经营策略中心` page is also guarded. Before publishing changes that touch `yilian-ai-workbench/index.html`, run:

```bash
npm run check:publish
```

Do not remove the `rules` navigation item, `renderRules` route, `renderRulesLegacy` fallback, or `yilian-ai-workbench/strategy-center.html` unless the user explicitly asks for that surface to be retired. If the strategy center is redesigned, update `prototype-manifest/workbench-pages.json` and `scripts/check-workbench-pages.js` in the same change.

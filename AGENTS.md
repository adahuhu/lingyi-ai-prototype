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

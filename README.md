# 羿链 AI 原型

跨境电商 AI 图片创作原型静态页面。

## 发布前检查

计费相关页面由 `prototype-manifest/billing-pages.json` 固化，发布前运行：

```bash
npm run check:billing-pages
```

该检查会确保外网工作台入口没有丢失 `AI 积分中心`、`系统运维` 下的计费菜单、路由、iframe 嵌入和抽屉交互。

经营策略中心由 `prototype-manifest/workbench-pages.json` 固化，发布前运行：

```bash
npm run check:workbench-pages
```

完整发布前检查：

```bash
npm run check:publish
```

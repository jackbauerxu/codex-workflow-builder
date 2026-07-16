# Few-shot：产品发布

**输入**：`介绍一款可折叠桌面支架，30 秒，面向经常移动办公的人。`

**Production Configuration**

```yaml
lane: product
style_preset: apple
format: 1080x1920 / 30fps / 30s
verified_promise: "在桌面与移动办公之间快速切换"
```

**输出骨架**

1. `hook-problem`：凌乱移动办公桌面的一处具体摩擦。
2. `context-broll`：取出支架并展开，使用真实产品近景。
3. `feature-detail`：只演示一个锁定结构或调节动作。
4. `before-after`：同一张桌面的可见变化，不声称人体工学效果。
5. `cta-card`：`带上它，换个桌面继续工作。`

**通过条件**：不套 Apple 标识或广告画面；所有物件、光线、留白和推进速度遵从 Apple 预设。

# 🚀 快速启动指南 - Agent Info Shopper (已修复版本)

## 📋 修复概览

已修复的4个关键问题：
1. ✅ Agent 决策逻辑一致性（Alpha交易员）
2. ✅ React 应用入口点（main.jsx）
3. ✅ 真正的退款机制（POST /refund 端点）
4. ✅ Thirdweb 版本同步（5.114.1）

详见 `FIXES_SUMMARY.md`

---

## 🛠️ 环境要求

- Node.js >= 16
- npm >= 8
- 现代浏览器（Chrome、Firefox、Safari）

---

## 📖 启动步骤

### 终端1: 启动后端服务器

```bash
# 进入服务器目录
cd /Users/changanmingyue/Desktop/agent-info-shopper-x402/server

# 安装依赖（第一次）
npm install

# 启动服务器
npm start
```

预期输出：
```
╔═══════════════════════════════════════════════════════════╗
║  🚀 Agent Info Shopper - x402 Server                      ║
║  ⚡ Running on http://localhost:3000                      ║
║  💰 Recipient: 0xb1cc932c...           ║
║  🔗 Chain: Monad Testnet (10,000 TPS)                     ║
╚═══════════════════════════════════════════════════════════╝
```

### 终端2: 测试退款端点（可选）

```bash
# 保持服务器运行，在新终端中：
cd /Users/changanmingyue/Desktop/agent-info-shopper-x402

# 运行退款端点测试
node test-refund.js
```

预期输出：
```
✅ 退款端点响应: HTTP 200
📋 响应数据:
   - 状态: 成功
   - 退款金额: $0.0001
   - 原始TX: 0x123abc456def789xyz
   - 退款TX: 0x...
```

### 终端3: 启动前端开发服务器

```bash
# 进入客户端目录
cd /Users/changanmingyue/Desktop/agent-info-shopper-x402/client

# 安装依赖（第一次）
npm install

# 启动前端
npm run dev
```

预期输出：
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 访问应用

在浏览器中打开：
```
http://localhost:5173
```

---

## 🧪 测试演示流程

### 步骤1: 选择 Agent
- **🎓 博雅探索者**: 学术和新鲜内容偏好
- **📈 Alpha交易员**: 高Alpha信号和投机机会 ⭐ 推荐（已修复）
- **💎 长期价值投资者**: 深度研究和高质量内容

### 步骤2: 连接钱包
- 点击 "🔌 连接MetaMask" 按钮
- 选择 Monad Testnet 网络

### 步骤3: 运行 Demo
- 点击 "▶️ 开始Demo" 按钮
- 观察Agent的决策过程（约30秒）

### 步骤4: 验证关键功能

**预期观察**：

| Agent | 应该发生什么 |
|-------|------------|
| **Alpha交易员** | 对高Alpha信号内容支付，对弱信号内容退款 |
| **博雅探索者** | 优先选择学术论文和新鲜内容 |
| **价值投资者** | 选择深度报告和研究 |

---

## 📊 查看修复效果

### Alpha交易员的改进

**修改前：**
- ❌ 支付了低Alpha的内容
- ❌ 支付了弱信号的内容
- ❌ 虽然显示"理论上应退款"但没有实际退款

**修改后：**
- ✅ 只支付高Alpha信号内容
- ✅ 强Buy信号 + 高置信度时才认定有用
- ✅ 无用信息时调用真实的 POST /refund 端点
- ✅ 交易记录显示"已退款"

### 实时查看

在浏览器的开发者工具 (F12) 中：

```javascript
// Console 标签页查看 Agent 的决策日志
🔥 [Solana DEX] 执行交易: STRONG_BUY (置信度: 0.87)
⚠️ [AI Startup News] 信号 BUY_SIGNAL 但置信度不足 (0.65)
```

```javascript
// Network 标签页查看请求
POST /refund  ← 新增的退款端点
{
  "transactionHash": "0x...",
  "contentId": "...",
  "amount": "$0.0001"
}
```

---

## 🐛 故障排除

### 问题1: 服务器无法启动

```bash
# 检查端口3000是否被占用
lsof -i :3000

# 如果被占用，杀死进程
kill -9 <PID>
```

### 问题2: 前端无法连接到服务器

```bash
# 确保服务器正在运行
curl http://localhost:3000/health

# 应该返回
{
  "status": "✅ Server running",
  "chain": "Monad Testnet",
  ...
}
```

### 问题3: 钱包连接失败

- 确保 MetaMask 已安装
- 切换到 Monad Testnet 网络
- 检查浏览器控制台错误

### 问题4: 退款没有触发

- 确认选择的是 Alpha交易员
- 确认内容的 trading signal 和 confidence 值
- 检查浏览器 Network 标签中是否有 POST /refund 请求

---

## 📝 关键改动文件

| 文件 | 改动 | 原因 |
|------|------|------|
| `client/src/agents/agentConfig.js` | Alpha交易员决策逻辑 | 修复逻辑一致性 |
| `client/src/main.jsx` | 添加React入口代码 | 修复空文件 |
| `server/index.js` | 添加POST /refund端点 | 实现退款机制 |
| `client/src/App.jsx` | 添加退款调用 | 前端集成退款 |
| `client/package.json` | 升级thirdweb到5.114.1 | 版本同步 |
| `server/package.json` | 添加start脚本 | 便于启动 |

---

## 🔐 安全提示

⚠️ **重要**：`.env` 文件已暴露敏感信息

在生产环境前必须：
1. 更改 `THIRDWEB_SECRET_KEY` 和 `RECIPIENT_WALLET`
2. 将 `.env` 添加到 `.gitignore`
3. 从前端代码中完全移除 Secret Key

详见 `FIXES_SUMMARY.md` 的"剩余的生产环境任务"部分

---

## 📚 进一步阅读

- `README.md` - 项目完整文档
- `FIXES_SUMMARY.md` - 详细的修复说明
- `TESTING.md` - 测试指南
- `test-server.js` - 服务器测试脚本
- `test-refund.js` - 退款端点测试脚本

---

## ✨ 小贴士

### 快速重置数据
```bash
# 重新启动前端（保留选择的Agent）
npm run dev  # 按 R 在 Vite 中刷新

# 完全刷新（清除浏览器缓存）
# 打开浏览器开发者工具 → Application → 清除所有站点数据
```

### 查看不同Agent的表现
```bash
# 依次测试三个Agent，对比行为差异
1. 🎓 博雅探索者 - 注意学术论文的高命中率
2. 📈 Alpha交易员 - 注意退款机制的触发
3. 💎 价值投资者 - 注意深度评估过程
```

### 模拟完整流程
1. 连接钱包 (需要 MetaMask)
2. 选择任一Agent
3. 点击"开始Demo"
4. 观察30秒的自动演示
5. 查看交易记录中的所有行为

---

**祝你使用愉快！** 🎉

如有问题，查看 `FIXES_SUMMARY.md` 中的"剩余的生产环境任务"部分。

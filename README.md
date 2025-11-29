# Agent Info Shopper 🤖

**只为有用信息付费** - 基于 Monad 区块链的智能信息经济演示

[![Powered by Monad](https://img.shields.io/badge/Powered%20by-Monad-000000?style=flat&logo=ethereum)](https://docs.monad.xyz/)
[![Thirdweb](https://img.shields.io/badge/Powered%20by-Thirdweb-000000?style=flat)](https://thirdweb.com/)

## 🚀 项目简介

这是一个创新的AI Agent驱动的信息付费系统，解决了传统模式中"Access = Pay"的问题，实现"Useful = Pay"的智能付费机制。

**核心特性:**
- 🤖 **智能Agent**: 3种不同策略的AI Agent (探索者/交易员/投资者)
- 💰 **微支付**: 基于Monad的x402 Micropayment协议
- 🎯 **后付费验证**: 先获取内容，再判断价值
- ⚡ **高性能**: Monad 10,000 TPS区块链网络

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React前端      │    │  Express后端    │    │  Monad网络      │
│                 │    │                 │    │                 │
│ • Agent选择      │◄──►│ • x402支付处理  │◄──►│ • 微支付执行    │
│ • 信息流展示     │    │ • 内容数据库    │    │ • Gas费~0      │
│ • 交易监控       │    │ • 健康检查      │    │ • 即时确认      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 16
- MetaMask 或其他Web3钱包
- Monad Testnet USDC (测试代币)

### 1. 克隆项目

```bash
git clone <repository-url>
cd agent-info-shopper-x402
```

### 2. 配置环境变量

创建 `server/.env` 文件：

```bash
# Thirdweb API密钥
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here

# Monad Testnet接收钱包
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc454e4438f44e

# 服务器端口
PORT=3000
```

### 3. 安装依赖

```bash
# 后端依赖
cd server && npm install

# 前端依赖
cd ../client && npm install
```

### 4. 启动演示

```bash
# 终端1: 启动后端
cd server && npm start

# 终端2: 启动前端
cd ../client && npm run dev
```

### 5. 访问应用

打开浏览器访问: **http://localhost:5173**

## 🧪 测试指南

### 自动测试
```bash
# 运行服务器测试
node test-server.js
```

### 手动测试步骤

1. **连接钱包**
   - 点击"🔌 连接MetaMask"
   - 切换到Monad Testnet网络
   - 确保有USDC测试代币

2. **选择AI Agent**
   - 博雅探索者: 学术导向
   - Alpha交易员: 投机导向
   - 长期价值投资者: 研究导向

3. **运行演示**
   - 点击"▶️ 开始Demo"
   - 观察智能决策和支付流程

### 预期结果

- ✅ Agent根据KPI智能筛选信息
- ✅ 只为真正有价值的内容付费
- ✅ 支付失败时自动重试
- ✅ 实时显示交易状态和统计

## 🎯 核心创新

### 传统模式 vs 我们的模式

| 方面 | 传统模式 | Agent Info Shopper |
|------|----------|-------------------|
| 付费时机 | 先付费后获取 | 先获取后付费 |
| 付费依据 | 访问权限 | 实际价值 |
| 成本控制 | 被动接受 | 智能决策 |
| 用户体验 | 信息过载 | 精准获取 |

### 技术亮点

- **智能预筛选**: Agent根据历史表现和KPI预判信息价值
- **微支付技术**: x402协议实现低成本即时支付
- **区块链优势**: Monad的高性能确保流畅体验
- **后评估机制**: 确保付费与价值完全匹配

## 📊 Agent策略详解

### 🎓 博雅探索者
- **KPI**: 新鲜度 • 知识完整度 • 好奇心满足
- **决策**: 偏好学术内容，重视知识积累
- **适用**: 科研人员，终身学习者

### 📈 Alpha交易员
- **KPI**: Alpha信号强度 • 交易执行 • 盈亏比
- **决策**: 追求高风险高回报的投资机会
- **适用**: 量化交易员，风险投资者

### 💎 长期价值投资者
- **KPI**: 内容深度 • 信噪比 • 研究价值
- **决策**: 重视深度研究和长期价值
- **适用**: 价值投资者，机构研究员

## 🔧 API文档

### 健康检查
```http
GET /health
```

响应:
```json
{
  "status": "✅ Server running",
  "chain": "Monad Testnet",
  "chainId": 10143,
  "recipientWallet": "0x...",
  "endpoints": [...]
}
```

### 内容获取 (需要支付)
```http
GET /content/{contentId}
Authorization: Bearer {x402-payment-token}
```

## 🛡️ 安全考虑

- 所有支付通过Thirdweb Facilitator处理
- 敏感配置通过环境变量管理
- 前端不存储私钥或敏感信息
- 支付失败时有完整重试和错误处理机制

## 🚧 已知限制

- 需要Web3钱包连接
- 依赖Monad Testnet可用性
- 演示数据为模拟内容
- 生产环境需要更多Agent类型

## 📈 未来扩展

- [ ] 支持更多AI Agent类型
- [ ] 集成真实信息源API
- [ ] 添加社交推荐功能
- [ ] 支持多链部署
- [ ] 实现Agent学习和进化

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

ISC License

## 🙏 致谢

- **Monad**: 提供高性能区块链基础设施
- **Thirdweb**: 优秀的Web3开发工具
- **x402 Protocol**: 革命性的微支付协议

---

**Built with ❤️ for Monad Hackerthon**

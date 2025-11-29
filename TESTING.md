# Agent Info Shopper - 测试指南

## 📋 测试前准备

### 1. 环境变量配置

创建 `server/.env` 文件：

```bash
# Thirdweb配置
THIRDWEB_SECRET_KEY=your_actual_thirdweb_secret_key

# Monad Testnet接收钱包
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc454e4438f44e

# 服务器端口
PORT=3000
```

### 2. 获取Thirdweb密钥

1. 访问 [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. 创建新项目或使用现有项目
3. 在 Settings > API Keys 中生成 Secret Key
4. 复制密钥到 `.env` 文件

### 3. Monad Testnet钱包

使用 Monad Testnet 的测试钱包地址，或从 Monad 水龙头获取测试代币。

## 🧪 测试流程

### 阶段1: 服务器测试

```bash
# 终端1: 启动服务器
cd server
npm start

# 终端2: 运行服务器测试
cd ..
node test-server.js
```

**预期结果:**
- ✅ 健康检查通过
- ✅ 内容端点返回402 (需要支付)
- ✅ 显示Monad Testnet信息

### 阶段2: 前端测试

```bash
# 终端3: 启动前端
cd client
npm install
npm run dev
```

**浏览器访问:** http://localhost:5173

### 阶段3: 完整功能测试

1. **连接钱包**
   - 点击"🔌 连接MetaMask"
   - 确保MetaMask连接到Monad Testnet
   - 确认有足够的USDC测试代币

2. **选择Agent**
   - 尝试不同的Agent (博雅探索者, Alpha交易员, 长期价值投资者)
   - 观察不同的决策逻辑

3. **运行Demo**
   - 点击"▶️ 开始Demo"
   - 观察支付流程:
     - Agent评估信息
     - 预付费决策
     - x402支付执行
     - 内容价值判断
     - 智能扣费/退款逻辑

## 🔍 关键测试点

### ✅ 核心功能验证

1. **Agent决策一致性**
   - Alpha交易员应该在alpha >= 4时预付费
   - 其他Agent按各自KPI决策

2. **支付流程完整性**
   - 显示"Monad支付中..."
   - Thirdweb Facilitator处理
   - Gas费用显示为~0
   - 交易哈希正确显示

3. **错误处理**
   - 支付失败时自动重试
   - 显示具体的错误原因
   - 不会因单次失败而崩溃

4. **状态管理**
   - Balance只在有用信息时扣费
   - 统计数据准确更新
   - 交易记录完整

### ⚠️ 已知限制 (Demo阶段正常)

- 需要真实的Monad Testnet环境
- 需要USDC测试代币
- 部分功能依赖Thirdweb服务可用性

## 🚨 故障排除

### 服务器启动失败
```bash
# 检查端口占用
lsof -i :3000

# 检查环境变量
cd server && node -e "console.log(require('dotenv').config())"
```

### 前端构建失败
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### 支付失败
- 确认MetaMask连接到Monad Testnet
- 检查USDC余额
- 验证THIRDWEB_SECRET_KEY配置
- 查看浏览器控制台错误信息

### 网络连接问题
- 确认服务器运行在localhost:3000
- 检查Vite代理配置
- 验证防火墙设置

## 📊 性能基准

**预期性能指标:**
- 服务器启动时间: < 5秒
- 页面加载时间: < 3秒
- 单次支付处理: < 10秒 (包括区块链确认)
- Demo完整运行: ~30秒

## 🎯 成功标准

✅ **服务器测试通过** - 健康检查和API响应正常
✅ **前端正常加载** - 无控制台错误
✅ **钱包连接成功** - MetaMask集成正常
✅ **支付流程完整** - 从评估到扣费的完整链路
✅ **Agent逻辑正确** - 决策和价值判断符合预期
✅ **错误处理优雅** - 失败时有重试和清晰提示

---

## 🔧 开发者调试

### 查看详细日志
```bash
# 服务器日志
cd server && npm start

# 前端日志
cd client && npm run dev
# 在浏览器F12控制台查看
```

### 重置测试环境
```bash
# 清理缓存
cd client && rm -rf node_modules/.vite
cd server && rm -rf node_modules

# 重新安装
cd client && npm install
cd server && npm install
```

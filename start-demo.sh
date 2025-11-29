#!/bin/bash

echo "🚀 Agent Info Shopper - 演示启动脚本"
echo "======================================"

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 检查环境变量
if [ ! -f "server/.env" ]; then
    echo ""
    echo "⚠️  警告: 未找到 server/.env 文件"
    echo "请创建 server/.env 文件并配置以下变量:"
    echo "THIRDWEB_SECRET_KEY=your_thirdweb_secret_key"
    echo "RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    echo "PORT=3000"
    echo ""
fi

# 启动服务器
echo ""
echo "🔧 启动后端服务器..."
cd server

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 启动服务器（后台运行）
echo "🌟 启动服务器在端口 3000..."
npm start &
SERVER_PID=$!

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 3

# 测试服务器健康状态
echo "📡 测试服务器健康状态..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 服务器启动成功!"
else
    echo "❌ 服务器启动失败，请检查配置"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

cd ..

# 启动前端
echo ""
echo "🎨 启动前端开发服务器..."
cd client

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

echo "🌐 启动前端在端口 5173..."
echo ""
echo "🎉 演示环境已启动!"
echo ""
echo "📱 打开浏览器访问: http://localhost:5173"
echo ""
echo "🛠️  服务器运行在: http://localhost:3000"
echo "📊 健康检查: http://localhost:3000/health"
echo ""
echo "⚡ 要停止演示，请按 Ctrl+C"
echo ""

npm run dev &
FRONTEND_PID=$!

# 等待用户中断
trap "echo ''; echo '🛑 正在停止演示...'; kill $SERVER_PID 2>/dev/null; kill $FRONTEND_PID 2>/dev/null; echo '✅ 演示已停止'; exit 0" INT

# 保持脚本运行
wait

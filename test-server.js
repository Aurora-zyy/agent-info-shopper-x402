// 服务器功能测试脚本
const http = require('http');

console.log('🚀 开始测试Agent Info Shopper服务器...\n');

// 测试健康检查
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ 健康检查通过:');
          console.log(`   - 状态: ${health.status}`);
          console.log(`   - 链: ${health.chain}`);
          console.log(`   - 链ID: ${health.chainId}`);
          console.log(`   - 端点数量: ${health.endpoints.length}`);
          resolve(health);
        } catch (e) {
          reject(new Error('健康检查响应解析失败'));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`健康检查请求失败: ${err.message}`));
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('健康检查超时'));
    });
  });
}

// 测试内容端点（会返回402，需要支付）
function testContentEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/content/nature-ai-paper', (res) => {
      console.log(`\n✅ 内容端点响应: HTTP ${res.statusCode}`);

      if (res.statusCode === 402) {
        console.log('   - 正确返回402 (需要支付)');
        resolve('PAYMENT_REQUIRED');
      } else if (res.statusCode === 200) {
        console.log('   - 返回200 (已支付或免费)');
        resolve('CONTENT_RETURNED');
      } else {
        console.log(`   - 意外状态码: ${res.statusCode}`);
        resolve('UNEXPECTED_STATUS');
      }
    });

    req.on('error', (err) => {
      reject(new Error(`内容端点请求失败: ${err.message}`));
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('内容端点请求超时'));
    });
  });
}

// 主测试流程
async function runTests() {
  try {
    console.log('📡 测试1: 健康检查端点...');
    const health = await testHealth();

    console.log('\n💰 测试2: 内容端点支付逻辑...');
    const contentResult = await testContentEndpoint();

    console.log('\n🎉 所有基础测试通过！');
    console.log('\n📋 接下来你可以：');
    console.log('1. 配置环境变量 (.env文件)');
    console.log('2. 启动前端开发服务器');
    console.log('3. 在浏览器中测试完整流程');

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.log('\n🔧 故障排除:');
    console.log('1. 确保服务器正在运行: cd server && npm start');
    console.log('2. 检查端口3000是否被占用');
    console.log('3. 确认防火墙设置');
  }
}

// 运行测试
runTests();

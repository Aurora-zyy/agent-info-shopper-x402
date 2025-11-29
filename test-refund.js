// 测试退款端点
const http = require('http');

console.log('🚀 测试退款端点...\n');

function testRefundEndpoint() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      transactionHash: '0x123abc456def789xyz',
      contentId: 'test-content-1',
      amount: '$0.0001'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/refund',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ 退款端点响应: HTTP ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log('📋 响应数据:');
          console.log(`   - 状态: ${response.success ? '成功' : '失败'}`);
          console.log(`   - 退款金额: ${response.refundAmount}`);
          console.log(`   - 原始TX: ${response.originalTxHash}`);
          console.log(`   - 退款TX: ${response.refundTxHash}`);
          resolve('REFUND_SUCCESS');
        } catch (e) {
          reject(new Error('响应解析失败: ' + e.message));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`请求失败: ${err.message}`));
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(postData);
    req.end();
  });
}

// 运行测试
async function runTest() {
  try {
    console.log('📡 测试1: 退款端点可用性...');
    const result = await testRefundEndpoint();
    console.log('\n🎉 退款端点测试通过！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    console.log('\n🔧 故障排除:');
    console.log('1. 确保服务器正在运行: cd server && npm start');
    console.log('2. 检查端口3000是否被占用');
    process.exit(1);
  }
}

runTest();

import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { createWallet } from "thirdweb/wallets";
import { agents } from "./agents/agentConfig";
import { mockInfoItems } from "./mockData";

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});

export default function App() {
  const [selectedAgent, setSelectedAgent] = useState(agents.alphaTrader);
  const [wallet, setWallet] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const [transactions, setTransactions] = useState([]);
  const [agentThinking, setAgentThinking] = useState(
    "👋 选择一个Agent并连接钱包开始Demo"
  );
  const [balance, setBalance] = useState(0.01);
  const [stats, setStats] = useState({
    browsed: 0,
    useful: 0,
    notUseful: 0,
    skipped: 0,
  });

  const connectWallet = async () => {
    try {
      setAgentThinking("🔌 正在连接MetaMask...");
      const w = createWallet("io.metamask");
      await w.connect({ client });
      setWallet(w);
      setAgentThinking("✅ 钱包已连接！点击'开始Demo'运行自动化流程");
    } catch (error) {
      setAgentThinking(`❌ 钱包连接失败: ${error.message}`);
      console.error("Wallet connection error:", error);
    }
  };

  const runAgentDemo = async () => {
    if (!wallet) {
      alert("请先连接钱包！");
      return;
    }

    setIsRunning(true);
    setTransactions([]);
    setCurrentItemIndex(-1);
    setStats({ browsed: 0, useful: 0, notUseful: 0, skipped: 0 });

    for (let i = 0; i < mockInfoItems.length; i++) {
      const item = mockInfoItems[i];
      setCurrentItemIndex(i);

      setAgentThinking(
        `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🤔 [${i + 1}/${
          mockInfoItems.length
        }] 评估: ${item.title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━`
      );
      await sleep(1500);

      const shouldPay = selectedAgent.shouldPrePay(item);

      if (!shouldPay) {
        setAgentThinking(
          `❌ 跳过: 不符合 ${selectedAgent.name} 的KPI标准\n   原因: 新鲜度/深度/Alpha不足`
        );
        addTransaction({
          item: item.title,
          action: "SKIPPED",
          cost: 0,
          reason: "不符合KPI标准",
        });
        setStats((s) => ({
          ...s,
          browsed: s.browsed + 1,
          skipped: s.skipped + 1,
        }));
        await sleep(2000);
        continue;
      }

      setAgentThinking(
        `✅ 符合标准！\n   准备通过Monad x402支付 ${item.price} USDC...`
      );
      await sleep(1500);

      try {
        // 支付重试机制
        let res;
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
          try {
            setAgentThinking(
              `⚡ Monad支付中${
                retryCount > 0 ? ` (重试 ${retryCount}/${maxRetries})` : ""
              }...\n   使用Thirdweb Facilitator\n   Gas: ~0 (Facilitator处理)`
            );

            const fetchPay = wrapFetchWithPayment(fetch, client, wallet);
            res = await fetchPay(item.x402Endpoint);

            if (res.ok) break; // 支付成功，跳出重试循环

            if (res.status === 402 || res.status === 500) {
              // 402表示需要支付，500表示服务器错误，可以重试
              retryCount++;
              if (retryCount <= maxRetries) {
                setAgentThinking(
                  `⚠️ 支付失败，正在重试... (${retryCount}/${maxRetries})`
                );
                await sleep(1000);
                continue;
              }
            }

            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          } catch (error) {
            if (retryCount >= maxRetries) {
              throw error; // 重试次数用完，抛出错误
            }
            retryCount++;
            await sleep(1000);
          }
        }

        const paidContent = await res.json();

        setAgentThinking(
          `✅ 支付成功！\n   TX: ${paidContent.transactionHash?.slice(
            0,
            20
          )}...\n   已获取内容，开始深度分析...`
        );
        await sleep(1500);

        setAgentThinking(
          `🔍 深度分析中...\n   判断信息是否真正对 ${selectedAgent.name} 有用...`
        );
        await sleep(2000);

        const isUseful = await selectedAgent.isInfoUseful(item, paidContent);

        if (isUseful) {
          setAgentThinking(
            `🎉 Useful Info!\n   ✓ 信息产生了实际价值\n   ✓ 符合Agent的行为标准\n   💸 已通过Monad支付 ${item.price}`
          );
          // 只有确认有用时才从预算中扣除（代表真正的价值消费）
          const cost = parseFloat(item.price.replace("$", ""));
          setBalance((prev) => prev - cost);

          addTransaction({
            item: item.title,
            action: "USEFUL_INFO",
            cost: cost,
            txHash: paidContent.transactionHash,
            reason: "✅ 产生了实际价值",
          });
          setStats((s) => ({
            ...s,
            browsed: s.browsed + 1,
            useful: s.useful + 1,
          }));
        } else {
          setAgentThinking(
            `⚠️ Not Useful Info!\n   ✗ 虫然支付了，但信息对Agent无用\n   ✗ 未产生实际行为\n   💰 正在申请退款 ${item.price}...`
          );
          await sleep(1500);

          // 执行退款
          try {
            const refundResponse = await fetch(
              "http://localhost:3000/refund",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  transactionHash: paidContent.transactionHash,
                  contentId: item.id,
                  amount: item.price,
                }),
              }
            );

            if (refundResponse.ok) {
              const refundData = await refundResponse.json();
              setAgentThinking(
                `✅ 退款成功!\n   TX: ${refundData.refundTxHash?.slice(0, 20)}...\n   退回了 ${refundData.refundAmount}`
              );
            } else {
              throw new Error("退款请求失败");
            }
          } catch (refundError) {
            console.error("退款处理错误:", refundError);
            setAgentThinking(
              `❌ 退款失败\n   原因: ${refundError.message}\n   手动联系支持`
            );
          }

          await sleep(1500);

          addTransaction({
            item: item.title,
            action: "NOT_USEFUL_INFO",
            cost: 0,
            txHash: paidContent.transactionHash,
            reason: "❌ 已支付但信息无用✅已退款",
          });
          setStats((s) => ({
            ...s,
            browsed: s.browsed + 1,
            notUseful: s.notUseful + 1,
          }));
        }

        await sleep(2500);
      } catch (error) {
        let errorReason = error.message;
        if (error.message.includes("402")) {
          errorReason = "支付被拒绝 - 余额不足或网络拥堵";
        } else if (error.message.includes("500")) {
          errorReason = "服务器错误 - 请稍后重试";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorReason = "网络连接错误 - 请检查网络连接";
        }

        setAgentThinking(
          `❌ 支付失败\n   原因: ${errorReason}\n   错误详情: ${error.message}`
        );
        addTransaction({
          item: item.title,
          action: "PAYMENT_FAILED",
          cost: 0,
          reason: errorReason,
        });
        setStats((s) => ({
          ...s,
          browsed: s.browsed + 1,
          skipped: s.skipped + 1,
        }));
        await sleep(3000); // 失败时停顿更久，让用户看到错误信息
      }
    }

    setIsRunning(false);
    setCurrentItemIndex(-1);

    const usefulRate =
      stats.useful > 0
        ? ((stats.useful / (stats.useful + stats.notUseful)) * 100).toFixed(0)
        : 0;

    setAgentThinking(`
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Demo完成！
━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 最终统计:
   • 浏览: ${stats.browsed} 条
   • 有用信息: ${stats.useful} 条
   • 无用信息: ${stats.notUseful} 条
   • 跳过: ${stats.skipped} 条
   • 信息有效率: ${usefulRate}%

💡 核心观点:
   传统模式: Access = Pay (${stats.useful + stats.notUseful}次付费)
   我们的模式: Useful = Pay (${stats.useful}次付费)
   节省: ${stats.notUseful}次无效支付
━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  };

  const addTransaction = (tx) => {
    setTransactions((prev) => [
      ...prev,
      {
        ...tx,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const usefulRate =
    stats.useful + stats.notUseful > 0
      ? ((stats.useful / (stats.useful + stats.notUseful)) * 100).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Agent Info Shopper
            </h1>
            <p className="text-gray-400">
              Pay only for{" "}
              <span className="text-green-400 font-semibold">Useful Info</span>,
              not just Access
            </p>
          </div>

          {!wallet ? (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              🔌 连接MetaMask
            </button>
          ) : (
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-green-500">
              <div className="text-xs text-gray-400">钱包状态</div>
              <div className="text-green-400 font-semibold">✅ 已连接</div>
            </div>
          )}
        </div>

        {/* Agent Selection */}
        <div className="flex gap-4">
          {Object.values(agents).map((agent) => (
            <button
              key={agent.id}
              onClick={() => !isRunning && setSelectedAgent(agent)}
              disabled={isRunning}
              className={`flex-1 px-6 py-4 rounded-lg transition-all ${
                selectedAgent.id === agent.id
                  ? `bg-${agent.color}-600 ring-2 ring-${agent.color}-400 shadow-lg`
                  : "bg-gray-700 hover:bg-gray-600"
              } ${
                isRunning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="text-3xl mb-2">{agent.avatar}</div>
              <div className="font-bold">{agent.name}</div>
              <div className="text-xs text-gray-300 mt-1">
                {agent.description}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                KPI: {agent.kpis.join(" • ")}
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-3 gap-6 h-[650px]">
        {/* Left: Info Feed */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-5 overflow-y-auto border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📰</span> 信息流
          </h2>
          {mockInfoItems.map((item, idx) => (
            <div
              key={item.id}
              className={`mb-4 p-4 rounded-lg border-2 transition-all ${
                idx === currentItemIndex && isRunning
                  ? "border-yellow-400 bg-yellow-900/20 shadow-lg shadow-yellow-500/50"
                  : "border-gray-700 bg-gray-900/50"
              }`}
            >
              <div className="font-bold text-sm mb-1">{item.title}</div>
              <div className="text-xs text-gray-400 mb-2">
                {item.source} • {item.type}
              </div>
              <div className="text-xs flex gap-3 mb-2">
                <span>🆕 {item.freshness}/5</span>
                <span>📊 {item.depth}/5</span>
                <span>📈 {item.alpha}/5</span>
              </div>
              <div className="text-xs text-green-400 font-semibold">
                💰 {item.price} USDC (Monad x402)
              </div>
            </div>
          ))}
        </div>

        {/* Middle: Agent Thinking */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
            <div className="text-5xl">{selectedAgent.avatar}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
              <p className="text-sm text-gray-400">
                {selectedAgent.description}
              </p>
            </div>
          </div>

          <div className="bg-black/80 p-4 rounded-lg font-mono text-xs h-[450px] overflow-y-auto border border-gray-700">
            <pre className="text-green-400 whitespace-pre-wrap">
              {agentThinking}
            </pre>
          </div>

          <button
            onClick={runAgentDemo}
            disabled={isRunning || !wallet}
            className={`w-full mt-4 px-4 py-3 rounded-lg font-bold transition-all ${
              isRunning || !wallet
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            }`}
          >
            {isRunning ? "⏳ 运行中..." : "▶️ 开始Demo (自动化30秒)"}
          </button>
        </div>

        {/* Right: Transaction Dashboard */}
        <div className="bg-gray-800/50 backdrop-blur rounded-lg p-5 overflow-y-auto border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💰</span> 交易看板
          </h2>

          {/* Balance */}
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-4 rounded-lg mb-4 border border-green-700">
            <div className="text-xs text-gray-400 mb-1">信息预算 (USDC)</div>
            <div className="text-3xl font-bold text-green-400">
              ${balance.toFixed(4)}
            </div>
            <div className="text-xs text-gray-400 mt-1">只扣除有用信息费用</div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-3">本次统计</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400 text-xs">浏览</div>
                <div className="font-bold text-lg">{stats.browsed}</div>
              </div>
              <div className="bg-green-900/30 p-2 rounded">
                <div className="text-gray-400 text-xs">有用</div>
                <div className="font-bold text-lg text-green-400">
                  {stats.useful}
                </div>
              </div>
              <div className="bg-red-900/30 p-2 rounded">
                <div className="text-gray-400 text-xs">无用</div>
                <div className="font-bold text-lg text-red-400">
                  {stats.notUseful}
                </div>
              </div>
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400 text-xs">跳过</div>
                <div className="font-bold text-lg">{stats.skipped}</div>
              </div>
            </div>

            {stats.useful + stats.notUseful > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">信息有效率</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {usefulRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${usefulRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <div className="text-sm text-gray-400 mb-3 flex items-center justify-between">
              <span>交易记录</span>
              <span className="text-xs">{transactions.length} 条</span>
            </div>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  暂无交易记录
                  <br />
                  点击"开始Demo"运行
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-xs border transition-all ${
                      tx.action === "USEFUL_INFO"
                        ? "bg-green-900/30 border-green-700"
                        : tx.action === "NOT_USEFUL_INFO"
                        ? "bg-red-900/30 border-red-700"
                        : "bg-gray-800/50 border-gray-700"
                    }`}
                  >
                    <div className="font-bold truncate mb-1">{tx.item}</div>
                    <div className="text-gray-400 text-xs mb-1">
                      {tx.reason}
                    </div>
                    {tx.cost > 0 && (
                      <div className="text-red-400 font-semibold">
                        -${tx.cost.toFixed(4)}
                      </div>
                    )}
                    {tx.txHash && (
                      <div className="text-blue-400 truncate text-xs mt-1">
                        TX: {tx.txHash.slice(0, 15)}...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-4">
          <span>⚡ Powered by Monad (10,000 TPS)</span>
          <span>•</span>
          <span>💳 x402 Micropayments</span>
          <span>•</span>
          <span>🛠️ Thirdweb Facilitator</span>
        </div>
      </footer>
    </div>
  );
}

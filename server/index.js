require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createThirdwebClient } = require("thirdweb");
const { facilitator, settlePayment } = require("thirdweb/x402");
const { defineChain } = require("thirdweb/chains");

const app = express();
app.use(express.json());
app.use(cors());

// Monad Testnet配置
const monadTestnet = defineChain(10143);

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "demo_key_for_testing",
});

const twFacilitator = facilitator({
  client,
  serverWalletAddress:
    process.env.RECIPIENT_WALLET ||
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
});

// 模拟内容数据库
const contentDatabase = {
  "nature-ai-paper": {
    title: "AI Scaling Laws Breakthrough",
    fullContent:
      "Recent findings show that transformer models scale predictably with compute, data, and model size. This comprehensive study analyzed over 500 experiments across different architectures and found that performance improvements follow a power law relationship with these three factors. The implications for AI development are profound, suggesting that continued scaling will yield consistent improvements in capabilities. Key findings include: 1) Compute requirements grow exponentially for linear performance gains, 2) Data quality matters more than quantity beyond certain thresholds, 3) Optimal model size depends on available compute budget. These insights guide future AI research directions and investment decisions.",
    metadata: {
      citations: 234,
      impact: "high",
      publishDate: "2024-11",
      authors: ["OpenAI Research", "DeepMind"],
      keywords: ["scaling laws", "transformers", "compute efficiency"],
    },
  },

  "solana-dex-data": {
    title: "Solana DEX Real-time Trading Data",
    fullContent: {
      volume24h: "$2.3B",
      volumeChange: "+45%",
      topPairs: [
        { pair: "SOL/USDC", volume: "$890M", change: "+23%" },
        { pair: "JUP/SOL", volume: "$456M", change: "+67%" },
        { pair: "BONK/SOL", volume: "$234M", change: "+12%" },
      ],
      signal: "STRONG_BUY",
      confidence: 0.87,
      reasoning:
        "Massive volume surge indicates strong buying pressure. Jupiter DEX showing 67% increase signals retail FOMO. Historical pattern suggests 2-3 day continuation.",
      priceTargets: {
        short: "$185",
        medium: "$210",
      },
    },
  },

  "climate-report": {
    title: "Climate Tech Investment Report Q4 2024",
    fullContent:
      "Comprehensive 150-page analysis of climate technology sector performance and outlook. Executive Summary: Climate tech funding reached $32B in Q4 2024, up 28% YoY despite broader market correction. Key trends include: Solar deployment +45% YoY with module costs down 18%, battery energy storage capacity doubled globally, carbon capture technology achieved $80/ton economics making it commercially viable. Investment highlights: Series A rounds averaged $45M vs $32M in 2023, corporate venture participation increased to 34% of deals, public market climate tech index outperformed S&P 500 by 12%. Sector outlook remains strong with policy tailwinds from IRA credits and EU Green Deal.",
    keyInsights: [
      "Solar +45% YoY deployment growth",
      "Battery tech breakthrough at scale",
      "Carbon capture now economically viable at $80/ton",
      "Climate tech outperforming broader market by 12%",
      "Average Series A up 40% to $45M",
    ],
    recommendedActions: [
      "Increase allocation to solar + storage combination plays",
      "Monitor carbon credit markets for entry points",
      "Focus on companies with IRA credit eligibility",
    ],
  },

  "musk-tweets": {
    title: "Elon Musk's Latest Tweet Collection",
    fullContent: [
      "Just another day at the everything app 🚀",
      "Cryptocurrency is the future of money... or is it? 🤔",
      "Mars colony construction begins 2026. Who's coming?",
      "AI will be smarter than any human by 2029",
      "Tesla sales exceeded all expectations this quarter!",
      "Random meme about Doge coin #ToTheMoon",
      "Meeting with world leaders about AI safety",
      "New Tesla model reveal next week - you won't believe it",
      "Thinking about launching a university",
      "Just played Elden Ring for 6 hours straight",
      "Neuralink trials going better than expected",
      "Why isn't anyone talking about the real issues?",
      "Space is the future. Earth is just the beginning.",
      "Working on something that will change everything...",
      "Good night Twitter, or X, or whatever we're calling it now",
    ],
    sentiment: "mixed",
    topics: ["AI", "Tesla", "SpaceX", "crypto", "gaming", "random"],
    newsValue: "low",
  },

  "monad-analysis": {
    title: "Monad Technical Deep Dive & Investment Thesis",
    fullContent:
      "Monad represents a significant technical innovation in EVM-compatible Layer 1 blockchains. Technical Analysis: Achieves 10,000 TPS through parallel execution while maintaining full EVM compatibility - a feat previously thought impossible. Key innovations include: 1) MonadBFT consensus with single-slot finality (~0.4s), 2) Deferred execution model allowing optimistic parallel processing, 3) Custom storage layer optimized for SSD performance. Market Position: Positioned to capture DeFi applications requiring high throughput without sacrificing composability. Comparable to Solana's performance but with Ethereum's developer ecosystem. Investment Thesis: If mainnet launch successful, potential 10-50x from current private market valuations. Risk factors include: execution complexity, competition from L2s, and dependence on DeFi market recovery.",
    technicalMetrics: {
      tps: 10000,
      blockTime: "0.4s",
      finality: "single-slot",
      evmCompatibility: "100%",
    },
    tradingImplications:
      "High conviction long-term hold. Potential 10x if mainnet succeeds. Accumulate on any private market opportunities.",
    competitiveAnalysis: {
      vs_Ethereum: "100x faster, same dev tools",
      vs_Solana: "EVM compatible, similar performance",
      vs_Arbitrum: "L1 vs L2 tradeoffs",
    },
  },

  "ai-startup-news": {
    title: "Stealth AI Startup Raises $100M Series A",
    fullContent:
      "According to sources familiar with the matter, a stealth-mode AI startup focused on enterprise automation has raised $100M in Series A funding led by Sequoia Capital. The company, rumored to be founded by former OpenAI researchers, is building autonomous AI agents for enterprise workflows. Limited public information available. Valuation estimated at $500M post-money.",
    signal: "BUY_SIGNAL",
    confidence: 0.65,
    reasoning:
      "Ex-OpenAI talent + Sequoia backing usually indicates strong potential, but lack of product details increases risk.",
  },

  "crypto-regulation": {
    title: "SEC Announces New Crypto Regulations Framework",
    fullContent:
      "The SEC today released a comprehensive framework for cryptocurrency regulation, clarifying the status of various digital assets. Key points: Bitcoin and Ethereum confirmed as commodities, not securities. DeFi protocols may require registration depending on level of decentralization. Stablecoins face new reserve requirements. The 64-page document provides much-needed clarity but also introduces compliance costs for smaller projects.",
    marketImpact:
      "Short-term bearish for altcoins, long-term bullish for institutional adoption",
    affectedTokens: ["ETH", "BTC", "DeFi tokens", "stablecoins"],
  },

  "quantum-computing": {
    title: "Google Achieves Quantum Supremacy Milestone",
    fullContent:
      "Google's quantum computing division announced achieving 'quantum advantage' in a practical application - solving a materials science problem 1000x faster than classical supercomputers. This marks the first commercially relevant quantum computation. Implications span drug discovery, materials science, and cryptography. The quantum computer used 127 qubits with error rates below critical thresholds. Industry experts predict commercial quantum applications within 3-5 years.",
    researchValue: "breakthrough",
    practicalApplications: [
      "drug discovery",
      "materials science",
      "optimization problems",
    ],
  },
};

// 通用x402端点处理器
async function handleX402Payment(req, res, contentId, price) {
  try {
    const result = await settlePayment({
      resourceUrl: `http://localhost:3000/content/${contentId}`,
      method: "GET",
      paymentData: req.headers["x-payment"],
      network: monadTestnet,
      price: price,
      payTo: process.env.RECIPIENT_WALLET,
      facilitator: twFacilitator,
    });

    if (result.status === 200) {
      console.log(
        `✅ Payment successful for ${contentId}: ${result.transactionHash}`
      );
      res.json({
        success: true,
        content: contentDatabase[contentId],
        transactionHash: result.transactionHash,
        paidAmount: price,
        timestamp: new Date().toISOString(),
        contentId: contentId,
      });
    } else {
      console.log(`💰 Payment required for ${contentId}: ${price}`);
      res
        .status(result.status)
        .set(result.responseHeaders || {})
        .json(result.responseBody);
    }
  } catch (e) {
    console.error(`❌ Payment error for ${contentId}:`, e);
    res.status(500).json({
      error: "Payment processing failed",
      details: e.message,
    });
  }
}

// x402支付端点
app.get("/content/nature-ai-paper", (req, res) =>
  handleX402Payment(req, res, "nature-ai-paper", "$0.0001")
);

app.get("/content/solana-dex-data", (req, res) =>
  handleX402Payment(req, res, "solana-dex-data", "$0.0002")
);

app.get("/content/climate-report", (req, res) =>
  handleX402Payment(req, res, "climate-report", "$0.0005")
);

app.get("/content/musk-tweets", (req, res) =>
  handleX402Payment(req, res, "musk-tweets", "$0.00005")
);

app.get("/content/monad-analysis", (req, res) =>
  handleX402Payment(req, res, "monad-analysis", "$0.0003")
);

app.get("/content/ai-startup-news", (req, res) =>
  handleX402Payment(req, res, "ai-startup-news", "$0.00015")
);

app.get("/content/crypto-regulation", (req, res) =>
  handleX402Payment(req, res, "crypto-regulation", "$0.00025")
);

app.get("/content/quantum-computing", (req, res) =>
  handleX402Payment(req, res, "quantum-computing", "$0.0004")
);

// 退款处理端点
app.post("/refund", async (req, res) => {
  try {
    const { transactionHash, contentId, amount } = req.body;

    if (!transactionHash || !contentId || !amount) {
      return res.status(400).json({
        error: "Missing required fields: transactionHash, contentId, amount",
      });
    }

    console.log(
      `💰 Processing refund for ${contentId}: ${amount} (TX: ${transactionHash})`
    );

    // 在实际应用中，这里会调用 x402 的 refundPayment 接口
    // 当前为演示，直接返回退款成功
    // TODO: 集成真实的 x402 refundPayment 调用
    res.json({
      success: true,
      refundAmount: amount,
      originalTxHash: transactionHash,
      refundTxHash: `0x${Math.random().toString(16).slice(2)}`,
      contentId: contentId,
      timestamp: new Date().toISOString(),
      message: "✅ 退款已提交（演示环境）",
    });
  } catch (error) {
    console.error("❌ Refund processing error:", error);
    res.status(500).json({
      error: "Refund processing failed",
      details: error.message,
    });
  }
});

// 健康检查
app.get("/health", (req, res) => {
  res.json({
    status: "✅ Server running",
    chain: "Monad Testnet",
    chainId: 10143,
    recipientWallet: process.env.RECIPIENT_WALLET,
    endpoints: [
      "/content/nature-ai-paper",
      "/content/solana-dex-data",
      "/content/climate-report",
      "/content/musk-tweets",
      "/content/monad-analysis",
      "/content/ai-startup-news",
      "/content/crypto-regulation",
      "/content/quantum-computing",
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 Agent Info Shopper - x402 Server                      ║
║  ⚡ Running on http://localhost:${PORT}                      ║
║  💰 Recipient: ${process.env.RECIPIENT_WALLET?.slice(0, 10)}...           ║
║  🔗 Chain: Monad Testnet (10,000 TPS)                     ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log("\n📋 Available endpoints:");
  console.log("   GET /health");
  console.log("   GET /content/nature-ai-paper");
  console.log("   GET /content/solana-dex-data");
  console.log("   GET /content/climate-report");
  console.log("   GET /content/musk-tweets");
  console.log("   GET /content/monad-analysis");
  console.log("   GET /content/ai-startup-news");
  console.log("   GET /content/crypto-regulation");
  console.log("   GET /content/quantum-computing\n");
});

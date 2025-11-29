export const agents = {
  polymathExplorer: {
    id: "agent-a",
    name: "博雅探索者",
    avatar: "🎓",
    description: "多元背景的知识猎人",
    color: "purple",
    kpis: ["新鲜度", "知识拼图完整度", "好奇心满足"],

    shouldPrePay: (item) => {
      return (
        item.freshness >= 4 ||
        item.category === "academic" ||
        item.type === "paper"
      );
    },

    isInfoUseful: async (item, paidContent) => {
      await new Promise((r) => setTimeout(r, 500));

      if (item.type === "social") return false;
      if (item.depth < 3) return false;

      const hasNewInsights = paidContent.content?.fullContent?.length > 500;
      const isAcademic = item.category === "academic";

      return hasNewInsights && (isAcademic || item.depth >= 4);
    },
  },

  alphaTrader: {
    id: "agent-b",
    name: "Alpha交易员",
    avatar: "📈",
    description: "一级市场投机者 | AI & Crypto",
    color: "green",
    kpis: ["Alpha信号强度", "交易执行", "盈亏比"],

    shouldPrePay: (item) => {
      // 只预付费有Alpha信号的加密/AI内容
      return (
        (item.category === "crypto" || item.category === "ai") &&
        item.alpha >= 4
      );
    },

    isInfoUseful: async (item, paidContent) => {
      await new Promise((r) => setTimeout(r, 500));

      const content = paidContent.content?.fullContent;

      // 标准化决策：只有强买信号且高置信度才认为有用
      if (typeof content === "object" && content.signal) {
        const signal = content.signal;
        const confidence = content.confidence || 0;

        const willTrade =
          (signal === "STRONG_BUY" || signal === "BUY_SIGNAL") &&
          confidence > 0.7;

        if (willTrade) {
          console.log(
            `🔥 [${item.title}] 执行交易: ${signal} (置信度: ${confidence})`
          );
          return true;
        } else {
          // 有信号但不满足置信度要求，返回false以触发退款
          console.log(
            `⚠️ [${item.title}] 信号 ${signal} 但置信度不足 (${confidence})`
          );
          return false;
        }
      }

      // 没有明确的trading signal，判定为无用（不支持退款）
      return false;
    },
  },

  longTermInvestor: {
    id: "agent-c",
    name: "长期价值投资者",
    avatar: "💎",
    description: "二级市场 | 深度研究导向",
    color: "blue",
    kpis: ["内容深度", "信噪比", "研究价值"],

    shouldPrePay: (item) => {
      return (
        item.depth >= 4 &&
        (item.type === "paper" ||
          item.type === "report" ||
          item.type === "research")
      );
    },

    isInfoUseful: async (item, paidContent) => {
      await new Promise((r) => setTimeout(r, 500));

      const isHighQuality = item.depth >= 5;
      const content = paidContent.content;
      const hasKeyInsights = content?.keyInsights?.length > 2;
      const hasResearchValue =
        content?.researchValue === "breakthrough" ||
        content?.tradingImplications;

      const addedToResearch =
        (isHighQuality && hasKeyInsights) || hasResearchValue;

      if (addedToResearch) {
        console.log(`📚 [${item.title}] 加入研究库`);
        return true;
      }

      return false;
    },
  },
};

"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Lock,
  PlusCircle,
  Download,
  Trash2,
  Brain,
  Target,
  BarChart3,
  Clock,
  Sun,
  Moon,
} from "lucide-react";

const CHECKLIST_DATA = [
  {
    id: "1",
    label: "15-Minute Office Reset Complete",
    subline:
      "Office ka kaam band karne ke baad kam se kam 15 min ka break liya hai aur dimag shant hai",
    category: "1. Mental & Session",
  },
  {
    id: "2",
    label: "Daily Loss/Trade Limit Safe Hai",
    subline:
      "Daily stop-loss hit nahi hua hai aur max 2–3 trades ki limit bachi hai",
    category: "1. Mental & Session",
  },
  {
    id: "3",
    label: "HTF Trendline / S&R / 3-Touch Point Aligned",
    subline:
      "Higher Timeframe Trendline, key S&R zone, ya 3rd Touch Point confirmation mil chuka hai",
    category: "2. Strategy & Timeframe",
  },
  {
    id: "4",
    label: "Order Block / 3-Candle Liquidity Sweep Confirmed",
    subline:
      "Selected timeframe (1M/5M/15M/30M/1H) par clean 3-Candle Sweep ya Order Block rejection hai",
    category: "2. Strategy & Timeframe",
  },
  {
    id: "5",
    label: "One-Click Trading OFF Hai",
    subline:
      "Order lene se pehle confirmation pop-up screen dikh rahi hai",
    category: "3. Execution Safety",
  },
  {
    id: "6",
    label: "Lot Size Sirf 0.01 Verify Kiya",
    subline:
      "Volume box me 0.01 hi likha hai (0.1 ya 0.3 ki koi galti nahi hai)",
    category: "3. Execution Safety",
  },
  {
    id: "7",
    label: "Hard Stop-Loss (SL) aur Take-Profit (TP) Set",
    subline:
      "Order lagate hi SL aur TP system me daal diya hai — bina SL ke koi trade nahi",
    category: "3. Execution Safety",
  },
  {
    id: "8",
    label: "Profit Skimming Rule Follow Kiya",
    subline:
      "Account 50%–100% badhne par base capital withdraw kar liya hai",
    category: "4. Post-Trade",
  },
];

const CATEGORIES = [
  "1. Mental & Session",
  "2. Strategy & Timeframe",
  "3. Execution Safety",
  "4. Post-Trade",
];

const TRADE_STYLES = {
  Swing: ["30M", "1H"],
  Intraday: ["5M", "15M"],
  Scalping: ["1M", "5M"],
};

const STRATEGIES = [
  "HTF Trendline",
  "Support & Resistance",
  "3-Touch Points",
  "30M Setup",
  "3-Candle Liquidity Sweep",
];

const EMOTIONS = [
  { label: "Calm", safe: true },
  { label: "Confident", safe: true },
  { label: "Anxious", safe: false },
  { label: "Overconfident", safe: false },
  { label: "Revenge / FOMO", safe: false },
];

function getCurrentSessionIST() {
  // Current IST time nikalne ke liye
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istString);
  const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  // 05:30 AM (330 min) se 01:30 PM (810 min) -> Asia
  if (totalMinutes >= 330 && totalMinutes < 810) {
    return "Asia";
  }
  // 01:30 PM (810 min) se 06:30 PM (1110 min) -> London
  if (totalMinutes >= 810 && totalMinutes < 1110) {
    return "London";
  }
  // 06:30 PM (1110 min) se 05:30 AM -> NY
  return "NY";
}

export default function PreTradeChecklist() {
  const [darkMode, setDarkMode] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Market & Timeframe State
  const [session, setSession] = useState(() => getCurrentSessionIST());

  useEffect(() => {
    const interval = setInterval(() => {
      setSession(getCurrentSessionIST());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const [pair, setPair] = useState("XAUUSD");
  const [tradeStyle, setTradeStyle] = useState("Intraday");
  const [timeframe, setTimeframe] = useState("15M");

  // Strategy & Execution State
  const [strategy, setStrategy] = useState("3-Touch Points");
  const [direction, setDirection] = useState("BUY");
  const [lotSize, setLotSize] = useState("0.01");

  // Psychology State
  const [emotion, setEmotion] = useState("Calm");
  const [plannedTrade, setPlannedTrade] = useState("Yes");

  // Outcome & Review State
  const [outcome, setOutcome] = useState("Win");
  const [pnl, setPnl] = useState("");
  const [learning, setLearning] = useState("");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("journal_theme_mode");
      const savedChecklist = localStorage.getItem("pre_trade_checklist_v4");
      const savedJournal = localStorage.getItem("trading_journal_logs_v4");
      if (savedTheme !== null) setDarkMode(JSON.parse(savedTheme));
      if (savedChecklist) setCheckedItems(JSON.parse(savedChecklist));
      if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    } catch (e) {
      console.error("Failed to load storage:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("journal_theme_mode", JSON.stringify(darkMode));
    }
  }, [darkMode, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "pre_trade_checklist_v4",
        JSON.stringify(checkedItems)
      );
    }
  }, [checkedItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "trading_journal_logs_v4",
        JSON.stringify(journalEntries)
      );
    }
  }, [journalEntries, isLoaded]);

  const handleStyleChange = (style) => {
    setTradeStyle(style);
    setTimeframe(TRADE_STYLES[style][0]);
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetForm = () => {
    setCheckedItems({});
    setActiveCategory(CATEGORIES[0]);
    setEmotion("Calm");
    setPlannedTrade("Yes");
    setLotSize("0.01");
    setPnl("");
    setLearning("");
  };

  const totalItems = CHECKLIST_DATA.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const isChecklistDone = completedCount === totalItems;

  const selectedEmotionObj = EMOTIONS.find((e) => e.label === emotion);
  const isPsychologySafe = selectedEmotionObj?.safe && plannedTrade === "Yes";
  const isLotSafe = lotSize === "0.01";
  const isTradeUnlocked = isChecklistDone && isPsychologySafe && isLotSafe;

  const filteredItems = CHECKLIST_DATA.filter(
    (item) => item.category === activeCategory
  );

  const handleSaveJournal = (e) => {
    e.preventDefault();
    const numericPnl = pnl === "" ? 0 : parseFloat(pnl);

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      session,
      pair,
      tradeStyle,
      timeframe,
      strategy,
      direction,
      lotSize,
      emotion,
      outcome,
      pnl: numericPnl,
      learning: learning.trim() || `${strategy} (${timeframe}) followed`,
    };

    setJournalEntries((prev) => [newEntry, ...prev]);
    resetForm();
  };

  const deleteEntry = (id) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const exportToCSV = () => {
    if (journalEntries.length === 0) return;
    const headers = [
      "Date & Time",
      "Session",
      "Pair",
      "Style",
      "Timeframe",
      "Strategy",
      "Direction",
      "Lot",
      "Emotion",
      "Outcome",
      "PnL ($)",
      "Key Learning",
    ];
    const rows = journalEntries.map((entry) => [
      `"${entry.timestamp}"`,
      entry.session,
      entry.pair,
      entry.tradeStyle,
      entry.timeframe,
      `"${entry.strategy}"`,
      entry.direction,
      entry.lotSize,
      entry.emotion,
      entry.outcome,
      entry.pnl,
      `"${entry.learning.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Trading_Journal_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalNetPnl = journalEntries.reduce(
    (sum, item) => sum + (Number(item.pnl) || 0),
    0
  );
  const winCount = journalEntries.filter((i) => i.outcome === "Win").length;
  const winRate =
    journalEntries.length > 0
      ? Math.round((winCount / journalEntries.length) * 100)
      : 0;

  // Dynamic Theme Classes (Light & Dark Mode)
  const wrapperBg = darkMode ? "bg-[#131314]" : "bg-slate-100";
  const cardBg = darkMode
    ? "bg-[#1e1f20] border-[#2e3033] text-[#e3e3e3]"
    : "bg-white border-slate-200 text-slate-800";
  const subCardBg = darkMode
    ? "bg-[#161718] border-[#2e3033]"
    : "bg-slate-50 border-slate-200";
  const inputBg = darkMode
    ? "bg-[#252729] border-[#35373b] text-white"
    : "bg-white border-slate-300 text-slate-900";
  const pillInactive = darkMode
    ? "bg-[#252729] text-[#b0b3b8] hover:text-white"
    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900";
  const headingText = darkMode ? "text-white" : "text-slate-900";
  const mutedText = darkMode ? "text-[#9aa0a6]" : "text-slate-500";
  const dividerBorder = darkMode ? "border-[#2e3033]" : "border-slate-200";

  return (
    <div className={`min-h-screen w-full py-6 px-4 sm:px-6 transition-colors duration-200 ${wrapperBg}`}>
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* MAIN HYBRID JOURNAL CARD */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors ${cardBg}`}>
          {/* Title, Theme Toggle & Reset */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${dividerBorder}`}>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-emerald-500 font-semibold">
                Plan • Execute • Reflect • Improve
              </span>
              <h1 className={`text-xl sm:text-2xl font-semibold mt-0.5 ${headingText}`}>
                Smart Pre-Trade Checklist & Trading Journal
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Light / Dark Mode Switch */}
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition cursor-pointer ${
                  darkMode
                    ? "bg-[#2b2d30] border-[#3c4043] text-amber-300 hover:bg-[#37393d]"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
                title="Switch Light / Dark Mode"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  darkMode
                    ? "bg-[#2b2d30] hover:bg-[#37393d] text-[#c4c7c5]"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Form
              </button>
            </div>
          </div>

          {/* TOP CONTEXT BAR: SESSION | PAIR | TRADE STYLE & TIMEFRAME */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-5">
            {/* Market Session */}
            <div className={`border rounded-2xl p-3 ${subCardBg}`}>
              <label className={`block text-[11px] mb-1.5 ${mutedText}`}>
                Market Session
              </label>
              <div className="flex gap-1.5">
                {["Asia", "London", "NY"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSession(s)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      session === s
                        ? darkMode
                          ? "bg-[#3c4043] text-white"
                          : "bg-slate-800 text-white"
                        : `${mutedText} hover:opacity-80`
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument / Pair */}
            <div className={`border rounded-2xl p-3 ${subCardBg}`}>
              <label className={`block text-[11px] mb-1.5 ${mutedText}`}>
                Instrument / Pair
              </label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className={`w-full border rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500 ${inputBg}`}
              >
                <optgroup label="Commodities & Crypto">
                  <option value="XAUUSD">XAUUSD (Gold)</option>
                  <option value="BTCUSD">BTCUSD (Bitcoin)</option>
                </optgroup>
                <optgroup label="Indices">
                  <option value="US100">US100 / Nasdaq</option>
                  <option value="US30">US30 (Dow Jones)</option>
                </optgroup>
                <optgroup label="Forex Pairs">
                  <option value="GBPUSD">GBP/USD</option>
                  <option value="GBPJPY">GBP/JPY</option>
                  <option value="GBPNZD">GBP/NZD</option>
                  <option value="EURAUD">EUR/AUD</option>
                  <option value="EURUSD">EUR/USD</option>
                </optgroup>
              </select>
            </div>

            {/* Trade Style & Execution Timeframe */}
            <div className={`border rounded-2xl p-3 ${subCardBg}`}>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-[11px] flex items-center gap-1 ${mutedText}`}>
                  <Clock className="w-3 h-3 text-sky-500" /> Style & Timeframe
                </label>
                <div className="flex gap-1">
                  {TRADE_STYLES[tradeStyle].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                        timeframe === tf
                          ? "bg-sky-500/20 text-sky-500 border border-sky-500/40"
                          : pillInactive
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5">
                {Object.keys(TRADE_STYLES).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleChange(style)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      tradeStyle === style
                        ? darkMode
                          ? "bg-[#3c4043] text-white"
                          : "bg-slate-800 text-white"
                        : `${mutedText} hover:opacity-80`
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STRATEGY PILL SELECTOR (5 Setups Including 3-Touch Point) */}
          <div className={`border rounded-2xl p-3.5 mb-5 ${subCardBg}`}>
            <label className={`block text-[11px] mb-2 ${mutedText}`}>
              Active Setup / Strategy ({tradeStyle} • {timeframe})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {STRATEGIES.map((strat) => (
                <button
                  key={strat}
                  type="button"
                  onClick={() => setStrategy(strat)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium transition text-center cursor-pointer ${
                    strategy === strat
                      ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 font-semibold"
                      : pillInactive
                  }`}
                >
                  {strat}
                </button>
              ))}
            </div>
          </div>

          {/* TWO-COLUMN CORE: LEFT = EXECUTION PLAN & CHECKLIST | RIGHT = PSYCHOLOGY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5">
            {/* LEFT COLUMN (7 cols): TRADE EXECUTION & 8-RULE CHECKLIST */}
            <div className={`lg:col-span-7 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${subCardBg}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2 ${headingText}`}>
                    <Target className="w-4 h-4 text-emerald-500" />
                    Trade Execution (The Plan)
                  </h2>
                  <span className={`text-xs ${mutedText}`}>
                    {completedCount}/{totalItems} Rules Verified
                  </span>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar">
                  {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category;
                    const catItems = CHECKLIST_DATA.filter(
                      (i) => i.category === category
                    );
                    const catDone = catItems.every((i) => checkedItems[i.id]);

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? darkMode
                              ? "bg-[#3c4043] text-white"
                              : "bg-slate-800 text-white"
                            : `${mutedText} hover:opacity-80`
                        }`}
                      >
                        <span>{category}</span>
                        {catDone && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Active Category Items */}
                <div className="space-y-2.5 min-h-[165px]">
                  {filteredItems.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    const isLotCheck = item.id === "6";

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                          darkMode
                            ? isChecked
                              ? "bg-[#1e2022] border-transparent"
                              : "bg-[#1e1f20] border-[#2b2d30] hover:bg-[#252729]"
                            : isChecked
                            ? "bg-slate-100 border-slate-200"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <button
                          type="button"
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : darkMode
                              ? "border-[#747775]"
                              : "border-slate-400"
                          }`}
                        >
                          {isChecked && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-medium ${
                                isChecked
                                  ? "line-through opacity-50"
                                  : headingText
                              }`}
                            >
                              {item.label}
                            </span>
                            {isLotCheck && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                <Lock className="w-2.5 h-2.5" /> 0.01 LOCK
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${mutedText}`}>
                            {item.subline}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direction & Lot Size Row */}
              <div className={`grid grid-cols-2 gap-3 pt-4 mt-4 border-t ${dividerBorder}`}>
                <div>
                  <label className={`block text-[11px] mb-1 ${mutedText}`}>
                    Direction
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDirection("BUY")}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        direction === "BUY"
                          ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                          : pillInactive
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection("SELL")}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        direction === "SELL"
                          ? "bg-red-500/20 text-red-500 border border-red-500/40"
                          : pillInactive
                      }`}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] mb-1 ${mutedText}`}>
                    Position Size (Lots)
                  </label>
                  <input
                    type="text"
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-1.5 text-xs font-mono font-bold focus:outline-none ${
                      isLotSafe
                        ? `${inputBg} border-emerald-500/60 text-emerald-500`
                        : `${inputBg} border-red-500 text-red-500`
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (5 cols): TRADE PSYCHOLOGY (THE MIND) */}
            <div className={`lg:col-span-5 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between ${subCardBg}`}>
              <div className="space-y-4">
                <h2 className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2 ${headingText}`}>
                  <Brain className="w-4 h-4 text-purple-500" />
                  Trade Psychology (The Mind)
                </h2>

                {/* Emotion Before Entry */}
                <div>
                  <label className={`block text-xs mb-2 ${mutedText}`}>
                    My Emotion Before Entry:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTIONS.map((item) => {
                      const isSelected = emotion === item.label;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setEmotion(item.label)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? item.safe
                                ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 font-semibold"
                                : "bg-red-500/20 text-red-500 border border-red-500/50 font-semibold"
                              : pillInactive
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Planned Trade Toggle */}
                <div>
                  <label className={`block text-xs mb-2 ${mutedText}`}>
                    Was this a Planned Setup (No Impulse)?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPlannedTrade(opt)}
                        className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          plannedTrade === opt
                            ? opt === "Yes"
                              ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                              : "bg-red-500/20 text-red-500 border border-red-500/50"
                            : pillInactive
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Safety Gate Status */}
              <div
                className={`mt-5 p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  isTradeUnlocked
                    ? "bg-emerald-500/10 border-emerald-500/40"
                    : darkMode
                    ? "bg-[#1e1f20] border-amber-500/30"
                    : "bg-amber-50 border-amber-300"
                }`}
              >
                {isTradeUnlocked ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`text-xs font-semibold ${headingText}`}>
                    {isTradeUnlocked
                      ? `SAFE TO EXECUTE (${strategy} • ${timeframe})`
                      : "EXECUTION LOCKED"}
                  </p>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${mutedText}`}>
                    {!isLotSafe
                      ? "Lot size 0.01 par wapas set karein!"
                      : !isPsychologySafe
                      ? "Emotion 'Calm/Confident' aur Planned 'Yes' hona zaroori hai."
                      : !isChecklistDone
                      ? `Abhi ${totalItems - completedCount} checklist rules baki hain.`
                      : "Setup aur mindset dono verified hain. Trade ke baad niche log karein."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: TRADE OUTCOME & REVIEW FORM */}
          <form
            onSubmit={handleSaveJournal}
            className={`border rounded-2xl p-4 sm:p-5 ${subCardBg}`}
          >
            <h2 className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2 mb-3 ${headingText}`}>
              <BarChart3 className="w-4 h-4 text-sky-500" />
              Trade Outcome & Key Learning
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Result Buttons (Win / Loss / Breakeven) */}
              <div className="sm:col-span-4">
                <label className={`block text-[11px] mb-1 ${mutedText}`}>
                  Result
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Win", "Loss", "BE"].map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setOutcome(res)}
                      className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        outcome === res
                          ? res === "Win"
                            ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                            : res === "Loss"
                            ? "bg-red-500/20 text-red-500 border border-red-500/40"
                            : darkMode
                            ? "bg-[#3c4043] text-white"
                            : "bg-slate-800 text-white"
                          : pillInactive
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* P&L ($) */}
              <div className="sm:col-span-2">
                <label className={`block text-[11px] mb-1 ${mutedText}`}>
                  P&L ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="+15 or -6"
                  value={pnl}
                  onChange={(e) => setPnl(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${inputBg}`}
                />
              </div>

              {/* Key Learning */}
              <div className="sm:col-span-4">
                <label className={`block text-[11px] mb-1 ${mutedText}`}>
                  Key Learning / Setup Note
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${strategy} on ${timeframe} worked cleanly`}
                  value={learning}
                  onChange={(e) => setLearning(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${inputBg}`}
                />
              </div>

              {/* Save Button */}
              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={!isTradeUnlocked}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isTradeUnlocked
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                      : darkMode
                      ? "bg-[#2b2d30] text-[#6e7170] cursor-not-allowed"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Save Entry
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* SAVED JOURNAL HISTORY TABLE */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors ${cardBg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className={`text-lg font-medium ${headingText}`}>
                Saved Trading Journal ({journalEntries.length} Trades)
              </h2>
              <div className="flex items-center gap-4 text-xs mt-1">
                <span className={mutedText}>
                  Net P&L:{" "}
                  <strong
                    className={
                      totalNetPnl >= 0 ? "text-emerald-500" : "text-red-500"
                    }
                  >
                    {totalNetPnl >= 0
                      ? `+$${totalNetPnl.toFixed(2)}`
                      : `-$${Math.abs(totalNetPnl).toFixed(2)}`}
                  </strong>
                </span>
                <span className={mutedText}>
                  Win Rate: <strong className={headingText}>{winRate}%</strong>
                </span>
              </div>
            </div>

            {journalEntries.length > 0 && (
              <button
                type="button"
                onClick={exportToCSV}
                className={`inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-full text-xs font-medium transition cursor-pointer ${
                  darkMode
                    ? "bg-[#2b2d30] hover:bg-[#37393d] text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV (Excel)
              </button>
            )}
          </div>

          {journalEntries.length === 0 ? (
            <div className={`text-center py-8 text-sm border border-dashed rounded-2xl ${mutedText} ${dividerBorder}`}>
              Abhi tak koi trade save nahi hua hai. Upar apna setup aur rules
              verify karke pehla trade log karein.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] uppercase ${dividerBorder} ${mutedText}`}>
                    <th className="py-3 px-2">Time / Session</th>
                    <th className="py-3 px-2">Pair / TF</th>
                    <th className="py-3 px-2">Strategy</th>
                    <th className="py-3 px-2">Type / Lot</th>
                    <th className="py-3 px-2">Result / P&L</th>
                    <th className="py-3 px-2">Key Learning</th>
                    <th className="py-3 px-2 text-right">Del</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${dividerBorder}`}>
                  {journalEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={
                        darkMode ? "hover:bg-[#252729]/50" : "hover:bg-slate-50"
                      }
                    >
                      <td className={`py-3 px-2 whitespace-nowrap ${mutedText}`}>
                        <div>{entry.timestamp}</div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            darkMode
                              ? "bg-[#2b2d30] text-white"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {entry.session}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <div className={`font-semibold ${headingText}`}>
                          {entry.pair}
                        </div>
                        <span className="text-[10px] text-sky-500 font-medium">
                          {entry.tradeStyle} • {entry.timeframe}
                        </span>
                      </td>
                      <td className={`py-3 px-2 font-medium ${headingText}`}>
                        {entry.strategy}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`font-semibold px-1.5 py-0.5 rounded mr-1.5 ${
                            entry.direction === "BUY"
                              ? "bg-emerald-500/15 text-emerald-500"
                              : "bg-red-500/15 text-red-500"
                          }`}
                        >
                          {entry.direction}
                        </span>
                        <span className="font-mono text-amber-500 font-semibold">
                          {entry.lotSize}
                        </span>
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            entry.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {entry.outcome} (
                          {entry.pnl >= 0
                            ? `+$${Number(entry.pnl).toFixed(2)}`
                            : `-$${Math.abs(Number(entry.pnl)).toFixed(2)}`}
                          )
                        </span>
                      </td>
                      <td className={`py-3 px-2 max-w-[180px] truncate ${mutedText}`}>
                        {entry.learning}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => deleteEntry(entry.id)}
                          className="opacity-50 hover:opacity-100 hover:text-red-500 transition p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
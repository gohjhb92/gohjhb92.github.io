import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const symbols = {
  psychedelic: [
    { symbol: "ATAI", label: "AtaiBeckley", role: "Speculative core" },
    { symbol: "DFTX", label: "Definium Therapeutics", role: "Catalyst trade" },
    { symbol: "GHRS", label: "GH Research", role: "Quality science" }
  ],
  agri: [
    { symbol: "CORN", label: "Teucrium Corn Fund", role: "Corn futures proxy" },
    { symbol: "WEAT", label: "Teucrium Wheat Fund", role: "Wheat futures proxy" },
    { symbol: "SUGA.L", label: "WisdomTree Sugar", role: "Sugar ETC proxy" },
    { symbol: "USO", label: "United States Oil Fund", role: "Crude oil proxy" },
    { symbol: "UNG", label: "United States Natural Gas Fund", role: "Gas proxy" },
    { symbol: "MOS", label: "Mosaic", role: "Fertilizer equity proxy" },
    { symbol: "NTR", label: "Nutrien", role: "Fertilizer equity proxy" }
  ]
};

const quoteUrl = (symbol) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2d&interval=1d`;

async function fetchQuote(item) {
  const response = await fetch(quoteUrl(item.symbol), {
    headers: { "User-Agent": "Mozilla/5.0 market-monitor" }
  });

  if (!response.ok) {
    throw new Error(`${item.symbol} returned ${response.status}`);
  }

  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  const meta = result?.meta;

  if (!meta) {
    throw new Error(`${item.symbol} response missing chart metadata`);
  }

  const price = Number(meta.regularMarketPrice);
  const previousClose = Number(meta.chartPreviousClose);
  const change = Number.isFinite(price) && Number.isFinite(previousClose)
    ? price - previousClose
    : null;
  const changePercent = Number.isFinite(change) && previousClose
    ? (change / previousClose) * 100
    : null;

  return {
    symbol: item.symbol,
    label: item.label,
    role: item.role,
    currency: meta.currency || "USD",
    exchange: meta.fullExchangeName || meta.exchangeName || null,
    price,
    previousClose,
    change,
    changePercent,
    dayHigh: Number(meta.regularMarketDayHigh),
    dayLow: Number(meta.regularMarketDayLow),
    volume: Number(meta.regularMarketVolume),
    marketTime: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
    source: "Yahoo Finance chart API"
  };
}

async function fetchGroup(items) {
  const settled = await Promise.allSettled(items.map(fetchQuote));
  return settled.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      symbol: items[index].symbol,
      label: items[index].label,
      role: items[index].role,
      error: result.reason.message,
      source: "Yahoo Finance chart API"
    };
  });
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  timezone: "Asia/Singapore",
  source: "Yahoo Finance chart API",
  notes: [
    "Generated for GitHub Pages so article pages can load same-origin market snapshots without browser CORS failures.",
    "Quotes may be delayed and are for research context only, not financial advice."
  ],
  psychedelic: await fetchGroup(symbols.psychedelic),
  agri: await fetchGroup(symbols.agri)
};

const outputPath = "market-data/thesis-monitor.json";
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);

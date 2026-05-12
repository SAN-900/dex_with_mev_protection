import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect} from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { executeSwap, fetchEarnTokens, getTokenBalance, TokenInfo } from '@/lib/utils';
import TokenSelector from './tokenSelector';
import LazyTokenImage from '../lazy_image_loading';
import { useQuote } from '@/hooks/useQuote';

const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SAFE_SOL_FEE = 0.01;

export default function ExchangeFrame() {
    const wallet = useWallet();
    const {connection} = useConnection();

    const [swapLoading, setSwapLoading] = useState(false)

    const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

    const [selectingSide, setSelectingSide] = useState<"from" | "to" | null>(null);


    const [fromToken, setFromToken] = useState<TokenInfo | null>(null);
    const [toToken, setToToken] = useState<TokenInfo | null>(null);

    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");

    const [risk, setRisk] = useState<{ risk: number; level: string, confidence: number } | null>(null);
    const [autoProtect, setAutoProtect] = useState(true);

    const [walletBalance, setWalletBalance] = useState(0);
    const [slippage, setSlippage] = useState(0.5);
    const [error, setError] = useState("");

    const [halfClicked, setHalfClicked] = useState(false);
    const [maxClicked, setMaxClicked] = useState(false);

    const [selectorOpen, setSelectorOpen] = useState(false);
    const {quote, loading: quoteLoading, error: quoteError, isSameToken}= useQuote({fromToken, toToken, amount: fromAmount, slippage});

    // Load default tokens on mount
    useEffect(() => {
    const loadDefaultTokens = async () => {
      try {
        const tokens = await fetchEarnTokens();
        if (!tokens) {
          setError("Failed to fetch tokens");
          throw new Error("Failed to fetch tokens");
        }
        setTokenList(tokens);
        const sol = tokens.find((t) => t.id === SOL_MINT);
        const usdc = tokens.find((t) => t.id === USDC_MINT);

        if (!sol || !usdc) {
          setError("Default tokens not found");
          throw new Error("Default tokens not found");
        }

        setFromToken(sol);
        setToToken(usdc);
      } catch (error) {
        setError("Failed to load tokens. Please try refreshing the page.");
      }
    };

    loadDefaultTokens();
  }, []);

  // Fetch wallet balance
  useEffect(() => {
      if (!wallet.publicKey || !fromToken) return;

      let cancelled = false;
      (async () => {
          try {
            const bal = await getTokenBalance(
              connection,
              wallet.publicKey!,
              fromToken
            );
            if (!cancelled) setWalletBalance(bal);
          } catch (e) {
            console.error("Balance fetch failed", e);
            if (!cancelled) setWalletBalance(0);
          }
        })();

      return () => {
        cancelled = true;
      };
    }, [wallet.publicKey, fromToken, connection]);

  const usableBalance = fromToken?.id === SOL_MINT? Math.max(walletBalance - SAFE_SOL_FEE, 0): walletBalance;
  const insufficientBalance = Number(fromAmount) > usableBalance;

  

  const halfBalance = () => {
    setFromAmount((usableBalance / 2).toFixed(6));
    setHalfClicked(true);
    setMaxClicked(false);
    setError("");
  }

  const maxBalance = () => {
    setFromAmount((usableBalance.toFixed(6)));
    setMaxClicked(true);
    setHalfClicked(false);
    setError("");
  } 

  //API call
  const getRisk = async (data: any) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict-risk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      return res.json();
    };

  const buildRiskFeatures = (quote: any) => {
      const decimals = fromToken?.decimals || 6;

      const amount =
        Number(quote.inAmount) / Math.pow(10, decimals);

      const slippage = quote.slippageBps / 100;
      const priceImpact = Number(quote.priceImpactPct);

      const liquidity =
        priceImpact === 0 ? 1000000 : amount / priceImpact;

      return {
        amount,
        slippage,
        liquidity,
        priceImpact,
        routeComplexity: quote.routePlan?.length || 1
      };
    }; 

  // swap tokens from to to
  const handelSwapTokens = () => {
    if(!fromToken || !toToken) return;

    setFromToken(toToken);
    setToToken(fromToken);

    setFromAmount(toAmount);

    setError("");
  }

      // Quote fetch
  useEffect(() => {
      if (!quote || !toToken) {
        setToAmount("");
        return;
      }
      if(quoteError) {
        setError(quoteError);
        setToAmount("");
        return;
      }
      setToAmount(
        (Number(quote.outAmount) / 10 ** toToken.decimals).toString()
      );
    }, [toToken, quote]);

    useEffect(() => {
        if (!quote) return;

        const runRisk = async () => {
          const features = buildRiskFeatures(quote);

          const riskRes = await getRisk({
            amount: features.amount,
            slippage: features.slippage,
            liquidity: features.liquidity,
            priceImpact: features.priceImpact,
            routeComplexity: features.routeComplexity,
            instruction_count: quote?.routePlan?.length || 3,
            fee: quote?.contextSlot || 0
          });

          setRisk(riskRes);
          setError("");
        };

        runRisk();
      }, [quote]);

  // Swap
  const handleSwap = async () => {
      if (!fromToken || !toToken || !quote) {
        setError("Invalid swap data");
        return;
      }

      try {
        setSwapLoading(true);
        setError("");

        //Extract features
        const features = buildRiskFeatures(quote);

        //AI backend
        const riskRes = risk;
        if (!riskRes) {
          setError("Risk not calculated yet");
          setSwapLoading(false);
          return;
        }
        if (autoProtect) {

          // Hard block extremely unsafe swaps
          if (riskRes.risk > 0.95) {
            alert("Extremely unsafe trade blocked.");
            setSwapLoading(false);
            return;
          }

          // Strong protection for high risk
          if (riskRes.risk > 0.8) {

            if (features.routeComplexity > 5) {
              alert("Unsafe route detected. Try smaller trade.");
              setSwapLoading(false);
              return;
            }

            const proceed = confirm(
              `HIGH RISK DETECTED

        Potential MEV or liquidity instability detected.

        Proceed anyway?`
            );

            if (!proceed) {
              setSwapLoading(false);
              return;
            }
          }

          // Auto slippage protection
          if (riskRes.risk > 0.75) {

            const saferSlippage = 0.5;

            if (slippage !== saferSlippage) {

              setSlippage(saferSlippage);

              alert("AI Protection adjusted slippage for safer execution.");

              setSwapLoading(false);
              return;
            }
          }

        } else {

          // Auto-Protect OFF → warnings only
          if (riskRes.risk > 0.9) {

            const proceed = confirm(
              `WARNING

        High execution risk detected.

        Auto-Protect is disabled.

        Continue anyway?`
            );

            if (!proceed) {
              setSwapLoading(false);
              return;
            }
          }
        }

        const txid = await executeSwap(quote, connection, wallet);

        if (!txid) {
          setError("Swap failed");
        }

      } catch (error) {
        console.error(error);
        setError("Swap failed");
      } finally {
        setSwapLoading(false);
      }
    };
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div
        className="
          w-3/4
          h-full
          mx-auto
          rounded-2xl
          bg-amber-50
          dark:bg-neutral-900
          p-5
          md:p-7
          dark:text-white
          text-gray-700
          shadow-2xl
          border
          border-black/5
          dark:border-white/10
        "
      >

        {/* Header */}
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl mb-4 font-semibold dark:text-white">Exchange your credits</h1>
          <div
            className="
              px-3
              py-1
              border-cyan-500/20
              text-xs
              text-cyan-700
              dark:text-cyan-300
              font-medium
            "
          >slippage: {slippage}%
          </div>
        </div>

        {/* SELL */}
        <div className="rounded-xl dark:bg-blue-950 p-4 items-center-safe border-2 hover:border-b-cyan-500">
          <div className="flex justify-between text-sm mb-4 font-semibold ">
            <div className="
            sm:text-sm
            lg:text-lg
            font-semibold
            tracking-tight
            leading-[1.05]
            max-w-5xl">Sell</div>
              <div className="flex justify-between gap-2 dark:text-gray-400 text-gray-600">
                  Available: {usableBalance.toFixed(6)} {fromToken?.symbol}
                {fromToken?.id === SOL_MINT? <div className="flex gap-1">
                  <Button className={`bg-transparent border-2 text-gray-700 dark:text-amber-50 hover:bg-teal-200 dark:hover:bg-amber-700 ${halfClicked ? 'bg-teal-200 dark:!bg-amber-700' : ''}`} size="xs" onClick={halfBalance}>Half</Button>
                  <Button className={`bg-transparent border-2 text-gray-700 dark:text-amber-50 hover:bg-teal-200 dark:hover:bg-amber-700 ${maxClicked ? 'bg-teal-200 dark:!bg-amber-700' : ''}`} size="xs" onClick={maxBalance}>Max</Button>
                </div>: null}
            </div>
          </div>

            <div className="flex justify-between items-center gap-2">
             <TokenSelector
              open={selectorOpen}
              onClose={() => setSelectorOpen(false)}
              tokens={tokenList}
              selectedToken={selectingSide === "from" ? fromToken : toToken}
              onSelect={(token) => {
                if (selectingSide === "from") setFromToken(token);
                if (selectingSide === "to") setToToken(token);
              }}
            />
            <button
            onClick={() => { setSelectingSide("from"); setSelectorOpen(true); }}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 hover:border-teal-600 dark:bg-neutral-900"
          >
            <LazyTokenImage
              src={fromToken?.icon}
              alt={fromToken?.symbol}
            />
            <span className="font-semibold text-gray-700 dark:text-white">
              {fromToken?.symbol}
            </span>
          </button>
              <Input
                value={fromAmount}
                onChange={(e) => {setFromAmount(e.target.value); setHalfClicked(false); setMaxClicked(false);}}
                className="w-32 font-bold text-right hover:border-teal-600 focus:border-teal-600"
                placeholder="0.0"
              />
            </div>
        </div>
        <div className="flex items-center justify-center">
             <button
                onClick={handelSwapTokens}
                className="
                  group h-10 w-10 rounded-full
                  border border-blue-500/60
                  text-blue-400
                  flex items-center justify-center
                  dark:bg-neutral-900
                  hover:bg-blue-500/10
                  hover:shadow-[0_0_12px_rgba(59,130,246,0.6)]
                  transition-all duration-300
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7l4-4 4 4M12 3v14M16 17l-4 4-4-4"
                  />
                </svg>
              </button> 
        </div>

        {/* BUY */}
        <div className="rounded-xl dark:bg-slate-800 p-4 mb-4 border-2 hover:border-b-slate-500 font-semibold">
          <span className="
          flex mb-4
            sm:text-sm
            lg:text-lg
            font-semibold
            tracking-tight
            leading-[1.05]
            max-w-5xl">Buy</span>
         <div className="flex justify-between items-center gap-2">
            <button
            onClick={() => { setSelectingSide("to"); setSelectorOpen(true); }}
            className="flex items-center gap-2 rounded-xl border px-3 py-2 hover:border-teal-600 dark:bg-neutral-900"
          >
            <LazyTokenImage
              src={toToken?.icon}
              alt={toToken?.symbol}
            />
            <span className="font-semibold text-gray-700 dark:text-white">
              {toToken?.symbol}
            </span>
          </button>

              <Input
                value={toAmount}
                disabled
                className="w-32 text-right font-bold"
                placeholder="0.0"
              />
            </div> 
        </div>

        {error && (
          <div className="
            mt-3
            mb-3
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            p-3
          ">
              {error}
          </div>
        )}
        {/*Risk Display */}
        {risk && (
          <div className="mb-2 px-2 py-2 rounded-xl border border-gray-300 dark:border-neutral-700">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">
                Risk: 
                <span className={
                  risk.level === "HIGH"
                    ? "text-red-500 ml-1"
                    : risk.level === "MEDIUM"
                    ? "text-yellow-500 ml-1"
                    : "text-green-500 ml-1"
                }>
                  {risk.level}
                </span>
              </span>

              <span className="text-xs opacity-70">
                {(risk.risk * 100).toFixed(0)}%
              </span>

            </div>
            <div className="w-full h-1 mt-1 bg-gray-200 rounded">
              <div
                className={`h-1 rounded ${
                  risk.level === "HIGH"
                    ? "bg-red-500"
                    : risk.level === "MEDIUM"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${risk.risk * 100}%` }}
              />
            </div>

            {risk.level === "HIGH" && (
              <p className="text-[10px] text-red-400 mt-1">
                Possible sandwich attack detected
              </p>
            )}
          </div>
        )}
    
        {/* Auto-protect */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="opacity-70">Auto-Protect</span>
          <input
            type="checkbox"
            checked={autoProtect}
            onChange={(e) => { const enabled = e.target.checked; 
              setAutoProtect(enabled); 
              if (!enabled) 
                { setRisk(null); 

                } 
              }}
          />
        </div>
        {autoProtect?<div className="
          mt-4
          mb-4
          rounded-xl
          border
          border-neutral-800
          dark:bg-black
          bg-cyan-50
          p-3
          font-mono
          text-[11px]
        ">

          {risk?.level === "HIGH" && (
            <div className="text-red-400 mt-1 animate-pulse">
              Potential MEV activity detected
            </div>
          )}

          <div className="dark:text-cyan-400 text-cyan-700 mt-1">
            AI confidence: {risk ? (risk.confidence * 100).toFixed(0) : 0}%
          </div>
        </div>: null}

        <Button
          className="w-full"
          disabled={
            swapLoading ||
            quoteLoading ||
            !wallet.connected ||
            !fromAmount ||
            isSameToken ||
            insufficientBalance||
            !connection.rpcEndpoint.includes("mainnet") ||
            (risk?.risk ?? 0) > 0.95
          }
          onClick={handleSwap}
        >
          {swapLoading? "Swapping...": quoteLoading? "Fetching quote...": insufficientBalance? "Insufficient balance": !connection.rpcEndpoint.includes("mainnet")? "Switch to mainnet": isSameToken? "Select different tokens": "Swap"}
        </Button>
    </div>
              {/* About Aroha */}
        <div className="
          w-full
          h-full
          mx-auto
          mt-10
        ">
          <p className="
            text-sm
            leading-relaxed
            text-gray-600
            dark:text-gray-400
          ">
            Aroha DEX combines Solana swaps with real-time AI protection.
            The platform analyzes transaction conditions before execution
            to help users avoid unsafe routes, excessive slippage, and
            risky swap behavior.
          </p>

          <div className="
            flex
            justify-center
            gap-2
            mt-5
          ">
            <div className="
              px-3 py-1
              rounded-full
              text-xs
              bg-black/5
              dark:bg-white/5
            ">
              AI Risk Detection
            </div>

            <div className="
              px-3 py-1
              rounded-full
              text-xs
              bg-black/5
              dark:bg-white/5
            ">
              MEV Protection
            </div>

            <div className="
              px-3 py-1
              rounded-full
              text-xs
              bg-black/5
              dark:bg-white/5
            ">
              Solana Powered
            </div>
          </div>
        </div>
        </div>
  );
}

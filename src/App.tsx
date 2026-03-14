import { useGameStore } from './store';
import { useGameLoop } from './hooks/useGameLoop';
import { 
  Code, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Cpu, 
  Coffee, 
  Keyboard as KeyboardIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  useGameLoop();
  
  const { 
    money, 
    code, 
    employees, 
    upgrades, 
    sellCode, 
    hireEmployee, 
    buyUpgrade 
  } = useGameStore();

  const totalCPS = Object.values(employees).reduce((acc, tier) => {
    return acc + (tier.count * tier.baseCodePerSecond);
  }, 0);

  const activeMultiplier = Object.values(upgrades).reduce((acc, upgrade) => {
    return upgrade.purchased ? acc + (upgrade.multiplier - 1) : acc;
  }, 1);

  const finalCPS = totalCPS * activeMultiplier;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header / Stats Bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <TrendingUp className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Startup Tycoon</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">v1.0.4 - Alpha</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-emerald-400">
                <DollarSign className="w-5 h-5" />
                <span className="text-2xl font-bold font-mono">{Math.floor(money).toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Available Capital</span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-blue-400">
                <Code className="w-5 h-5" />
                <span className="text-2xl font-bold font-mono">{Math.floor(code).toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Lines of Code</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Core Actions */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Operations
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">Production Rate</span>
                  <span className="text-sm font-mono text-blue-400">+{finalCPS.toFixed(1)} LoC/s</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    animate={{ width: finalCPS > 0 ? "100%" : "0%" }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>

              <button 
                onClick={sellCode}
                disabled={code < 10}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group",
                  code >= 10 
                    ? "bg-emerald-500 text-black hover:bg-emerald-400 active:scale-95" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                Sell Code (10 LoC = $1)
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Upgrades
            </h2>
            <div className="space-y-3">
              {Object.values(upgrades).map((upgrade) => (
                <button
                  key={upgrade.id}
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={upgrade.purchased || money < upgrade.cost}
                  className={cn(
                    "w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group relative overflow-hidden",
                    upgrade.purchased 
                      ? "bg-zinc-800/30 border-emerald-500/50 opacity-60" 
                      : money >= upgrade.cost 
                        ? "bg-zinc-800/50 border-white/5 hover:border-blue-500/50 hover:bg-zinc-800" 
                        : "bg-zinc-900/20 border-white/5 opacity-40 grayscale cursor-not-allowed"
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    {upgrade.id === 'keyboard' ? <KeyboardIcon className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{upgrade.name}</span>
                      {!upgrade.purchased && <span className="text-xs font-mono text-emerald-400">${upgrade.cost}</span>}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{upgrade.description}</p>
                  </div>
                  {upgrade.purchased && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-emerald-500/20 text-emerald-500 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold">Active</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Hiring */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-6 h-6 text-emerald-500" />
                Engineering Team
              </h2>
              <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                Total Staff: {Object.values(employees).reduce((a, b) => a + b.count, 0)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(employees).map((tier) => {
                const currentCost = Math.floor(tier.baseCost * Math.pow(1.15, tier.count));
                const canAfford = money >= currentCost;
                
                return (
                  <div 
                    key={tier.id}
                    className={cn(
                      "p-6 rounded-3xl border transition-all group",
                      canAfford 
                        ? "bg-zinc-800/40 border-white/5 hover:border-emerald-500/30" 
                        : "bg-zinc-900/20 border-white/5 opacity-60"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{tier.name}</h3>
                        <p className="text-xs text-zinc-500">Generates {tier.baseCodePerSecond} LoC/s</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-zinc-300">{tier.count}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Active</div>
                      </div>
                    </div>

                    <button
                      onClick={() => hireEmployee(tier.id)}
                      disabled={!canAfford}
                      className={cn(
                        "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-between px-4",
                        canAfford 
                          ? "bg-white text-black hover:bg-emerald-400 active:scale-95" 
                          : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      )}
                    >
                      <span>Hire {tier.name}</span>
                      <span className="font-mono text-sm">${currentCost.toLocaleString()}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tips / Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
              <h4 className="text-blue-400 font-semibold text-sm mb-2">The Math</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Employee costs scale exponentially: <code className="text-blue-300">Cost = Base * 1.15^Count</code>. 
                Efficiency is key to scaling.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
              <h4 className="text-emerald-400 font-semibold text-sm mb-2">Liquidity</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Code has no value until sold. Convert your production into capital to fuel growth.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
              <h4 className="text-purple-400 font-semibold text-sm mb-2">Multipliers</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Upgrades apply to your <span className="italic">total</span> production rate. Stack them for massive gains.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex justify-between items-center text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
        <div>© 2026 Startup Tycoon Systems</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

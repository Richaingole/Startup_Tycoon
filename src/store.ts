import { create } from 'zustand';
import { GameState, EmployeeTier, Upgrade } from './types';

const INITIAL_EMPLOYEES: Record<string, EmployeeTier> = {
  intern: {
    id: 'intern',
    name: 'Intern',
    baseCost: 15,
    baseCodePerSecond: 1,
    count: 0,
  },
  junior: {
    id: 'junior',
    name: 'Junior Developer',
    baseCost: 100,
    baseCodePerSecond: 5,
    count: 0,
  },
  senior: {
    id: 'senior',
    name: 'Senior Developer',
    baseCost: 500,
    baseCodePerSecond: 20,
    count: 0,
  },
};

const INITIAL_UPGRADES: Record<string, Upgrade> = {
  keyboard: {
    id: 'keyboard',
    name: 'Mechanical Keyboards',
    cost: 200,
    multiplier: 1.2,
    purchased: false,
    description: 'Increases total code production by 20%',
  },
  coffee: {
    id: 'coffee',
    name: 'Premium Coffee',
    cost: 1000,
    multiplier: 1.5,
    purchased: false,
    description: 'Increases total code production by 50%',
  },
};

export const useGameStore = create<GameState>((set, get) => ({
  money: 50, // Start with some seed money
  code: 0,
  employees: INITIAL_EMPLOYEES,
  upgrades: INITIAL_UPGRADES,

  addCode: (amount) => set((state) => ({ code: state.code + amount })),

  sellCode: () => {
    const { code } = get();
    if (code <= 0) return;
    
    // 10 lines of code = $1
    const moneyEarned = Math.floor(code / 10);
    const codeRemaining = code % 10;
    
    set((state) => ({
      money: state.money + moneyEarned,
      code: codeRemaining,
    }));
  },

  hireEmployee: (tierId) => {
    const { money, employees } = get();
    const tier = employees[tierId];
    
    // Price scaling: baseCost * (1.15 ^ count)
    const currentCost = Math.floor(tier.baseCost * Math.pow(1.15, tier.count));
    
    if (money >= currentCost) {
      set((state) => ({
        money: state.money - currentCost,
        employees: {
          ...state.employees,
          [tierId]: {
            ...tier,
            count: tier.count + 1,
          },
        },
      }));
    }
  },

  buyUpgrade: (upgradeId) => {
    const { money, upgrades } = get();
    const upgrade = upgrades[upgradeId];
    
    if (!upgrade.purchased && money >= upgrade.cost) {
      set((state) => ({
        money: state.money - upgrade.cost,
        upgrades: {
          ...state.upgrades,
          [upgradeId]: {
            ...upgrade,
            purchased: true,
          },
        },
      }));
    }
  },

  tick: () => {
    const { employees, upgrades } = get();
    
    // Calculate base code per second
    let baseCPS = 0;
    Object.values(employees).forEach((tier) => {
      baseCPS += tier.count * tier.baseCodePerSecond;
    });
    
    // Apply upgrades
    let totalMultiplier = 1;
    Object.values(upgrades).forEach((upgrade) => {
      if (upgrade.purchased) {
        // We can either add multipliers or multiply them. 
        // Let's go with additive for simpler balance: 1 + (0.2) + (0.5) = 1.7x
        totalMultiplier += (upgrade.multiplier - 1);
      }
    });
    
    const totalCPS = baseCPS * totalMultiplier;
    
    if (totalCPS > 0) {
      set((state) => ({ code: state.code + totalCPS }));
    }
  },
}));

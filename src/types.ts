export interface EmployeeTier {
  id: string;
  name: string;
  baseCost: number;
  baseCodePerSecond: number;
  count: number;
}

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  purchased: boolean;
  description: string;
}

export interface GameState {
  money: number;
  code: number;
  employees: Record<string, EmployeeTier>;
  upgrades: Record<string, Upgrade>;
  
  // Actions
  addCode: (amount: number) => void;
  sellCode: () => void;
  hireEmployee: (tierId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  tick: () => void;
}

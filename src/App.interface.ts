export enum FundType {
  VENTURE_CAPITAL = "Venture Capital",
  REAL_ESTATE = "Real Estate",
  HEDGE_FUND = "Hedge Fund",
}

export interface FundInterface {
  name: string;
  manager: string;
  year: number;
  type: FundType;
  isOpen: boolean;
}

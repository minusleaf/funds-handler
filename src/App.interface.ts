import { SimulationNodeDatum } from "d3";

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

export interface FundNodeInterface extends SimulationNodeDatum {
  id: string;
  type: "FUND" | "COMMON_ROOT"; // Common roots are what bind fund nodes together when a "Connect By" parameter is selected.
  fund: FundInterface;
}

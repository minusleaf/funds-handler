import { SimulationNodeDatum } from "d3";

export enum FundType {
  VENTURE_CAPITAL = "Venture Capital",
  REAL_ESTATE = "Real Estate",
  HEDGE_FUND = "Hedge Fund",
}

export enum FundAttributes {
  NAME = "name",
  MANAGER = "manager",
  YEAR = "year",
  TYPE = "type",
  ISOPEN = "isOpen",
}

export enum NodeType {
  FUND = "FUND",
  GROUP_ROOT = "GROUP_ROOT", // Group roots are what bind fund nodes together when a "Connect By" parameter is selected.
}

export interface FundInterface {
  name: string;
  manager: string;
  year: string;
  type: FundType;
  isOpen: boolean;
}

export interface FundNodeInterface extends SimulationNodeDatum {
  id: string;
  type: NodeType;
  fund?: FundInterface;
}

export interface GroupRootNodeInterface extends FundNodeInterface {
  groupRootText: string;
  groupRootAttribute: FundAttributes;
}

export interface SelectedConnectionTypesInterface {
  name: boolean;
  manager: boolean;
  year: boolean;
  type: boolean;
  isOpen: boolean;
}

export interface AttributeFrequencyInterface {
  // String array at the end contains IDs
  [attribute: string]: { [nodeAttributeValue: string]: String[] };
}

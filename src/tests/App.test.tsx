import {
  appendToAttributeFrequency,
  updateGroupRootNodesAndLinks,
} from "../App";
import {
  AttributeFrequencyInterface,
  FundInterface,
  FundNodeInterface,
  FundType,
  NodeType,
  SelectedConnectionTypesInterface,
  SelectionFundAttributes,
} from "../App.interface";

const createFundNode = (
  id: string,
  fund: FundInterface
): FundNodeInterface => ({
  id,
  type: NodeType.FUND,
  fund,
});

const createGroupRootNode = (
  id: string,
  groupRootText: string,
  groupRootAttribute: SelectionFundAttributes
) => ({
  id,
  type: NodeType.GROUP_ROOT,
  groupRootText,
  groupRootAttribute,
});

const createSelectedTypes = (
  manager: boolean,
  year: boolean,
  type: boolean,
  isOpen: boolean
): SelectedConnectionTypesInterface => ({
  manager,
  year,
  type,
  isOpen,
});

describe("returns correct attribute frequency object given new node for case index", () => {
  const cases = [
    [
      createFundNode("0", {
        name: "testA",
        manager: "managerA",
        year: "2000",
        type: FundType.VENTURE_CAPITAL,
        isOpen: false,
      }),
      {
        name: {},
        manager: {},
        year: { "2000": ["1", "2"] },
        type: { [FundType.VENTURE_CAPITAL]: ["1"] },
        isOpen: { true: ["1", "2", "3"] },
      } as AttributeFrequencyInterface,
      {
        name: { testA: ["0"] },
        manager: { managerA: ["0"] },
        year: { "2000": ["1", "2", "0"] },
        type: { [FundType.VENTURE_CAPITAL]: ["1", "0"] },
        isOpen: { true: ["1", "2", "3"], false: ["0"] },
      },
    ],
    [
      createFundNode("0", {
        name: "testA",
        manager: "managerA",
        year: "2000",
        type: FundType.VENTURE_CAPITAL,
        isOpen: false,
      }),
      {
        name: {},
        manager: {},
        year: {},
        type: {},
        isOpen: {},
      },
      {
        name: { testA: ["0"] },
        manager: { managerA: ["0"] },
        year: { "2000": ["0"] },
        type: { [FundType.VENTURE_CAPITAL]: ["0"] },
        isOpen: { false: ["0"] },
      },
    ],
  ];
  test.each(cases)("# %#", (fundNode, attributeFrequency, resultFrequency) => {
    expect(
      appendToAttributeFrequency(
        fundNode as FundNodeInterface,
        attributeFrequency as AttributeFrequencyInterface
      )
    ).toEqual(resultFrequency);
  });
});

describe("returns correct groupRootNodes and graphLinks for case index", () => {
  const cases = [
    [
      {
        name: {},
        manager: {},
        year: { "2000": ["1", "2"] },
        type: { [FundType.VENTURE_CAPITAL]: ["1"] },
        isOpen: { true: ["1", "2", "3"] },
      } as AttributeFrequencyInterface,
      createSelectedTypes(false, false, false, false),
      {
        groupRootNodes: [],
        graphLinks: [],
      },
    ],
    [
      {
        name: {},
        manager: {},
        year: { "2000": ["1", "2"] },
        type: { [FundType.VENTURE_CAPITAL]: ["1"] },
        isOpen: { true: ["1", "2", "3"] },
      } as AttributeFrequencyInterface,
      createSelectedTypes(true, true, true, true),
      {
        groupRootNodes: [
          createGroupRootNode("0_ROOT", "2000", SelectionFundAttributes.YEAR),
          createGroupRootNode("1_ROOT", "true", SelectionFundAttributes.ISOPEN),
        ],
        graphLinks: [
          { source: "0_ROOT", target: "1" },
          { source: "0_ROOT", target: "2" },
          { source: "1_ROOT", target: "1" },
          { source: "1_ROOT", target: "2" },
          { source: "1_ROOT", target: "3" },
        ],
      },
    ],
    [
      {
        name: {},
        manager: {},
        year: {},
        type: {},
        isOpen: {},
      } as AttributeFrequencyInterface,
      createSelectedTypes(true, true, true, true),
      {
        groupRootNodes: [],
        graphLinks: [],
      },
    ],
    [
      {
        name: {},
        manager: {},
        year: { "2000": ["1", "2"] },
        type: { [FundType.VENTURE_CAPITAL]: ["1"] },
        isOpen: { true: ["1", "2", "3"] },
      } as AttributeFrequencyInterface,
      createSelectedTypes(true, true, true, false),
      {
        groupRootNodes: [
          createGroupRootNode("0_ROOT", "2000", SelectionFundAttributes.YEAR),
        ],
        graphLinks: [
          { source: "0_ROOT", target: "1" },
          { source: "0_ROOT", target: "2" },
        ],
      },
    ],
  ];

  test.each(cases)("# %#", (attributeFrequency, selectedTypes, result) => {
    expect(
      updateGroupRootNodesAndLinks(
        attributeFrequency as AttributeFrequencyInterface,
        selectedTypes as SelectedConnectionTypesInterface
      )
    ).toEqual(result);
  });
});

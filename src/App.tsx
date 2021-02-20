import React, { useRef, useState } from "react";
import { FundOptionsWindow } from "./components/FundOptionsWindow/FundOptionsWindow";
import {
  SelectionFundAttributes,
  FundInterface,
  FundNodeInterface,
  GroupRootNodeInterface,
  SelectedConnectionTypesInterface,
  AttributeFrequencyInterface,
  NodeType,
} from "./App.interface";
import { Flex } from "@chakra-ui/react";
import { FundGraphGenerator } from "./components/FundGraph/FundGraphGenerator";
import { SimulationLinkDatum } from "d3";

export const appendToAttributeFrequency = (
  newGraphNode: FundNodeInterface,
  attributeFrequency: AttributeFrequencyInterface
) => {
  if (newGraphNode.fund) {
    for (const [attribute, value] of Object.entries(newGraphNode.fund)) {
      if (attributeFrequency[attribute].hasOwnProperty(String(value))) {
        attributeFrequency[attribute][value].push(newGraphNode.id);
      } else {
        attributeFrequency[attribute][value] = [newGraphNode.id];
      }
    }
  }
  return attributeFrequency;
};

export const updateGroupRootNodesAndLinks = (
  attributeFrequency: AttributeFrequencyInterface,
  selectedConnectionTypes: SelectedConnectionTypesInterface
): {
  groupRootNodes: GroupRootNodeInterface[];
  graphLinks: SimulationLinkDatum<FundNodeInterface>[];
} => {
  // Generate group root nodes for only the selected connection types and values that have multiple IDs associated.
  let groupRootId = 0;
  return Object.entries(selectedConnectionTypes)
    .filter((attributeEntry) => attributeEntry[1])
    .map((selectedEntry) => selectedEntry[0])
    .reduce(
      (groupRootNodesAndLinks, attribute) => {
        Object.entries(attributeFrequency[attribute])
          .filter((attributeElement) => attributeElement[1].length > 1)
          .forEach(([nodeAttributeValue, idArray]) => {
            // Push the relevant group root nodes!
            const newGroupRootNodeId = groupRootId.toString(10) + "_ROOT";
            groupRootNodesAndLinks.groupRootNodes.push({
              id: newGroupRootNodeId,
              type: NodeType.GROUP_ROOT,
              groupRootAttribute: attribute as SelectionFundAttributes,
              groupRootText: nodeAttributeValue,
            });
            groupRootId += 1;

            // Push the relevant links connecting fund nodes to the current group root node!
            groupRootNodesAndLinks.graphLinks = groupRootNodesAndLinks.graphLinks.concat(
              idArray.map(
                (id) =>
                  ({
                    source: newGroupRootNodeId,
                    target: id,
                  } as SimulationLinkDatum<FundNodeInterface>)
              )
            );
          });

        return groupRootNodesAndLinks;
      },
      {
        groupRootNodes: [] as GroupRootNodeInterface[],
        graphLinks: [] as SimulationLinkDatum<FundNodeInterface>[],
      }
    );
};

function App() {
  const [graphElements, setGraphElements] = useState<{
    nodes: FundNodeInterface[];
    links: SimulationLinkDatum<FundNodeInterface>[];
  }>({
    nodes: [],
    links: [],
  });
  const graphNodes = useRef<FundNodeInterface[]>([]);
  const selectedConnectionTypes = useRef<SelectedConnectionTypesInterface>({
    manager: false,
    year: false,
    type: false,
    isOpen: false,
  });

  const nextGeneratedId = useRef<number>(graphNodes.current.length);
  const groupRootNodes = useRef<GroupRootNodeInterface[]>([]);
  const attributeFrequency = useRef<AttributeFrequencyInterface>({
    name: {},
    manager: {},
    year: {},
    type: {},
    isOpen: {},
  });

  const updateGraphElements = () => {
    const updatedGroupRootNodesAndLinks = updateGroupRootNodesAndLinks(
      attributeFrequency.current,
      selectedConnectionTypes.current
    );

    groupRootNodes.current = updatedGroupRootNodesAndLinks.groupRootNodes;
    setGraphElements({
      nodes: graphNodes.current.concat(groupRootNodes.current),
      links: updatedGroupRootNodesAndLinks.graphLinks,
    });
  };

  const addFund = (newFund: FundInterface) => {
    // A new fund is added, so let's update the frequency model and fund nodes.
    const newGraphNode = {
      id: nextGeneratedId.current.toString(),
      type: NodeType.FUND,
      fund: newFund,
    };
    graphNodes.current.push(newGraphNode);
    nextGeneratedId.current += 1;
    attributeFrequency.current = appendToAttributeFrequency(
      newGraphNode,
      attributeFrequency.current
    );
    updateGraphElements();
  };

  const updateSelectedConnectionTypes = (
    attribute: SelectionFundAttributes,
    newBoolValue: boolean
  ) => {
    // Changes to the selectedConnectionTypes update other state variables as well.
    selectedConnectionTypes.current[attribute] = newBoolValue;
    updateGraphElements();
  };

  return (
    <Flex
      className="App"
      width="100vw"
      height="100vh"
      backgroundImage="linear-gradient(rgb(11, 21, 64), rgb(35, 5, 38))"
    >
      <FundOptionsWindow
        addFund={addFund}
        updateConnectedTypes={updateSelectedConnectionTypes}
        defaultConnectedTypes={selectedConnectionTypes.current}
      />
      <FundGraphGenerator graphElements={graphElements} />
    </Flex>
  );
}

export default App;

import React, { useState } from "react";
import { AddFundWindow } from "./components/AddFundWindow/AddFundWindow";
import { FundInterface, FundNodeInterface } from "./App.interface";
import { Flex } from "@chakra-ui/react";
import data from "./data/data.json";
import { FundGraph } from "./components/FundGraph/FundGraph";

function App() {
  const [funds, setFunds] = useState<FundInterface[]>([]);
  const [graphNodes, setGraphNodes] = useState<FundNodeInterface[]>([]);
  const [graphLinks, setGraphLinks] = useState<any[]>([]);
  const [nextGeneratedId, setNextGeneratedId] = useState<number>(funds.length);

  const addFund = (newFund: FundInterface) => {
    setFunds(funds.concat([newFund]));
    setGraphNodes(
      graphNodes.concat([
        { id: nextGeneratedId.toString(), type: "FUND", fund: newFund },
      ])
    );
    setNextGeneratedId(nextGeneratedId + 1);
  };
  return (
    <Flex className="App" width="100vw" height="100vh" backgroundColor="grey">
      <AddFundWindow addFund={addFund} />
      <FundGraph linksData={graphLinks} nodesData={graphNodes} />
    </Flex>
  );
}

export default App;

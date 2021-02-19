import React, { useRef, useEffect } from "react";
import { FundNodeInterface } from "../../App.interface";
import * as d3 from "d3";
import { SimulationLinkDatum } from "d3";

/* export const FundGraph = ({ linksData, nodesData }: FundGraphInterface) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let destroyFn;

    if (containerRef.current) {
      const { destroy } = FundGraphGenerator(
        containerRef.current,
        linksData,
        nodesData
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, []);

  return <div ref={containerRef} />;
};
 */
const width = 960;
const height = 540;

const testData = {
  nodes: [],
  links: [],
};

export const FundGraphGenerator = ({ linksData, nodesData }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const links = testData.links.map((d) => Object.assign({}, d));
    const nodes = testData.nodes.map((d) => Object.assign({}, d));
    console.log(linksData);
    const drag = (simulation) => {
      function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragEnded(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
    };

    const simulation = d3
      .forceSimulation(nodesData)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const color = () => {
      return "#9D00A0";
    };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `[${-width / 2}, ${-height / 2}, ${width}, ${height}]`);

    const link = svg
      .append("g")
      .attr("id", "graph-links")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join(
        (enter) => enter.append("line"),
        (exit) => exit.remove()
      )
      .attr("stroke-width", "1.5px");

    const node = svg
      .append("g")
      .attr("id", "graph-nodes")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join(
        (enter) => enter.append("circle"),
        (exit) => exit.remove()
      )
      .attr("r", 5)
      .attr("fill", color)
      .call(() => drag(simulation));

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }, [linksData, nodesData]);

  return <svg ref={svgRef}></svg>;
};

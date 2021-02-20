import React, { useRef, useEffect } from "react";
import { FundNodeInterface } from "../../App.interface";
import * as d3 from "d3";
import { D3DragEvent, SimulationLinkDatum, text } from "d3";

export interface FundGraphInterface {
  graphElements: {
    nodes: FundNodeInterface[];
    links: SimulationLinkDatum<FundNodeInterface>[];
  };
}

export const FundGraph = ({ graphElements }: FundGraphInterface) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const updateGraph = async () => {
      const links = graphElements.links.map((d) => Object.assign({}, d));
      const nodes = graphElements.nodes.map((d) => Object.assign({}, d));

      const drag = (
        simulation: d3.Simulation<
          FundNodeInterface,
          SimulationLinkDatum<FundNodeInterface>
        >
      ) => {
        function dragStarted(
          event: D3DragEvent<
            SVGCircleElement,
            FundNodeInterface,
            FundNodeInterface
          >
        ) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(
          event: D3DragEvent<
            SVGCircleElement,
            FundNodeInterface,
            FundNodeInterface
          >
        ) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragEnded(
          event: D3DragEvent<
            SVGCircleElement,
            FundNodeInterface,
            FundNodeInterface
          >
        ) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag<SVGCircleElement, FundNodeInterface>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded);
      };

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => (d as FundNodeInterface).id)
        )
        .force("charge", d3.forceManyBody().strength(-240))
        .force(
          "center",
          d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
        );

      const svg = d3.select(svgRef.current);

      const link = svg
        .select("#graph-links")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join(
          (enter) => enter.append("line"),
          (exit) => exit.remove()
        );
      /* .attr("stroke-width", (d) => Math.sqrt(d.value)); */

      const node = svg
        .select("#graph-nodes")
        .selectAll("svg")
        .data(nodes)
        .join(
          (enter) => {
            const cardSVG = enter.append("svg");
            const cardGroup = cardSVG.append("g");

            // Card Background
            cardGroup
              .append("rect")
              .classed("fund-label-card", true)
              .attr("width", "180px")
              .attr("height", "120px")
              .attr("rx", "20px");

            // Card Contents
            const textOffset = 20;
            const initialOffset = 25;
            cardGroup
              .append("text")
              .attr("font-weight", "bold")
              .attr("transform", "translate(20, " + initialOffset + ")")
              .text((d) =>
                d.type === "FUND" && d.fund ? d.fund.name : d.type
              );
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" && d.fund ? d.fund.manager : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 2 + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" && d.fund ? d.fund.year : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 3 + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" && d.fund ? d.fund.type : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 4 + initialOffset) + ")"
              )
              .text((d) => {
                if (d.type === "FUND" && d.fund)
                  return d.fund.isOpen ? "Open" : "Closed";
                return "";
              });

            cardGroup.selectAll("text").style("fill", "white");
            return cardSVG;
          },
          (exit) => exit.remove()
        );
      /* .call(drag(simulation)) */

      simulation.on("tick", () => {
        /* link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y); */

        node
          .attr("x", (d) => (d.x ? (d.x as number) - 90 : 0))
          .attr("y", (d) => (d.y ? (d.y as number) - 60 : 0));
      });
    };
    updateGraph();
  }, [graphElements]);

  return (
    <svg ref={svgRef} width="100%" id="graph-svg">
      <g id="graph-links" stroke="#999" stroke-opacity="0.6"></g>
      <g id="graph-nodes"></g>
      <g id="graph-labels"></g>
    </svg>
  );
};

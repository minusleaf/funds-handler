import React, { useRef, useEffect } from "react";
import {
  FundInterface,
  FundNodeInterface,
  FundType,
} from "../../App.interface";
import * as d3 from "d3";
import { D3DragEvent, SimulationLinkDatum, text } from "d3";

export interface FundGraphInterface {
  linksData: any[];
  nodesData: FundNodeInterface[];
}

export const FundGraph = ({ linksData, nodesData }: FundGraphInterface) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const updateGraph = async () => {
      const links = linksData.map((d) => Object.assign({}, d));
      const nodes = nodesData.map((d) => Object.assign({}, d));

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
        .force("charge", d3.forceManyBody())
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
        )
        .attr("stroke-width", (d) => Math.sqrt(d.value));

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
              .attr("transform", "translate(20, " + initialOffset + ")")
              .text((d) => (d.type === "FUND" ? d.fund.name : d.type));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" ? d.fund.manager : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 2 + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" ? d.fund.year : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 3 + initialOffset) + ")"
              )
              .text((d) => (d.type === "FUND" ? d.fund.type : ""));
            cardGroup
              .append("text")
              .attr(
                "transform",
                "translate(20, " + (textOffset * 4 + initialOffset) + ")"
              )
              .text((d) => {
                if (d.type === "FUND") return d.fund.isOpen ? "Open" : "Closed";
                return "";
              });

            cardGroup.selectAll("text").style("fill", "white");
            return cardSVG;
          },
          (exit) => exit.remove()
        );
      /* .call(drag(simulation)) */

      /* const labelCard = svg
        .select("#graph-labels")
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
            cardGroup
              .append("text")
              .style("fill", "white")
              .text((d) => {
                const fundProperties = d.fund;
                if (fundProperties)
                  return `${fundProperties.name}<br />${fundProperties.manager}<br />${fundProperties.type}`;
                return "";
              });
            return cardSVG;
          },
          (exit) => exit.remove()
        ); */

      /* const labelCard = await d3.xml("").then(async (svgImage: Document) => {
        console.log(FundNodeCard);
        return svg
          .select("#graph-labels")
          .selectAll("svg")
          .data(nodes)
          .join(
            (enter) =>
              enter.append("svg").html(svgImage.documentElement.innerHTML),
            (exit) => exit.remove()
          );
      }); */

      /* const labelText = svg
        .selectAll("#graph-labels")
        .selectAll("text")
        .data(nodes)
        .join(
          (enter) => enter.append("text"),
          (exit) => exit.remove()
        )
        .style("fill", "white")
        .text((d) => {
          const fundProperties = d.fund;
          if (fundProperties)
            return `${fundProperties.name}<br />${fundProperties.manager}<br />${fundProperties.type}`;
          return "";
        });
 */
      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node
          .attr("x", (d) => (d.x ? (d.x as number) : 0))
          .attr("y", (d) => (d.y ? (d.y as number) : 0));
      });
    };
    updateGraph();
  }, [linksData, nodesData]);

  return (
    <svg ref={svgRef} width="100%" id="graph-svg">
      <g id="graph-links" stroke="#999" stroke-opacity="0.6"></g>
      <g id="graph-nodes"></g>
      <g id="graph-labels"></g>
    </svg>
  );
};

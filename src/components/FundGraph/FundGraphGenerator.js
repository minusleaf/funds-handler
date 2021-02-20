import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const generateCard = (cardElement) => {
  const cardGroup = cardElement.append("g");

  // Card Background
  cardGroup
    .append("rect")
    .classed("fund-label-card", true)
    .attr("fill", (d) => (d.type === "FUND" ? "#18295e" : "#85054d"))
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
    .text((d) => (d.type === "FUND" ? d.fund.name : d.groupRootText));
  cardGroup
    .append("text")
    .attr("transform", "translate(20, " + (textOffset + initialOffset) + ")")
    .text((d) => (d.type === "FUND" ? d.fund.manager : d.groupRootAttribute));
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
};

export const FundGraphGenerator = ({ graphElements }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const updateGraph = async () => {
      const links = graphElements.links.map((d) => Object.assign({}, d));
      const nodes = graphElements.nodes.map((d) => Object.assign({}, d));
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
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(240)
        )
        .force("charge", d3.forceManyBody().strength(-240))
        .force(
          "center",
          d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
        );

      const svg = d3.select(svgRef.current);

      const colorLinesForDebug = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "white",
      ];

      const link = svg
        .select("#graph-links")
        .attr("stroke", "#FFF")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join(
          (enter) => enter.append("line"),
          (update) => update,
          (exit) => exit.remove()
        )
        .attr("stroke-width", (d) => Math.sqrt(d.value));

      const node = svg
        .select("#graph-nodes")
        .selectAll("svg")
        .data(nodes)
        .join(
          (enter) => {
            const cardSVG = enter
              .append("svg")
              .attr("width", "180px")
              .attr("height", "120px");
            generateCard(cardSVG);
            return cardSVG;
          },
          (update) => {
            // Redraw the card
            update.html("");
            generateCard(update);
            return update;
          },
          (exit) => exit.remove()
        )
        .call(drag(simulation));

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("x", (d) => d.x - 90).attr("y", (d) => d.y - 60);
      });
    };
    updateGraph();
  }, [graphElements]);

  return (
    <svg ref={svgRef} width="100%" id="graph-svg">
      <g id="graph-links" stroke="#999" strokeOpacity="0.6"></g>
      <g id="graph-nodes"></g>
      <g id="graph-labels"></g>
    </svg>
  );
};

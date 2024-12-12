import "../styles/useCaseReportStyle.css";
import { useReactFlow } from "@xyflow/react";
import React from "react";
import { EdgeType, NodeType } from "../Types";

function UseCaseReport() {
  const { getNodes, getEdges, getNode } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();
  const actors = nodes.filter((node) => node.type === "personNode");
  const actorUseCases = actors.map((actor) => {
    const actorEdges = edges.filter(
      (edge) =>
        (edge.type === "customSmoothStepEdge" &&
          ((edge.source === actor.id && getNode(edge.target).type === NodeType.useCaseNode) ||
            (edge.target === actor.id && getNode(edge.source).type === NodeType.useCaseNode))) ||
        (edge.type === "endArrowEdge" &&
          edge.source === actor.id &&
          getNode(edge.target).type === NodeType.useCaseNode)
    );

    return {
      actorId: actor.id,
      actorName: actor.data?.label,
      relations: actorEdges.map((actorEdge) => {
        const useCaseNode =
          getNode(actorEdge.source).type === NodeType.useCaseNode
            ? getNode(actorEdge.source)
            : getNode(actorEdge.target);
        return {
          relation: actorEdge.label,
          useCaseId: useCaseNode.id,
          useCaseName: useCaseNode.data.label,
        };
      }),
    };
  });
  const relationsBetweenUseCases = edges
    .filter(
      (edge) =>
        getNode(edge.source).type === NodeType.useCaseNode &&
        getNode(edge.target).type === NodeType.useCaseNode
    )
    .map((edge) => {
      const sourceNode = getNode(edge.source);
      const targetNode = getNode(edge.target);
      return {
        sourceNodeId: sourceNode.id,
        sourceNodeName: sourceNode.data?.label,
        relationLabel: edge.label,
        relationType: edge.type,
        targetNodeId: targetNode.id,
        targetNodeName: targetNode.data?.label,
      };
    });
  return (
    <div className="use-case-report-layout">
      <h1>Use Case Diagram Report</h1>
      <div className="use-case-report-actors">
        <h2>Actors</h2>
        <span>
          {actors
            .map((actor) => {
              return actor.data?.label;
            })
            .join(", ")}
        </span>
      </div>
      <div className="use-case-report-actors-usecases">
        <h2>Relations between actor and use case</h2>
        <div>
          {actorUseCases.map((actorUseCase) => {
            return (
              <div>
                <span>{actorUseCase.actorName}</span>
                <ul>
                  {actorUseCase.relations.map((relation) => {
                    return (
                      <li>
                        {actorUseCase.actorName}{" "}
                        <span style={{ fontStyle: "italic" }}>{relation.relation}</span>{" "}
                        {relation.useCaseName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="use-case-report-usecases">
        <h2>Relations between use cases</h2>
        <ul>
          {relationsBetweenUseCases.map((rel) => {
            let relationName;

            switch (rel.relationType) {
              case EdgeType.includeEdge:
                relationName = (
                  <span style={{ fontStyle: "italic" }}>{`includes ${
                    !!rel.relationLabel ? `(${rel.relationLabel})` : ""
                  }`}</span>
                );
                break;
              case EdgeType.extendEdge:
                relationName = `extends ${!!rel.relationLabel ? `(${rel.relationLabel})` : ""}`;
                break;
              case EdgeType.customSmoothStepEdge:
                relationName = `${!!rel.relationLabel ? rel.relationLabel : "─"}`;
                break;
              case EdgeType.endArrowEdge:
                relationName = `${!!rel.relationLabel ? rel.relationLabel : "→"}`;
                break;
              case EdgeType.generalizationEdge:
                relationName = `${!!rel.relationLabel ? rel.relationLabel : "(generalization)"}`;
                break;
              case EdgeType.realizationEdge:
                relationName = `${!!rel.relationLabel ? rel.relationLabel : "(realization)"}`;
                break;
              default:
                relationName = "─";
            }

            return (
              <li>
                {rel.sourceNodeName} <span style={{ fontStyle: "italic" }}>{relationName}</span>{" "}
                {rel.targetNodeName}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default UseCaseReport;

import { useReactFlow } from "@xyflow/react";
import React from "react";
import { getEdgeNameByType, getNodeNameByType } from "../custom-functions";

const DiagramReport = () => {
  const { getNodes, getEdges, getNode} = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();
  // Створюємо таблицю вузлів
  const renderNodesTable = () => (
    <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Label</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node, index) => (
          <tr key={index}>
            <td>{`node-${index}`}</td>
            <td>{node.data.label}</td>
            <td>{getNodeNameByType(node.type)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Створюємо таблицю зв'язків
  const renderEdgesTable = () => (
    <table border="1" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Label</th>
          <th>Source</th>
          <th>Target</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {edges.map((edge, index) => (
          <tr key={index}>
            <td>{edge.label}</td>
            <td>{`${getNode(edge.source)?.data?.label} (${edge.source})`}</td>
            <td>{`${getNode(edge.target)?.data?.label} (${edge.target})`}</td>
            <td>{getEdgeNameByType(edge.type)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h2>Diagram Report</h2>
      <h3>Nodes</h3>
      {renderNodesTable()}
      <h3>Edges</h3>
      {renderEdgesTable()}
    </div>
  );
};

export default DiagramReport;

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { NodeType, EdgeType } from "./Types";

export const getDefaultNodeLabel = (type) => {
  switch (type) {
    case "rectangularNode":
      return "Process";
    case "diamondNode":
      return "Decision";
    case "ovalNode":
      return "Start";
    case "parallelogramNode":
      return "int i = 0";
    case "personNode":
      return "Actor";
    case "useCaseNode":
      return "Use Case";
    default:
      return "unknown";
  }
};

export const getNodeNameByType = (type) => {
  switch(type) {
    case "rectangularNode":
      return "Process";
    case "diamondNode":
      return "Decision";
    case "ovalNode":
      return "Terminal Box - Start/End";
    case "parallelogramNode":
      return "Input/Output";
    case "personNode":
      return "Actor";
    case "useCaseNode":
      return "Use Case";
    default:
      return "unknown";
  }
}

export const getEdgeNameByType = (type) => {
  switch(type) {
    case "customSmoothStepEdge":
      return "Association";
    case "endArrowEdge":
      return "Line with arrow in the end";
    case "includeEdge":
      return "Include";
    case "extendEdge":
      return "Extend";
    case "generalizationEdge":
      return "Generalization";
    case "realizationEdge":
      return "Realization";
    default:
      return "unknown";
  }
}

export const downloadReport = (nodes, edges, getNode) => {
  const doc = new jsPDF();
    doc.setFont("Inter-Regular", "normal");
    doc.setFontSize(16);
    doc.text("Diagram Report", 10, 10);

    doc.setFontSize(12);
    doc.text("Nodes table", 14, 18);
    // Таблиця вузлів
    const nodeHeaders = ["ID", "Label", "Type"];
    const nodeData = nodes.map((node, index) => [
      `node-${index}`,
      node.data.label,
      getNodeNameByType(node.type),
    ]);
    autoTable(doc, {
      head: [nodeHeaders],
      body: nodeData,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.setFontSize(12);
    doc.text("Edges table", 14, doc.lastAutoTable.finalY + 8);
    // Таблиця зв'язків
    const edgeHeaders = ["Label", "Source", "Target", "Type"];
    const edgeData = edges.map((edge) => [
      edge.label,
      getNode(edge.source)?.data?.label + " (" + edge.source + ")",
      getNode(edge.target)?.data?.label + " (" + edge.target + ")",
      getEdgeNameByType(edge.type),
    ]);
    autoTable(doc, {
      head: [edgeHeaders],
      body: edgeData,
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontSize: 8 },
    });
    doc.save("diagram-report");
}

export const downloadUseCaseReport = (nodes, edges, getNode) => {
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

  const doc = new jsPDF();

  // Заголовок звіту
  doc.setFontSize(16);
  doc.setFont("", "","bold");
  doc.text("Use Case Diagram Report", 10, 10);

  let currentY = 20; // Початковий відступ

  // Розділ Actors
  doc.setFontSize(14);
  doc.text("Actors", 10, currentY);
  currentY += 7;

  const actorNames = actors.map((actor) => actor.data?.label).join(", ");
  doc.setFontSize(12);
  doc.setFont("", "", "");
  doc.text(actorNames || "No actors available", 10, currentY);
  currentY += 10;

  // Розділ Relations between actor and use case
  doc.setFontSize(14);
  doc.setFont("", "","bold");
  doc.text("Relations between actor and use case", 10, currentY);
  currentY += 7;

  doc.setFontSize(12);
  doc.setFont("", "","");
  actorUseCases.forEach((actorUseCase) => {
    if (currentY > 280) {
      doc.addPage();
      currentY = 10;
    }

    doc.text(actorUseCase.actorName, 10, currentY);
    currentY += 5;

    actorUseCase.relations.forEach((relation) => {
      const text = `• ${actorUseCase.actorName} ${relation.relation} ${relation.useCaseName}`;
      doc.text(text, 15, currentY);
      currentY += 7;

      if (currentY > 280) {
        doc.addPage();
        currentY = 10;
      }
    });
  });

  currentY += 3;

  // Розділ Relations between use cases
  doc.setFontSize(14);
  doc.setFont("", "","bold");
  doc.text("Relations between use cases", 10, currentY);
  currentY += 7;

  doc.setFontSize(12);
  doc.setFont("", "","");
  relationsBetweenUseCases.forEach((rel) => {
    if (currentY > 280) {
      doc.addPage();
      currentY = 10;
    }

    let relationName;

    switch (rel.relationType) {
      case EdgeType.includeEdge:
        relationName = `includes ${rel.relationLabel ? `(${rel.relationLabel})` : ""}`;
        break;
      case EdgeType.extendEdge:
        relationName = `extends ${rel.relationLabel ? `(${rel.relationLabel})` : ""}`;
        break;
      case EdgeType.customSmoothStepEdge:
        relationName = rel.relationLabel || "─";
        break;
      case EdgeType.endArrowEdge:
        relationName = rel.relationLabel || "→";
        break;
      case EdgeType.generalizationEdge:
        relationName = rel.relationLabel || "(generalization)";
        break;
      case EdgeType.realizationEdge:
        relationName = rel.relationLabel || "(realization)";
        break;
      default:
        relationName = "─";
    }

    const text = `• ${rel.sourceNodeName} ${relationName} ${rel.targetNodeName}`;
    doc.text(text, 15, currentY);
    currentY += 7;
  });

  // Збереження PDF
  doc.save("use-case-diagram-report.pdf");
}
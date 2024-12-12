import { EdgeLabelRenderer, getSmoothStepPath, SmoothStepEdge, useReactFlow } from "@xyflow/react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

function RealizationEdge(props) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label } = props;
  const [, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const { setEdges } = useReactFlow();

  const [editMode, setEditMode] = useState(false);
  const [customLabel, setCustomLabel] = useState(label);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const onClickEnableEditMode = () => setEditMode(true);
  const onKeyDownChangeLabel = (event) => {
    if (event.key === "Enter") {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          if (edge.id === id) return { ...edge, label: customLabel };
          return edge;
        })
      );
      setEditMode(false);
    }
    if (event.key === "Escape") {
      setEditMode(false);
      setCustomLabel(label);
    }
  };

  return (
    <>
      <SmoothStepEdge
        {...props}
        style={{ stroke: "black", strokeDasharray: "5 5" }}
        markerStart={"url(#triangle)"}
        label=""
      />
      <EdgeLabelRenderer>
        <div onPointerEnter={() => setDeleteVisible(true)} onPointerLeave={() => setDeleteVisible(false)}>
          {editMode ? (
            <input
              onKeyDown={onKeyDownChangeLabel}
              value={customLabel}
              onChange={(event) => setCustomLabel(event.target.value)}
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 20}px)`,
                pointerEvents: "all",
                fontStyle: "italic",
                boxShadow: "none",
                border: "none",
                appearance: "none",
                outline: "none",
                textAlign: "center",
                background: "transparent",
              }}
              autoFocus
            />
          ) : (
            <span
              className="end-arrow-edge-label"
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 20}px)`,
                pointerEvents: "all",
                cursor: "pointer",
              }}
              onClick={onClickEnableEditMode}
            >
              {label}
            </span>
          )}

          <IconButton
            title="delete edge"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "transparent",
              color: "red",
              pointerEvents: "all",
              padding: 0,
              display: deleteVisible ? "flex" : "none",
            }}
            onClick={() => setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id))}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </EdgeLabelRenderer>

      <defs>
        <marker
          id="triangle"
          markerWidth="40"
          markerHeight="40"
          viewBox="-10 -10 20 20"
          markerUnits="strokeWidth"
          orient="auto-start-reverse"
          refX="0"
          refY="0"
        >
          <polyline
            stroke-linecap="round"
            stroke-linejoin="round"
            points="-5,-4 0,0 -5,4 -5,-4"
            style={{ stroke: "black", fill: "transparent", strokeWidth: 0.5 }}
          ></polyline>
        </marker>
      </defs>
    </>
  );
}

export default RealizationEdge;

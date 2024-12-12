import { EdgeLabelRenderer, getSmoothStepPath, SmoothStepEdge, useReactFlow } from "@xyflow/react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

function CustomSmoothStepEdge(props) {
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
      <SmoothStepEdge {...props} style={{ stroke: "black" }} label="" />
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
            className="edge-delete-button"
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
    </>
  );
}

export default CustomSmoothStepEdge;

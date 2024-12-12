import "../../styles/nodeStyles/diamondNodeStyle.css";
import { Handle, NodeResizeControl, Position, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function DiamondNode({ id, data }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(data?.label || "Decision");
  const [deleteVisible, setDeleteVisible] = useState(false);

  const onChange = useCallback((evt) => {
    setTitle(evt.target.value);
  }, []);
  const onClickEditMode = () => setEditMode(true);
  const onEnterReadMode = (event) => {
    if (event.key === "Enter") {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) return { ...node, data: { label: title } };
          return node;
        })
      );
      setEditMode(false);
    }
    if (event.key === "Escape") {
      setEditMode(false);
      setTitle(data?.label);
    }
  };

  const { setNodes, setEdges } = useReactFlow();

  return (
    <div
      className="diamond-node-layout"
      onPointerEnter={() => setDeleteVisible(true)}
      onPointerLeave={() => setDeleteVisible(false)}
    >
      <NodeResizeControl
        minWidth={75}
        minHeight={75}
        color="black"
        position="top"
        style={{ zIndex: 10 }}
        keepAspectRatio
      />
      <NodeResizeControl
        minWidth={75}
        minHeight={75}
        color="black"
        position="bottom"
        style={{ zIndex: 10 }}
        keepAspectRatio
      />
      <NodeResizeControl
        minWidth={75}
        minHeight={75}
        color="black"
        position="left"
        style={{ zIndex: 10 }}
        keepAspectRatio
      />
      <NodeResizeControl
        minWidth={75}
        minHeight={75}
        color="black"
        position="right"
        style={{ zIndex: 10 }}
        keepAspectRatio
      />
      <Handle type="source" position={Position.Top} id="ts1" style={{ left: "0" }} />
      <Handle
        type="target"
        position={Position.Top}
        id="tt1"
        style={{ left: "0" }}
        isConnectableStart={false}
      />
      <Handle type="source" position={Position.Bottom} id="bs" style={{ left: "100%" }} />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bt"
        style={{ left: "100%" }}
        isConnectableStart={false}
      />
      <Handle type="source" position={Position.Left} style={{ top: "100%" }} id="ls" />
      <Handle
        type="target"
        position={Position.Left}
        id="lt"
        style={{ top: "100%" }}
        isConnectableStart={false}
      />
      <Handle type="source" position={Position.Right} id="rs" style={{ top: 0 }} />
      <Handle type="target" position={Position.Right} id="rt" style={{ top: 0 }} isConnectableStart={false} />

      <div className="diamond-node-content">
        {editMode ? (
          <input
            id="title"
            name="title"
            onChange={onChange}
            onKeyDown={onEnterReadMode}
            value={title}
            className="nodrag diamond-node-input"
            autoFocus
          />
        ) : (
          <span onClick={onClickEditMode}>{data?.label}</span>
        )}
      </div>

      <IconButton
        title="delete node"
        className="diamond-node-delete-button"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          padding: 0,
          background: "transparent",
          color: "red",
          pointerEvents: "all",
          display: deleteVisible ? "flex" : "none",
        }}
        onClick={() => {
          setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
          setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== id && edge.target !== id));
        }}
      >
        <CloseIcon style={{ width: "80%" }} />
      </IconButton>
    </div>
  );
}

export default memo(DiamondNode);

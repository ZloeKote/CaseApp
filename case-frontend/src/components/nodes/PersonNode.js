import "../../styles/nodeStyles/personNodeStyle.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";
import PersonImage from "../../images/person-image.png";

function PersonNode({ id, data }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(data?.label || "Actor");
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
      className="person-node-layout"
      onPointerEnter={() => setDeleteVisible(true)}
      onPointerLeave={() => setDeleteVisible(false)}
    >
      <NodeResizer
        minWidth={67.5}
        minHeight={120}
        handleStyle={{ backgroundColor: "black" }}
        lineStyle={{ borderColor: "transparent" }}
      />
      <Handle type="source" position={Position.Top} id="ts" />
      <Handle type="target" position={Position.Top} id="tt" isConnectableStart={false} />
      <Handle type="source" position={Position.Bottom} id="bs" />
      <Handle type="target" position={Position.Bottom} id="bt" isConnectableStart={false} />
      <Handle type="source" position={Position.Left} id="ls" />
      <Handle type="target" position={Position.Left} id="lt" isConnectableStart={false} />
      <Handle type="source" position={Position.Right} id="rs" />
      <Handle type="target" position={Position.Right} id="rt" isConnectableStart={false} />

      <div className="person-node-content">
        <img src={PersonImage} alt="person" />
        {editMode ? (
          <input
            id="title"
            name="title"
            onChange={onChange}
            onKeyDown={onEnterReadMode}
            value={title}
            className="nodrag person-node-input"
            autoFocus
          />
        ) : (
          <span onClick={onClickEditMode}>{data?.label}</span>
        )}
      </div>

      <IconButton
        title="delete node"
        style={{
          position: "absolute",
          right: 0,
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

export default memo(PersonNode);
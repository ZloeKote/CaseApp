import { useDnD } from "../context/DnDContext";
import PersonImage from "../images/person-image.png";
import LineRightArrowImage from "../images/line-right-arrow.png";
import LineImage from "../images/straight-line.png";
import IncludeEdgeImage from "../images/include-arrow.png";
import ExtendEdgeImage from "../images/extend-arrow.png";
import LineLeftFilledArrowImage from "../images/line-left-filled-arrow.png";
import RealizationEdgeImage from "../images/realization-arrow.png"

function LeftMenu({ currentEdge, changeEdge }) {
  const [, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="left-menu-layout">
      <div className="left-menu-section-flowchart">
        <h3 className="left-menu-section-title">Flowchart</h3>
        <span className="left-menu-inside-section-title">Components</span>
        <div className="left-menu-cards">
          <div
            className="element-card"
            title="Add Process"
            onDragStart={(event) => onDragStart(event, "rectangularNode")}
            draggable
          >
            <div className="element-rectangular" />
          </div>
          <div
            className="element-card"
            title="Add Decision"
            onDragStart={(event) => onDragStart(event, "diamondNode")}
            draggable
          >
            <div className="element-diamond" />
          </div>
          <div
            className="element-card"
            title="Add Terminal Box - Start/End"
            onDragStart={(event) => onDragStart(event, "ovalNode")}
            draggable
          >
            <div className="element-oval" />
          </div>
          <div
            className="element-card"
            title="Add Input/Output"
            onDragStart={(event) => onDragStart(event, "parallelogramNode")}
            draggable
          >
            <div className="element-parallelogram" />
          </div>
        </div>

        <span className="left-menu-inside-section-title">Edges</span>
        <div className="left-menu-cards">
          <div
            className={`element-edge ${currentEdge === "endArrowEdge" ? "element-edge-active" : ""}`}
            title="Edge with arrow in the end"
            onClick={() => changeEdge("endArrowEdge")}
          >
            <img className="element-arrow-img" src={LineRightArrowImage} alt="right arrow" />
          </div>
        </div>
      </div>

      <div className="left-menu-section-class">
        <h3 className="left-menu-section-title">UML Use Case Diagram</h3>
        <span className="left-menu-inside-section-title">Components</span>
        <div className="left-menu-cards">
          <div
            className="element-card"
            title="Add Actor"
            onDragStart={(event) => onDragStart(event, "personNode")}
            draggable
          >
            <img src={PersonImage} alt="Person" className="element-person-img" />
          </div>
          <div
            className="element-card"
            title="Add Use Case"
            onDragStart={(event) => onDragStart(event, "useCaseNode")}
            draggable
          >
            <div className="element-oval" />
          </div>
        </div>

        <span className="left-menu-inside-section-title">Edges</span>
        <div className="left-menu-cards">
          <div
            className={`element-edge ${currentEdge === "customSmoothStepEdge" ? "element-edge-active" : ""}`}
            title="Association"
            type="edge"
            onClick={() => changeEdge("customSmoothStepEdge")}
          >
            <img className="element-arrow-img" src={LineImage} alt="line" />
          </div>
          <div
            className={`element-edge ${currentEdge === "includeEdge" ? "element-edge-active" : ""}`}
            title="Include"
            type="edge"
            onClick={() => changeEdge("includeEdge")}
          >
            <img className="element-arrow-img" src={IncludeEdgeImage} alt="include" />
          </div>
          <div
            className={`element-edge ${currentEdge === "extendEdge" ? "element-edge-active" : ""}`}
            title="Extend"
            type="edge"
            onClick={() => changeEdge("extendEdge")}
          >
            <img className="element-arrow-img" src={ExtendEdgeImage} alt="extend" />
          </div>
          <div
            className={`element-edge ${currentEdge === "generalizationEdge" ? "element-edge-active" : ""}`}
            title="Generalization"
            type="edge"
            onClick={() => changeEdge("generalizationEdge")}
          >
            <img className="element-arrow-img" src={LineLeftFilledArrowImage} alt="generalization" />
          </div>
          <div
            className={`element-edge ${currentEdge === "realizationEdge" ? "element-edge-active" : ""}`}
            title="Realization"
            type="edge"
            onClick={() => changeEdge("realizationEdge")}
          >
            <img className="element-arrow-img" src={RealizationEdgeImage} alt="realization" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftMenu;

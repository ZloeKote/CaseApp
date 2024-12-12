import CustomMenu from "./CustomMenu";
import { useContext, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { downloadReport, downloadUseCaseReport } from "../custom-functions";
import DiagramReport from "./DiagramReport";
import UseCaseReport from "./UseCaseReport";
import ModelContext from "../context/models";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

function NavigationPanel() {
  const [openReport, setOpenReport] = useState(false);
  const [openUseCaseReport, setOpenUseCaseReport] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openDiagramMenu, setOpenDiagramMenu] = useState(false);
  const [openChangeTitleModal, setOpenChangeTitleModal] = useState(false);
  const [openChangeDescriptionModal, setOpenChangeDescriptionModal] = useState(false);

  const [diagramLabel, setDiagramLabel] = useState("");
  const [diagramDescription, setDiagramDescription] = useState("");
  const {
    currentModel,
    models,
    createModel,
    fetchModels,
    fetchModel,
    deleteModel,
    setModelTitle,
    setModelDescription,
  } = useContext(ModelContext);

  const { getNodes, getEdges, getNode } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const handleClickOpenReport = () => setOpenReport(true);
  const handleClickCloseReport = () => setOpenReport(false);
  const handleClickOpenUseCaseReport = () => setOpenUseCaseReport(true);
  const handleClickCloseUseCaseReport = () => setOpenUseCaseReport(false);
  const handleClickOpenSaveModal = () => setOpenSaveModal(true);
  const handleClickCloseSaveModal = () => setOpenSaveModal(false);
  const handleClickCloseDiagramMenu = () => setOpenDiagramMenu(false);

  const handleClickSaveDiagram = (event) => {
    event.preventDefault();

    if (diagramLabel.trim().length === 0) return;
    createModel({
      label: diagramLabel,
      description: diagramDescription,
      nodes: nodes.map((node) => {
        return {
          id: node.id,
          label: node.data.label,
          size: node.measured,
          position: node.position,
          type: node.type,
        };
      }),
      edges: edges.map((edge) => {
        return {
          id: edge.id,
          label: edge.label,
          sourceId: edge.source,
          sourceHandle: edge.sourceHandle,
          targetId: edge.target,
          targetHandle: edge.targetHandle,
          type: edge.type,
        };
      }),
    });
    handleClickCloseSaveModal();
  };

  const handleClickFetchAndOpenDiagramMenu = () => {
    fetchModels();
    setOpenDiagramMenu(true);
  };

  const handleClickOpenDiagram = (id) => {
    fetchModel(id);
    setOpenDiagramMenu(false);
  };
  const handleClickDeleteDiagram = (id) => deleteModel(id);

  const handleClickSaveCurrentDiagram = () => {
    if (currentModel.title.trim().length === 0) return;
    createModel({
      id: currentModel.id,
      label: currentModel.title,
      description: currentModel.description,
      nodes: nodes.map((node) => {
        return {
          id: node.id,
          label: node.data.label,
          size: node.measured,
          position: node.position,
          type: node.type,
        };
      }),
      edges: edges.map((edge) => {
        return {
          id: edge.id,
          label: edge.label,
          sourceId: edge.source,
          sourceHandle: edge.sourceHandle,
          targetId: edge.target,
          targetHandle: edge.targetHandle,
          type: edge.type,
        };
      }),
    });
  };

  const saveModalContent = (
    <>
      <DialogTitle>Save diagram</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To save the diagram you need to enter the name and the description of the diagram
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Diagram name"
          type="text"
          fullWidth
          variant="standard"
          value={diagramLabel}
          onChange={(event) => setDiagramLabel(event.target.value)}
        />
        <TextField
          margin="dense"
          id="desc"
          name="description"
          label="Diagram description"
          type="text"
          fullWidth
          variant="standard"
          value={diagramDescription}
          onChange={(event) => setDiagramDescription(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickCloseSaveModal}>Cancel</Button>
        <Button onClick={handleClickSaveDiagram}>Save</Button>
      </DialogActions>
    </>
  );

  let diagramsList = "";
  if (models?.length !== 0) {
    diagramsList = (
      <List>
        {models.map((model, index) => {
          return (
            <>
              <ListItemButton key={`item-buttom-${index}`} onClick={() => handleClickOpenDiagram(model.id)}>
                <ListItemText
                  key={`item-text-${index}`}
                  primary={model.title}
                  secondary={model.description}
                />
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClickDeleteDiagram(model.id);
                  }}
                  title="Delete diagram"
                >
                  <Delete color="error" />
                </IconButton>
              </ListItemButton>
              <Divider key={`divider-${index}`} />
            </>
          );
        })}
      </List>
    );
  }

  const fileElements = [
    {
      name: "Save",
      isModal: false,
      disabled: !!currentModel ? false : true,
      onClick: handleClickSaveCurrentDiagram,
    },
    {
      name: "Save as a new diagram",
      onClickOpenModal: handleClickOpenSaveModal,
      onClickCloseModal: handleClickCloseSaveModal,
      isModal: true,
      fullscreen: false,
      modalOpened: openSaveModal,
      modalContent: saveModalContent,
    },
    {
      name: "Open diagram",
      onClickOpenModal: handleClickFetchAndOpenDiagramMenu,
      onClickCloseModal: handleClickCloseDiagramMenu,
      isModal: true,
      fullscreen: true,
      modalOpened: openDiagramMenu,
      modalContent: diagramsList,
      modalName: "Open Diagram"
    },
  ];

  const generationElements = [
    {
      name: "Generate Diagram Report",
      onClickOpenModal: handleClickOpenReport,
      onClickCloseModal: handleClickCloseReport,
      onClick: () => downloadReport(nodes, edges, getNode),
      isModal: true,
      fullscreen: true,
      modalOpened: openReport,
      modalContent: <DiagramReport />,
      modalName: "Diagram Report",
    },
    {
      name: "Generate Use Case Report",
      onClickOpenModal: handleClickOpenUseCaseReport,
      onClickCloseModal: handleClickCloseUseCaseReport,
      onClick: () => downloadUseCaseReport(nodes, edges, getNode),
      isModal: true,
      fullscreen: true,
      modalOpened: openUseCaseReport,
      modalContent: <UseCaseReport />,
      modalName: "Use Case Diagram Report",
    },
  ];

  return (
    <div className="nav-content">
      <div className="nav-content-buttons">
        <CustomMenu elements={fileElements}>File</CustomMenu>
        <CustomMenu elements={generationElements}>Generate</CustomMenu>
      </div>
      {!!currentModel && (
        <div className="nav-content-model-info">
          <span onClick={() => setOpenChangeTitleModal(true)} title="Click to change the title">
            {currentModel?.title}
          </span>
          <Button onClick={() => setOpenChangeDescriptionModal(true)} variant="contained" size="small" color="warning">
            Change description
          </Button>

          <Dialog
            open={openChangeTitleModal}
            onClose={() => setOpenChangeTitleModal(false)}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                setModelTitle(formJson.title);
                setOpenChangeTitleModal(false);
              },
            }}
          >
            <DialogTitle>Change diagram title</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="title"
                name="title"
                label="Diagram title"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={currentModel?.title}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenChangeTitleModal(false)}>Cancel</Button>
              <Button type="submit">Change</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openChangeDescriptionModal}
            onClose={() => setOpenChangeDescriptionModal(false)}
            PaperProps={{
              component: "form",
              onSubmit: (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const formJson = Object.fromEntries(formData.entries());
                setModelDescription(formJson.description);
                setOpenChangeDescriptionModal(false);
              },
            }}
          >
            <DialogTitle>Change diagram description</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="description"
                name="description"
                label="Diagram description"
                type="text"
                fullWidth
                variant="standard"
                defaultValue={currentModel?.description}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenChangeDescriptionModal(false)}>Cancel</Button>
              <Button type="submit">Change</Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default NavigationPanel;

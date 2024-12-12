import { createContext, useCallback, useState } from "react";
import axios from "axios";

const ModelContext = createContext();

function Provider({ children }) {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);

  const fetchModels = useCallback(async () => {
    await axios.get("http://localhost:8080/api/v1/models").then((response) => {
      setModels(response.data);
    });
  }, []);

  const fetchModel = useCallback(async (id) => {
    await axios.get(`http://localhost:8080/api/v1/models/${id}`).then((response) => {
      setCurrentModel(response.data);
    });
  }, []);

  const deleteModel = async (id) => {
    await axios.delete(`http://localhost:8080/api/v1/models/${id}`).then(() => {
      const updatedModels = models.filter((model) => model.id !== id);
      setModels(updatedModels);
    });
  };

  const createModel = async ({ id, label, description, nodes, edges }) => {
    await axios
      .post("http://localhost:8080/api/v1/models", {
        id,
        title: label,
        description,
        nodes,
        edges,
      })
      .then((response) => {
        setCurrentModel({
          id: response.data,
          title: label,
          description: description,
          nodes: nodes,
          edges: edges,
        });
      });
  };

  const setModelTitle = (title) => {
    setCurrentModel({ ...currentModel, title: title });
  };

  const setModelDescription = (description) => {
    setCurrentModel({ ...currentModel, description: description });
  };

  const modelsToShare = {
    models,
    currentModel,
    fetchModels,
    fetchModel,
    createModel,
    deleteModel,
    setModelTitle,
    setModelDescription,
  };
  return <ModelContext.Provider value={modelsToShare}>{children}</ModelContext.Provider>;
}

export { Provider };
export default ModelContext;

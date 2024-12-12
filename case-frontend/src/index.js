import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "./context/DnDContext";
import { Provider } from "./context/models";

const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
  <ReactFlowProvider>
    <DnDProvider>
      <Provider>
        <App />
      </Provider>
    </DnDProvider>
  </ReactFlowProvider>
);

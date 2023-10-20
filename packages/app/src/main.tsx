import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import EntryPoint from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EntryPoint />
  </React.StrictMode>
);

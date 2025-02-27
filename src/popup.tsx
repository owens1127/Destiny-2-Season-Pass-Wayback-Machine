import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root")!;

createRoot(root!).render(<StrictMode>Hello World</StrictMode>);

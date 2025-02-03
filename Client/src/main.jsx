import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import SocketContextProvider from "./context/socketcontextprovider/SocketContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <SocketContextProvider>
    <App />
    <Toaster closeButton />
  </SocketContextProvider>
);

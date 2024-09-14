import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import logo from "./assets/images/logo-universal.png";
import { Greet } from "../wailsjs/go/main/App";
import Dashboard from "./components/dashboard";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇",
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <HashRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

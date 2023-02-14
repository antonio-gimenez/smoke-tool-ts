import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import WhatsNew from "./components/WhatsNew";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext";
import useThemeState from "./hooks/use-theme-state";
import SmokeTest from "./pages/SmokeTest.jsx";

function App() {
  const { value } = useThemeState();
  const html = document.querySelector("html");
  if (html) {
    html.setAttribute("data-theme", value);
  }


  return (
    <AlertProvider>
      <ModalProvider>
        <TestProvider>
          <Header />
          <div className="app container scrollable-content container-centered">
            <WhatsNew />
            <Routes>
              <Route path="/" element={<SmokeTest />} />
            </Routes>
          </div>
        </TestProvider>
      </ModalProvider>
    </AlertProvider>
  );
}

export default App;

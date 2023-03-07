import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import WhatsNew from "./components/WhatsNew";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext";
import useThemeState from "./hooks/useThemeState";
import NotFound from "./pages/NotFound";
import SmokeTest from "./pages/SmokeTest.jsx";
import ViewTest from "./pages/ViewTest";

function App() {
  const { currentTheme } = useThemeState();
  const html = document.querySelector("html");
  if (html) {
    html.setAttribute("data-theme", currentTheme);
  }

  return (
    <AlertProvider>
      <ModalProvider>
        <TestProvider>
          <Header />
          <div className="main-app">
            <WhatsNew />
            <Routes>
              <Route path="/tests" element={<SmokeTest />} />
              <Route path="/view/:id" element={<ViewTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </TestProvider>
      </ModalProvider>
    </AlertProvider >
  );
}

export default App;

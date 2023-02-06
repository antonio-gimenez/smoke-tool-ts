import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import WhatsNew from "./components/WhatsNew.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext.jsx";
import useTheme from "./hooks/use-theme.jsx";
import SmokeTest from "./pages/SmokeTest.jsx";

function App() {
  const { theme } = useTheme();
  const html = document.querySelector("html");
  if (html) {
    html.setAttribute("data-theme", theme);
  }

  return (
    <AlertProvider>
      <ModalProvider>
        {/* <TestProvider> */}
        <Header />
        <div className="app container scrollable-content container-centered">
          <WhatsNew />
          <Routes>
            <Route path="/" element={<SmokeTest />} />
          </Routes>
        </div>
        {/* </TestProvider> */}
      </ModalProvider>
    </AlertProvider>
  );
}

export default App;

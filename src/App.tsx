import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Button from "./components/ui/Button";
import WhatsNew from "./components/WhatsNew";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext";
import useThemeState from "./hooks/use-theme-state";
import SmokeTest from "./pages/SmokeTest.jsx";

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
          <div className="app container  container-centered">


            {/* 
            <div className="example">
              <h1 className="title">Some example title</h1>
              <p className="text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
                voluptates, quod, quia, voluptate quae voluptatem quibusdam quos
                accusantium quas dolorum nemo. Quisquam, quae. Quisquam, quae. Quisquam,
              </p>
            </div> */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '1rem' }}>
              <Button color={"primary"}>primary</Button>
              <Button color={"secondary"}>secondary</Button>
              <Button color={"accent"}>accent</Button>
              <Button color={"base"}>base</Button>
              <Button color={"neutral"}>neutral</Button>
              <Button color={"success"}>success</Button>
              <Button color={"error"}>error</Button>
              <Button color={"warning"}>warning</Button>
              <Button color={"info"}>info</Button>
            </div>
            <WhatsNew />
            <Routes>
              <Route path="/" element={<SmokeTest />} />
            </Routes>
          </div>
        </TestProvider>
      </ModalProvider>
    </AlertProvider >
  );
}

export default App;

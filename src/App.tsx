import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import WhatsNew from "./components/WhatsNew";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext";
import useThemeState from "./hooks/useThemeState";
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
            </div> 
             <Lightbox
              closeOnEscape={true}
              closeOnOverlayClick={true}
              trigger={<img src="https://picsum.photos/64/64" alt="img" />}
              content={<img src="https://picsum.photos/800" alt="img" />}
            /> */}
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

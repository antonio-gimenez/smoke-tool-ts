import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Lightbox from "./components/Lightbox/Lightbox";
import Button from "./components/ui/Button";
import WhatsNew from "./components/WhatsNew";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { TestProvider } from "./contexts/TestContext";
import useFileSelect from "./hooks/useFileSelect";
import useLocalStorage from "./hooks/useLocalStorage";
import useThemeState from "./hooks/useThemeState";
import SmokeTest from "./pages/SmokeTest.jsx";


const MyComponent = () => {
  const [multiple, setMultiple] = useState(false);
  const [selectedFile, handleFileSelect, clearSelectedFile] = useFileSelect({ multiple, localStorageKey: 'myFile' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      const files = Array.from(selectedFile as FileList);
      files.forEach((item) => {
        console.log(item);
      });
    }
  };

  return (
    <div>
      <label htmlFor="multiple" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} >

        <label htmlFor="multiple" className="toggle-switch">
          <input id="multiple" type="checkbox" className="checkbox" checked={multiple} onChange={() => setMultiple(!multiple)} />
          <span className="slider" />
        </label>
        <span>

          Multiple
        </span>
      </label>
      <form className="card" onSubmit={handleSubmit}>
        <label htmlFor="fileInput">
          <span className="button button-primary">Select File</span>
          <input id="fileInput" className="hidden" type="file" multiple={multiple} onChange={handleFileSelect} />
        </label>


        <button disabled={false} className="button button-accent" type="submit">Submit</button>
        <button className="button button-secondary" type="button" onClick={clearSelectedFile}>Clear</button>
      </form>
    </div>
  );
};

{/* {selectedFile &&
  <button className="button button-error" type="button" onClick={clearSelectedFile}>Clear</button>
} */}



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
            {/* <Lightbox
              closeOnEscape={true}
              closeOnOverlayClick={true}
              trigger={<img src="https://picsum.photos/64/64" alt="img" />}
              content={<img src="https://picsum.photos/800" alt="img" />}
            /> */}

            <MyComponent />

            <WhatsNew />
            {/* <Routes>
              <Route path="/" element={<SmokeTest />} />
            </Routes> */}
          </div>
        </TestProvider>
      </ModalProvider>
    </AlertProvider >
  );
}

export default App;

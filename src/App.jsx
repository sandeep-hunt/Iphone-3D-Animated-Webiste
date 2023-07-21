import React from "react";
import Nav from "./Components/Nav";
import Jumbotron from "./Components/Jumbotron";
import SoundSection from "./Components/SoundSection";
import DisplaySection from "./Components/DisplaySection";
import WebgiViewer from "./Components/WebgiViewer";

function App() {

  return (
    <div className="App">
      <Nav />
      <Jumbotron />
      <SoundSection />
      <DisplaySection />
      <WebgiViewer />
    </div>
  );
}

export default App;

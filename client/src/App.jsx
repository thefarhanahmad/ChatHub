import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chats from "./pages/Chats";

function App() {
  return (
    <div>
      {/* defining routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import Detail from "./pages/Detail";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addListing" element={<AddListing />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </>
  );
}

export default App;
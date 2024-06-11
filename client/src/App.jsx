import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import FooterPage from "./components/FooterPage";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <FooterPage/>
    </BrowserRouter>
  )
}

export default App
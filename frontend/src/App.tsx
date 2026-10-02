import "./styles/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TodoDashboard } from "./pages/TodoDashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { LoadingProvider } from "./hooks/useLoading";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;

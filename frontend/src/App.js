import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Reset from "./pages/reset/Reset";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

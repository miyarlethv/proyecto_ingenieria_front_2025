import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './formularios/inicio_sesion'
import RegistroFormulario from './formularios/registros'
import Index from './formularios/index';
import BienvenidaUsuario from './formularios/bienvenidaUsuario';
import BienvenidaFundacion from './formularios/bienvenidaFundacion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/bienvenidaFundacion" element={<BienvenidaFundacion />} />
      </Routes>
    </Router>
  );
}
export default App

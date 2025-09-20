import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './formularios/inicio_sesion'
import RegistroFormulario from './formularios/registros'
import Index from './formularios/index';
import BienvenidaUsuario from './formularios/bienvenidaUsuario';
import BienvenidaFundacion from './formularios/bienvenidaFundacion';
import RecuperarContraseña from './formularios/RecuperarContraseña';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/bienvenidaFundacion" element={<BienvenidaFundacion />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
      </Routes>
    </Router>
  );
}
export default App

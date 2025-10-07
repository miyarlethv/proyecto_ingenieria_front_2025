import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './formularios/inicio_sesion'
import RegistroFormulario from './formularios/registros'
import Index from './formularios/index';
import BienvenidaUsuario from './formularios/bienvenidaUsuario';
import BienvenidaFundacion from './formularios/bienvenidaFundacion';
import Dashboard from './formularios/dashboard';
import RecuperarContraseña from './formularios/RecuperarContraseña';
import HistoriaClinica from './formularios/historiaClinica';
import CrearHistoria from './formularios/crearHistoria';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/bienvenidaFundacion" element={<BienvenidaFundacion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/HistoriaClinica" element={<HistoriaClinica />} />
        <Route path="/crearHistoria/:mascotaId" element={<CrearHistoria />} />

      </Routes>
    </Router>
  );
}
export default App

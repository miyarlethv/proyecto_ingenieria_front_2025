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
import GestionRoles from './formularios/gestionRoles';
import GestionPermisos from './formularios/gestionPermisos';
import CrearFuncionarios from './formularios/crearFuncionario';
import InventarioFundacion from "./formularios/inventariofundacion";
import Categorias from "./formularios/categorias";
import GraficaInventario from "./formularios/graficaInventario";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/bienvenidaFundacion" element={<BienvenidaFundacion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/HistoriaClinica" element={<HistoriaClinica />} />
        <Route path="/crearHistoria/:mascotaId" element={<CrearHistoria />} />
        <Route path="/GestionRoles" element={<GestionRoles />} />
        <Route path="/GestionPermisos" element={<GestionPermisos />} />
        <Route path="/CrearFuncionarios" element={<CrearFuncionarios />} />
        <Route path="/inventariofundacion" element={<InventarioFundacion />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/graficaInventario" element={<GraficaInventario />} />
      </Routes>
    </Router>
  );
}

export default App;
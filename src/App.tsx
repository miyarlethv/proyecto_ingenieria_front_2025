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
import DashboardLayout from './components/DashboardLayout';
import InventarioFundacion from "./formularios/inventariofundacion";
import Categorias from "./formularios/categorias";
import GraficaInventario from "./formularios/graficaInventario";
import SolicitudAdopcion from "./formularios/solicitudAdopcion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/BienvenidaFundacion" element={<DashboardLayout><BienvenidaFundacion /></DashboardLayout>} />
        <Route path="/HistoriaClinica" element={<DashboardLayout><HistoriaClinica /></DashboardLayout>} />
        <Route path="/crearHistoria/:mascotaId" element={<DashboardLayout><CrearHistoria /></DashboardLayout>} />
        <Route path="/GestionRoles" element={<DashboardLayout><GestionRoles /></DashboardLayout>} />
        <Route path="/GestionPermisos" element={<DashboardLayout><GestionPermisos /></DashboardLayout>} />
        <Route path="/CrearFuncionarios" element={<DashboardLayout><CrearFuncionarios /></DashboardLayout>} />
        <Route path="/inventariofundacion" element={<DashboardLayout><InventarioFundacion /></DashboardLayout>} />
        <Route path="/categorias" element={<DashboardLayout><Categorias /></DashboardLayout>} />
        <Route path="/graficas-inventario" element={<DashboardLayout><GraficaInventario /></DashboardLayout>} />
        <Route path="/solicitudes-adopcion" element={<DashboardLayout><SolicitudAdopcion /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
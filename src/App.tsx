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


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/registro" element={<RegistroFormulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/bienvenidaUsuario" element={<BienvenidaUsuario />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        
        {/* Rutas administrativas con sidebar */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/bienvenidaFundacion" element={<DashboardLayout><BienvenidaFundacion /></DashboardLayout>} />
        <Route path="/HistoriaClinica" element={<DashboardLayout><HistoriaClinica /></DashboardLayout>} />
        <Route path="/crearHistoria/:mascotaId" element={<DashboardLayout><CrearHistoria /></DashboardLayout>} />
        <Route path="/GestionRoles" element={<DashboardLayout><GestionRoles /></DashboardLayout>} />
        <Route path="/GestionPermisos" element={<DashboardLayout><GestionPermisos /></DashboardLayout>} />
        <Route path="/CrearFuncionarios" element={<DashboardLayout><CrearFuncionarios /></DashboardLayout>} />

      </Routes>
    </Router>
  );
}
export default App

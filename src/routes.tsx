import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"

import Login from "./pages/login/login";
import ListaSalasDocentes from "./pages/docentes/listarSalas";
import ListaSalasTecnico from "./pages/tecnico/listarSalas";
import MinhasReservas from "./pages/docentes/reservaDocente";
import DashboardAdm from "./pages/adm/dashboardAdm";
import LayoutBase from "./components/LayoutBase";
import CriarUsuario from "./pages/adm/criarUsuarios";
import Calendario from "./pages/adm/Calendario";
import ReservasSolicitadas from "./pages/adm/ReservasSolicitadas";
import TelaDispositivos from "./pages/tecnico/ListarDispositivos"; // Verifique o caminho real do arquivo

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>

                <Route element={<LayoutBase />}>
                    <Route path="/listar-salas-docentes" element={<ListaSalasDocentes />}/>
                    <Route path="/listar-salas-tecnico" element={<ListaSalasTecnico />}/>
                    <Route path="/dispositivos" element={<TelaDispositivos />}/> 

                    
                    <Route path="/minhas-reservas" element={<MinhasReservas />}/>
                    <Route path="/dashboard-adm" element={<DashboardAdm />}/>
                    <Route path="/criar-usuario" element={<CriarUsuario />}/>
                    <Route path="/calendario" element={<Calendario />} />
                    <Route path="/reservas-solicitadas" element={<ReservasSolicitadas />}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes
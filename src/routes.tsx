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


function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>

                <Route element={<LayoutBase />}>
                    <Route path="/listar-salas-docentes" element={<ListaSalasDocentes />}/>
                    <Route path="/listar-salas-tecnico" element={<ListaSalasTecnico />}/>
                    <Route path="/minhas-reservas" element={<MinhasReservas />}/>
                    <Route path="/dashboard-adm" element={<DashboardAdm />}/>
                    <Route path="/criar-usuario" element={<CriarUsuario />}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes
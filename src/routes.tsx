import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom"

import Login from "./pages/login/login";
import ListarSalas from "./pages/docentes/listarSalas";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/listar-salas" element={<ListarSalas />}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes
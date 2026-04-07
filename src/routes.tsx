<<<<<<< HEAD
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"

import Login from "./pages/login/login";
import ListaSalasDocentes from "./pages/docentes/listarSalas";
import ListaSalasTecnico from "./pages/tecnico/listarSalas";
import LayoutBase from "./components/LayoutBase";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />

                <Route element={<LayoutBase />}>
                    <Route path="/listar-salas-docentes" element={<ListaSalasDocentes />} />
                    <Route path="/listar-salas-tecnico" element={<ListaSalasTecnico />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes;
=======
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom"

import Login from "./pages/login/login";
import ListaSalasDocentes from "./pages/docentes/listarSalas";
import ListaSalasTecnico from "./pages/tecnico/listarSalas";
import MinhasReservas from "./pages/docentes/reservaDocente";



function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/listar-salas-docentes" element={<ListaSalasDocentes />}/>
                <Route path="/listar-salas-tecnico" element={<ListaSalasTecnico />}/>
                <Route path="/minhas-reservas" element={<MinhasReservas />}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes
>>>>>>> 1e409f06be5f65fd2f90d53147bcc980f17cde08

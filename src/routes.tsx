import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom"

import Login from "./pages/login/login";

//apenas para teste:
import { StarAnimation } from "./pages/dashbords/testeDashBord";


function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/baseJhon" element={<StarAnimation />}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes
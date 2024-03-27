import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    return <Navigate to='/signIn' replace/>
    
}

export default Logout;
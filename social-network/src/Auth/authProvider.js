import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";


const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const isAuth = token ? true : false;
  if(!isAuth){
    return <Navigate to='/signIn' replace/>
  }

  // Provide the authentication context to the children components
  return (
    children
  );
};

export default AuthProvider;
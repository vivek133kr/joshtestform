import { useContext, useEffect, useState } from "react";

import { useNavigate, Navigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { DataContext } from "../context/dataContext";

export const PrivateRoute = ({ children }) => {
    const {id} = useParams()
    let { loginRequired } = useContext(DataContext);
  
let [login, setLogin] = useState(localStorage.getItem("login"));
let [token, setToken] = useState(localStorage.getItem(`formId${id}_token`));
  if (login !== "done" ||  token == undefined || login == undefined) {
    return <Navigate to={`/scholarship/upsc/submit-form/${id}/login`} />;
  }
  return children;
};

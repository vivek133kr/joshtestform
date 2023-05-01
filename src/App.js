import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import BasicModal from "./components/FormComponents/NameComponent/GooglePopUp";
import { DataContext } from "./context/dataContext";
import { PrivateRoute } from "./components/privateRoute";
import { PrivateLoginRoute } from "./components/loginRoute";
import CircularStatic from "./components/FormComponents/NameComponent/Progress";

function App() {
  const location = useLocation()
  const {loginRequired} = useContext(DataContext)
  
  console.log(loginRequired, " checking loginRequired line 23")
  return (
    <div>
      <Routes>
        <Route path={`/scholarship/upsc/submit-form/:id`} element={<Home />} />
        <Route
          path={`/scholarship/upsc/submit-form/:id/login`}
          element={
            <PrivateLoginRoute>
              <BasicModal />
            </PrivateLoginRoute>
          }
        />
        
      </Routes>
    </div>
  );
}

export default App;

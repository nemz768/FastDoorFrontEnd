import './App.css'
import {SiteRoutes} from "./Routes/SiteRoutes.jsx";
import React from "react";
import {AuthProvider} from "./modules/Auth/AuthContext.jsx";

export function App() {
  return (
    <>
        <AuthProvider>
            <SiteRoutes/>
        </AuthProvider>
    </>
  )
}
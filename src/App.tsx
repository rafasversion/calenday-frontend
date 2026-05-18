import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./assets/css/main.css";
import AppRoutes from "./AppRoutes";
import { UserStorage } from "./contexts/UserStorage";
export default function App() {
  return (
    <UserStorage>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserStorage>
  );
}

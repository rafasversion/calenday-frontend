import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import RouteGuard from "./components/RouteGuard";
import ProfilePage from "./components/User/ProfilePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import AddTaskPage from "./pages/Task/AddTaskPage";
import AddEventPage from "./pages/Event/AddEventPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteGuard requireAuth={false}>
            <Home />
          </RouteGuard>
        }
      />

      <Route
        path="/login"
        element={
          <RouteGuard requireAuth={false}>
            <LoginPage />
          </RouteGuard>
        }
      />

      <Route
        path="/register"
        element={
          <RouteGuard requireAuth={false}>
            <RegisterPage />
          </RouteGuard>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <RouteGuard requireAuth={true}>
            <Dashboard />
          </RouteGuard>
        }
      />

      <Route
        path="/tasks/new"
        element={
          <RouteGuard requireAuth={true}>
            <AddTaskPage />
          </RouteGuard>
        }
      />

      <Route
        path="/events/new"
        element={
          <RouteGuard requireAuth={true}>
            <AddEventPage />
          </RouteGuard>
        }
      />

      <Route
        path="/tasks/edit/:id"
        element={
          <RouteGuard requireAuth={true}>
            <AddTaskPage />
          </RouteGuard>
        }
      />

      <Route
        path="/events/edit/:id"
        element={
          <RouteGuard requireAuth={true}>
            <AddEventPage />
          </RouteGuard>
        }
      />

      <Route
        path="/profile"
        element={
          <RouteGuard requireAuth={true}>
            <ProfilePage />
          </RouteGuard>
        }
      />
    </Routes>
  );
}

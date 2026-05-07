import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogIn from "./components/login/LogIn";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import { useAuth } from "./context/AuthContext.jsx";
import routes from "./routes/index.js";
import { ToastContainer } from "react-toastify";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <LogIn />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;

import loadRoutes from "./routeLoader";
import Dashboard from "../components/dashboard/Dashboard";

const dynamicRoutes = loadRoutes();
const routes = [
  ...dynamicRoutes,
  {
    path: "/",
    element: <Dashboard />,
    exact: true,
  }
];

export default routes;

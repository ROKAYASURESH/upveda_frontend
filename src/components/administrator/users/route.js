import UserIndex from "./UserIndex";
import UserForm from "./UserForm";
const routes = [
  {
    path: "/user",
    element: <UserIndex />,
    exact: true,
  },
  {
    path: "/user/create",
    element: <UserForm />,
    exact: true,
  },

  {
    path: "/user/:id",
    element: <UserForm />,
    exact: true,
  },
];
export default routes;
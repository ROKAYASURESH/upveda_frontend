import MenuIndex from "./MenuIndex";
const routes = [
  {
    path: "/menu",
    element: <MenuIndex />,
    extends: true,
    exact: true,
  },
  {
    path: "/menu",
    element: <MenuIndex />,
    extends: true,
  },
];
export default routes;
import Template from "./Index";
import TemplateForm from "./Form";
const routes = [
  {
    path: "/templates",
    element: <Template />,
  },
  {
    path: "/templates/create",
    element: <TemplateForm />,
    exact: true,
  },
  {
    path: "/templates/edit/:id",
    element: <TemplateForm />,
    exact: true,
  },
];
export default routes;
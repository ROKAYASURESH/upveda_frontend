const requireRoutes = require.context("../components", true, /route\.js$/);

const loadRoutes = () => {
  const allRoutes = [];

  requireRoutes.keys().forEach((key) => {
    const moduleRoutes = requireRoutes(key).default;
    if (Array.isArray(moduleRoutes)) {
      allRoutes.push(...moduleRoutes);
    }
  });

  return allRoutes;
};

export default loadRoutes;

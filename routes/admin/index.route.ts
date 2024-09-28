import { routeDashBoard } from "./dashBoard.route";

export const routesAdmin = (app) => {
  const prefixAdmin = app.locals.prefixAdmin;
  app.use(`/${prefixAdmin}`, routeDashBoard)
};
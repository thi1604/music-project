import { routeDashBoard } from "./dashBoard.route";
import { routeSong } from "./song.route";

export const routesAdmin = (app) => {
  const prefixAdmin = app.locals.prefixAdmin;
  app.use(`/${prefixAdmin}`, routeDashBoard);
  app.use(`/${prefixAdmin}/songs`, routeSong);
};
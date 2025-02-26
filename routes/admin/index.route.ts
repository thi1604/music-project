// import { routeTopics } from "../client/topics.route";
import { routeDashBoard } from "./dashBoard.route";
import { routeSong } from "./song.route";
import { routeTopicsAdmin } from "./topics.route";

export const routesAdmin = (app) => {
  const prefixAdmin = app.locals.prefixAdmin;
  app.use(`/${prefixAdmin}`, routeDashBoard);
  app.use(`/${prefixAdmin}/songs`, routeSong);
  app.use(`/${prefixAdmin}/topics`, routeTopicsAdmin);
};
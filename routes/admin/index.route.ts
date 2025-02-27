// import { routeTopics } from "../client/topics.route";
import { routeDashBoard } from "./dashBoard.route";
import { routeSingerAdmin } from "./singer.route";
import { routeSong } from "./song.route";
import { routeTopicsAdmin } from "./topics.route";
import { routeUserAdmin } from "./users.route";

export const routesAdmin = (app :any) => {
  const prefixAdmin = app.locals.prefixAdmin;
  app.use(`/${prefixAdmin}`, routeDashBoard);
  app.use(`/${prefixAdmin}/songs`, routeSong);
  app.use(`/${prefixAdmin}/topics`, routeTopicsAdmin);
  app.use(`/${prefixAdmin}/singers`, routeSingerAdmin);
  app.use(`/${prefixAdmin}/users`, routeUserAdmin);
};
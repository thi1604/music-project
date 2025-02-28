// import { routeTopics } from "../client/topics.route";
import { authMiddleware } from "../../middlewares/auth-middlewares";
import { routeAccount } from "./account.route";
import { routeAuth } from "./auth.route";
import { routeDashBoard } from "./dashBoard.route";
import { rolesAdmin } from "./roles.route";
import { routeSetting } from "./setting.route";
import { routeSingerAdmin } from "./singer.route";
import { routeSong } from "./song.route";
import { routeTopicsAdmin } from "./topics.route";
import { routeUserAdmin } from "./users.route";

export const routesAdmin = (app :any) => {
  const prefixAdmin = app.locals.prefixAdmin;
  app.use(`/${prefixAdmin}/auth`, routeAuth);
  app.use(authMiddleware);
  app.use(`/${prefixAdmin}/dashboard`, routeDashBoard);
  app.use(`/${prefixAdmin}/songs`, routeSong);
  app.use(`/${prefixAdmin}/topics`, routeTopicsAdmin);
  app.use(`/${prefixAdmin}/singers`, routeSingerAdmin);
  app.use(`/${prefixAdmin}/users`, routeUserAdmin);
  app.use(`/${prefixAdmin}/accounts`, routeAccount);
  app.use(`/${prefixAdmin}/roles`, rolesAdmin);
  app.use(`/${prefixAdmin}/settings`, routeSetting);
};
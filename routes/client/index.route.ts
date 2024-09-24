import { routeSong } from "./song.route";
import { routeTopics } from "./topics.route"
import { routeUser } from "./user.route";
import { routeHome } from "./home.route";
import { infoUser } from "../../middlewares/client/user-middleware";


export const routesClient = (app) => {
  app.use(infoUser);
  app.use("/", routeHome);
  app.use("/topics", routeTopics);
  app.use("/songs", routeSong);
  app.use("/user", routeUser);
}
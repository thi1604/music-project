import { routeSong } from "./song.route";
import { routeTopics } from "./topics.route"


export const routesClient = (app) => {
  app.use("/topics", routeTopics);
  app.use("/songs", routeSong);
}
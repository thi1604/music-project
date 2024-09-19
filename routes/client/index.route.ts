import { routeTopics } from "./topics.route"


export const routesClient = (app) => {
  app.use("/topics", routeTopics);
}
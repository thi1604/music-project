"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesClient = void 0;
const song_route_1 = require("./song.route");
const topics_route_1 = require("./topics.route");
const user_route_1 = require("./user.route");
const home_route_1 = require("./home.route");
const singer_route_1 = require("./singer.route");
const routesClient = (app) => {
    app.use("/", home_route_1.routeHome);
    app.use("/topics", topics_route_1.routeTopics);
    app.use("/songs", song_route_1.routeSong);
    app.use("/user", user_route_1.routeUser);
    app.use("/singers", singer_route_1.routerSinger);
};
exports.routesClient = routesClient;

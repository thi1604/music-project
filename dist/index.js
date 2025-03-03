"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const system_1 = require("./config/system");
const index_route_1 = require("./routes/client/index.route");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const method_override_1 = __importDefault(require("method-override"));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
const index_route_2 = require("./routes/admin/index.route");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cookie_parser_1.default)('ThiBeo'));
app.use(express_1.default.static(`${__dirname}/public`));
const DomainBE = process.env.DOMAIN_BACKEND;
(0, database_1.connect)();
app.use((0, cors_1.default)({
    origin: `${DomainBE}`,
}));
app.locals["prefixAdmin"] = system_1.prefixAdmin;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));
app.use((0, express_flash_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, method_override_1.default)('_method'));
app.use('/tinymce', express_1.default.static(path_1.default.join(__dirname, 'node_modules', 'tinymce')));
(0, index_route_1.routesClient)(app);
(0, index_route_2.routesAdmin)(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

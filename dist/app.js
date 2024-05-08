"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logics_1 = __importDefault(require("./logics"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = require("./database");
const middlewares_1 = __importDefault(require("./middlewares"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const allowedDomains = ["*"];
const corsOptions = {
    origin: allowedDomains,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.get("/read", logics_1.default.read);
app.post("/create", middlewares_1.default.keyExist, logics_1.default.create);
const PORT = 3000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.startDatabase)();
    console.log(`App is running on port: ${PORT}`);
}));

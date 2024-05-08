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
exports.startDatabase = exports.client = void 0;
require("dotenv/config");
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new pg_1.Client({
    user: process.env.DB_USER,
    password: String(process.env.DB_PASS),
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
    ssl: false,
});
exports.client = client;
const startDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Conectar ao banco de dados
        yield client.connect();
        console.log("Database connected");
        const sqlPath = path_1.default.join(__dirname, "../../sql/bd.sql");
        const sql = fs_1.default.readFileSync(sqlPath, "utf-8");
        // Executar o script SQL
        yield client.query(sql);
        console.log("SQL script executed successfully");
    }
    catch (error) {
        console.error("Failed to initialize database:", error);
    }
});
exports.startDatabase = startDatabase;

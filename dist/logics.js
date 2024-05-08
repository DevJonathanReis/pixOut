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
require("dotenv/config");
const database_1 = require("./database");
const https_1 = __importDefault(require("https"));
// const create = (request: Request, res: Response): void => {
//   const value = Number(process.env.VALUE);
//   const ci = process.env.CI;
//   const cs = process.env.CS;
//   const newKey: Key = {
//     ...request.body,
//     createdAt: new Date(),
//   };
//   // const postData = JSON.stringify({
//   //   value,
//   //   key: request.body.key,
//   //   typeKey: request.body.typeKey,
//   // });
//   var options = {
//     method: "POST",
//     hostname: "sandbox.ws.suitpay.app",
//     path: "/api/v1/gateway/pix-payment",
//     headers: {
//       ci: ci,
//       cs: cs,
//     },
//     maxRedirects: 20,
//   };
//   var req = https.request(options, function (res) {
//     var chunks = [] as any;
//     res.on("data", function (chunk) {
//       chunks.push(chunk);
//     });
//     res.on("end", function (chunk: any) {
//       var body = Buffer.concat(chunks);
//       console.log(body.toString());
//     });
//     res.on("error", function (error) {
//       console.error(error);
//     });
//   });
//   var postData =
//     '{\r\n    "value":10.0,\r\n    "key":"62999819652",\r\n    "typeKey":"phoneNumber"\r\n}';
//   req.write(postData);
//   req.end();
// };
const create = (req, res) => {
    const value = Number(process.env.VALUE);
    const ci = process.env.CI;
    const cs = process.env.CS;
    const newKey = Object.assign(Object.assign({}, req.body), { createdAt: new Date() });
    const postData = JSON.stringify({
        value,
        key: req.body.key,
        typeKey: req.body.typeKey,
    });
    const options = {
        hostname: process.env.API,
        port: 443,
        path: process.env.API_PATH,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": postData.length,
            ci: ci,
            cs: cs,
        },
    };
    const externalRequest = https_1.default.request(options, (externalRes) => {
        let body = "";
        externalRes.on("data", (chunk) => {
            body += chunk;
        });
        externalRes.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            const responseBody = JSON.parse(body);
            if (responseBody.response === "OK") {
                const queryTemplate = `
                INSERT INTO "keys"
                    ("key", "type_key")
                VALUES
                    ($1, $2)
                RETURNING *;
                `;
                const queryResult = yield database_1.client.query(queryTemplate, [
                    req.body.key,
                    req.body.typeKey,
                ]);
                res.status(201).json(responseBody);
            }
            else {
                res.status(500).json({ message: responseBody.message });
            }
        }));
    });
    externalRequest.on("error", (e) => {
        console.error(`Problem with request: ${e.message}`);
        res.status(500).json({ message: "Erro na requisição externa" });
    });
    externalRequest.write(postData);
    externalRequest.end();
};
const read = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryResult = yield database_1.client.query("SELECT * FROM keys;");
    return res.status(200).json(queryResult.rows);
});
exports.default = { create, read };

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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const keyExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const queryTemplate = `
        SELECT * FROM "keys" WHERE "key" = $1;
    `;
    const queryResult = yield database_1.client.query(queryTemplate, [
        req.body.key,
    ]);
    if (queryResult.rowCount === 0) {
        return next();
    }
    return res.status(403).json({ message: "Chave pix já resgatada" });
});
exports.default = { keyExist };

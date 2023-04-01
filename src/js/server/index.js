"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const PORT = 8191;
const app = (0, express_1.default)();
function pathTo(...relativePath) {
    return path_1.default.join(__dirname, '..', '..', '..', ...relativePath);
}
app.use('/assets/', express_1.default.static(pathTo('assets')));
app.use('/', express_1.default.static(pathTo('public')));
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

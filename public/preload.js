"use strict";
exports.__esModule = true;
/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var electron_1 = require("electron");
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', function () {
    global.ipcRenderer = electron_1.ipcRenderer;
});

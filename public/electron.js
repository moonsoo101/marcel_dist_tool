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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// public/electron.ts
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var path = require("path");
var fs = require("fs");
var electron_devtools_installer_1 = require("electron-devtools-installer");
var image_size_1 = require("image-size");
// 1. Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
var mainWindow;
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mainWindow = new electron_1.BrowserWindow({
                // 이것들은 제가 사용하는 설정이니 각자 알아서 설정 하십시오.
                //alwaysOnTop: true,
                title: "Marcel Dist App",
                center: true,
                fullscreen: false,
                fullscreenable: false,
                kiosk: !isDev,
                resizable: true,
                minWidth: 650,
                icon: path.join(__dirname, 'icon.ico'),
                webPreferences: {
                    // 2.
                    // 웹 애플리케이션을 데스크탑으로 모양만 바꾸려면 안 해도 되지만,
                    // Node 환경처럼 사용하려면 (Node에서 제공되는 빌트인 패키지 사용 포함)
                    // true 해야 합니다.
                    nodeIntegration: false,
                    preload: path.join(__dirname, 'preload.js')
                },
                show: false
            });
            mainWindow.setIcon(path.join(__dirname, 'icon.ico'));
            mainWindow.maximize();
            mainWindow.show();
            electron_1.ipcMain.on('hello', function (event, args) {
                console.log(args);
                event.sender.send('hello', "Hello from main process: " + new Date() + ".");
            });
            // 3. and load the index.html of the app.
            if (isDev) {
                // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
                // await session.defaultSession.loadExtension(path.join(__dirname, 'react-devtools'))
                // BrowserWindow.addDevToolsExtension("C:\\Users\\정문수\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.7.0_0")
                [electron_devtools_installer_1.REACT_DEVELOPER_TOOLS, electron_devtools_installer_1.REDUX_DEVTOOLS].forEach(function (extension) {
                    electron_devtools_installer_1["default"](extension)
                        .then(function (name) { return console.log("Added Extension: " + name); })["catch"](function (err) { return console.log('An error occurred: ', err); });
                });
                mainWindow.loadURL('http://localhost:3000');
                mainWindow.webContents.openDevTools();
            }
            else {
                // 프로덕션 환경에서는 패키지 내부 리소스에 접근
                mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
            }
            // Emitted when the window is closed.
            mainWindow.on('closed', function () {
                mainWindow = undefined;
            });
            return [2 /*return*/];
        });
    });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
// The function triggered by your button
function selectImageFile(event, message) {
    // Open a dialog to ask for the file path
    var options = {
        title: 'Select Image file',
        // defaultPath: '/path/to/something/',
        // buttonLabel: 'Do it',
        filters: [
            { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }
        ],
        properties: message.multi ? ['openFile', 'multiSelections'] : ['openFile']
    };
    var fileSelectionPromise = electron_1.dialog.showOpenDialog(options);
    fileSelectionPromise.then(function (res) {
        if (res.filePaths.length === 0 || res.canceled) {
            console.log("not selected");
            event.reply("chosenFile", { code: -1, data: {} });
        }
        else {
            var retData = [];
            for (var index in res.filePaths) {
                var base64 = fs.readFileSync(res.filePaths[index]).toString('base64');
                var dimension = image_size_1["default"](res.filePaths[index]);
                retData.push({ data: base64, ext: path.extname(res.filePaths[index]), size: dimension });
            }
            event.reply("chosenFile", { code: 0, data: retData });
        }
        event.returnValue = "success";
    })["catch"](function (err) {
        console.log("=====================================");
        console.log("fileSelectionPromise error : " + err);
        console.log(err);
        console.log("=====================================");
        event.reply("chosenFile", { code: -2, data: {} });
        event.returnValue = "fail";
    });
    // const filePath = dialog.showOpenDialog({ properties: ['openFile'] })[0];
    // const fileName = path.basename(filePath);
    // // Copy the chosen file to the application's data path
    // fs.copyFile(filePath, (app.getPath('userData') + fileName), (err) => {
    //   console.log(app.getPath('userData'))
    //   if (err) throw err;
    //   console.log('Image ' + fileName + ' stored.');
    // At that point, store some information like the file name for later use
    // });
}
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on('add_img', function (event, message) {
    // event.sender.send('message', message)
    // event.returnValue = "success to receive renderer message"
    selectImageFile(event, message);
    console.log("Receive from renderer : " + message);
});

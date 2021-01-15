"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var simple_git_1 = require("simple-git");
// 1. Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
var mainWindow;
var dist_dir_path = './dist/git/marcel2021.github.io';
var git;
var localBranch = "gh-pages" + new Date().getTime();
var IPCError = /** @class */ (function (_super) {
    __extends(IPCError, _super);
    function IPCError(m, code) {
        var _this = _super.call(this, m) || this;
        _this.code = code;
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, IPCError.prototype);
        return _this;
    }
    IPCError.prototype.toString = function () {
        return "IPC Error : {code : " + this.code + ", message : " + this.message + "}\n " + this.stack;
    };
    return IPCError;
}(Error));
function createWindow() {
    return __awaiter(this, void 0, void 0, function () {
        var ssh_dir, pri_key_path, pub_key_path, config_path, old_conf, new_conf, host_path, old_host, new_host;
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
            ssh_dir = path.join(electron_1.app.getPath('home'), '.ssh');
            if (!fs.existsSync(ssh_dir)) {
                fs.mkdirSync(ssh_dir, { recursive: true });
                console.log("make .ssh dir");
            }
            pri_key_path = path.join(ssh_dir, 'id_rsa-marcel');
            if (!fs.existsSync(pri_key_path)) {
                fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/id_rsa-marcel'), pri_key_path);
                console.log("copy private key");
            }
            pub_key_path = path.join(ssh_dir, 'id_rsa-marcel.pub');
            if (!fs.existsSync(pub_key_path)) {
                fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/id_rsa-marcel.pub'), pub_key_path);
                console.log("copy pub key");
            }
            config_path = path.join(ssh_dir, 'config');
            if (!fs.existsSync(config_path)) {
                fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/config'), config_path);
                console.log("copy config");
            }
            else {
                old_conf = fs.readFileSync(config_path);
                new_conf = fs.readFileSync(path.join(__dirname, 'extraResources/.ssh/config'));
                //새로운 conf내용 없음
                if (old_conf.toString().indexOf(new_conf.toString()) === -1) {
                    fs.appendFileSync(config_path, new_conf.toString());
                    console.log("append config");
                }
                else
                    console.log("ssh config file is up to date");
            }
            host_path = path.join(ssh_dir, 'known_hosts');
            if (!fs.existsSync(host_path)) {
                fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/known_hosts'), host_path);
                console.log("copy config");
            }
            else {
                old_host = fs.readFileSync(host_path);
                new_host = fs.readFileSync(path.join(__dirname, 'extraResources/.ssh/known_hosts'));
                //새로운 conf내용 없음
                if (old_host.toString().indexOf(new_host.toString()) === -1) {
                    fs.appendFileSync(host_path, new_host.toString());
                    console.log("append config");
                }
                else
                    console.log("ssh config file is up to date");
            }
            if (!fs.existsSync(dist_dir_path))
                fs.mkdirSync(dist_dir_path, { recursive: true });
            // const img_fold = path.join(dist_dir_path, 'assets/imgs')
            // if (!fs.existsSync(img_fold)) 
            //   fs.mkdirSync(img_fold, { recursive: true })
            git = simple_git_1["default"](dist_dir_path);
            git.customBinary(path.join(__dirname, 'extraResources/MinGit/2.30.0/cmd/git.exe'));
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
function initGit(event, message) {
    return __awaiter(this, void 0, void 0, function () {
        var init_git_res, add_remote_res, err_1, remote_list, index, remove_res, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("start to init git");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 15]);
                    return [4 /*yield*/, git.init()];
                case 2:
                    init_git_res = _a.sent();
                    console.log(init_git_res);
                    return [4 /*yield*/, git.addRemote('origin', 'git@github.com-marcel:marcel2021/marcel2021.github.io.git')];
                case 3:
                    add_remote_res = _a.sent();
                    console.log(add_remote_res);
                    return [2 /*return*/, { code: 0, message: "git init success" }
                        // handle add remote error 
                    ];
                case 4:
                    err_1 = _a.sent();
                    if (!(err_1.message.indexOf("remote origin already exists") != -1)) return [3 /*break*/, 14];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 13, , 14]);
                    return [4 /*yield*/, git.getRemotes(true)];
                case 6:
                    remote_list = _a.sent();
                    index = remote_list.findIndex(function (remote) { return remote.name == 'origin'; });
                    if (!(remote_list[index].refs.push != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git' && remote_list[index].refs.fetch != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git')) return [3 /*break*/, 11];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    console.error("remote origin inits wrong");
                    return [4 /*yield*/, git.removeRemote("origin")];
                case 8:
                    remove_res = _a.sent();
                    console.debug("origin removed");
                    return [2 /*return*/, { code: 0, message: "git init&add remote success by removing wrong origin" }
                        //handle remove remote error
                    ];
                case 9:
                    error_1 = _a.sent();
                    console.error("===removeRemote fail===");
                    console.error(err_1);
                    console.error("=====================");
                    throw new IPCError("removeRemote fail", -1);
                case 10: return [3 /*break*/, 12];
                case 11:
                    console.debug("remote origin already inits, no need to init again");
                    return [2 /*return*/, { code: 0, message: "git init success, already init&add origin" }];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_2 = _a.sent();
                    console.error("===getRemotes fail===");
                    console.error(err_1);
                    console.error("=====================");
                    if (error_2 instanceof IPCError)
                        throw error_2;
                    throw new IPCError("getRemotes fail", -1);
                case 14:
                    // error for init somewhere...
                    console.log(err_1);
                    console.log("init error somewhere");
                    throw new IPCError("git init error somewhere", -1);
                case 15: return [2 /*return*/];
            }
        });
    });
}
function checkoutGit(event, message) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 8]);
                    console.log("checkout");
                    return [4 /*yield*/, git.fetch()];
                case 1:
                    _a.sent();
                    console.log("fetch success");
                    return [4 /*yield*/, git.checkoutBranch(localBranch, 'origin/gh-pages')];
                case 2:
                    _a.sent();
                    console.log("checkout success");
                    return [2 /*return*/, { code: 0, message: "git checkout new branch" }];
                case 3:
                    error_3 = _a.sent();
                    if (!(error_3.message.indexOf("already exists") !== -1)) return [3 /*break*/, 7];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, git.checkout(localBranch)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, { code: 0, message: "git checkout existing branch" }];
                case 6:
                    error_4 = _a.sent();
                    throw new IPCError("fail to checkout existing branch", -1);
                case 7: 
                // if (error instanceof IPCError)
                //   throw error;
                throw new IPCError("git checout error somewhere", -1);
                case 8: return [2 /*return*/];
            }
        });
    });
}
function gitPullPush(event, message) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 10]);
                    saveImage(message);
                    return [4 /*yield*/, git.pull().add('./*').commit("update at : " + new Date().getTime()).push('origin', 'HEAD:gh-pages')];
                case 1:
                    _a.sent();
                    console.log("push success");
                    return [4 /*yield*/, git.checkoutLocalBranch('init')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, git.deleteLocalBranch(localBranch)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { code: 0, message: "git push&checkout init branch success" }];
                case 4:
                    err_2 = _a.sent();
                    console.log("fail to checkout main local ");
                    console.log(err_2);
                    if (!(err_2.message.indexOf("already exists") != -1)) return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, git.checkout('init')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, git.deleteLocalBranch(localBranch)];
                case 7:
                    _a.sent();
                    return [2 /*return*/, { code: 0, message: "git push&checkout already existing init branch success" }];
                case 8:
                    error_5 = _a.sent();
                    throw new IPCError("gitPullPush error at checkout&delete old branch", -1);
                case 9: 
                // if (err instanceof IPCError)
                //   throw err;
                throw new IPCError("gitPullPush error somewhere", -1);
                case 10: return [2 /*return*/];
            }
        });
    });
}
// The function triggered by your button
function selectImageFile(event, message) {
    return __awaiter(this, void 0, void 0, function () {
        var options, _a, filePaths, canceled, retData, index, len, base64, dimension, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        title: 'Select Image file',
                        // defaultPath: '/path/to/something/',
                        // buttonLabel: 'Do it',
                        filters: [
                            { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }
                        ],
                        properties: message.multi ? ['openFile', 'multiSelections'] : ['openFile']
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, electron_1.dialog.showOpenDialog(options)];
                case 2:
                    _a = _b.sent(), filePaths = _a.filePaths, canceled = _a.canceled;
                    if (filePaths.length === 0 || canceled) {
                        console.log("not selected");
                        return [2 /*return*/, { code: -1, data: {} }];
                    }
                    else {
                        retData = [];
                        for (index = 0, len = filePaths.length; index < len; index++) {
                            base64 = fs.readFileSync(filePaths[index]).toString('base64');
                            dimension = image_size_1["default"](filePaths[index]);
                            retData.push({ data: base64, ext: path.extname(filePaths[index]), size: dimension });
                        }
                        return [2 /*return*/, { code: 0, data: retData }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _b.sent();
                    return [2 /*return*/, { code: -2, data: {} }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function saveImage(message) {
    var image_dir = path.join(dist_dir_path, 'assets/imgs');
    var jsonData = { photos: [], date: new Date().getTime() };
    for (var i = 0, j = message.length; i < j; i++) {
        var new_filename = void 0;
        var photo = message[i];
        if (photo["new"]) {
            var base64ContentArray = photo.src.split(",");
            // base64 content cannot contain whitespaces but nevertheless skip if there are!
            var mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0];
            var ext = mimeType.split('/')[1];
            var base64Data = base64ContentArray[1];
            fs.writeFileSync(path.join(image_dir, i + "." + ext), base64Data, 'base64');
            new_filename = "/assets/imgs/" + i + "." + ext;
            console.log("save new img : " + i + "." + ext);
        }
        //이전 파일
        else {
            var _a = path.basename(photo.src).split('.'), fileName = _a[0], ext = _a[1];
            ext = ext.split("?")[0];
            new_filename = "/assets/imgs/" + i + "." + ext;
            //순서 바뀐 경우
            if (i !== photo.idx) {
                fs.renameSync(path.join(image_dir, fileName + "." + ext), path.join(image_dir, i + "." + ext));
                console.log("rename img : " + fileName + "." + ext + " => " + i + "." + ext);
            }
        }
        jsonData.photos.push({
            "src": new_filename,
            "width": photo.width,
            "height": photo.height
        });
    }
    fs.writeFileSync(path.join(dist_dir_path, "./PhotosDatabase.json"), JSON.stringify(jsonData), 'utf8');
    var fileList = fs.readdirSync(image_dir).sort(function (a, b) {
        return parseInt(a) - parseInt(b);
    });
    for (var i = jsonData.photos.length, j = fileList.length; i < j; i++) {
        fs.unlinkSync(path.join(image_dir, fileList[i]));
        console.log("delete : " + fileList[i]);
    }
}
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.handle('add_img', function (event, message) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("call add_img from renderer");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, selectImageFile(event, message)];
            case 2:
                res = _a.sent();
                return [2 /*return*/, res];
            case 3:
                error_7 = _a.sent();
                if ("code" in error_7 && "data" in error_7)
                    return [2 /*return*/, error_7];
                return [2 /*return*/, { code: -3, data: {} }];
            case 4: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle("distribution", function (event, message) { return __awaiter(void 0, void 0, void 0, function () {
    var res, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                console.log("call distribution from renderer");
                return [4 /*yield*/, initGit(event, message)];
            case 1:
                _a.sent();
                return [4 /*yield*/, checkoutGit(event, message)];
            case 2:
                _a.sent();
                return [4 /*yield*/, gitPullPush(event, message)];
            case 3:
                res = _a.sent();
                return [2 /*return*/, res];
            case 4:
                error_8 = _a.sent();
                return [2 /*return*/, { code: -1, message: error_8.message }];
            case 5: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.handle("dist_complete", function (event, message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
            case 1:
                _a.sent();
                return [2 /*return*/, mainWindow.reload()];
        }
    });
}); });

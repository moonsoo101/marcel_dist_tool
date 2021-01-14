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
var simple_git_1 = require("simple-git");
// 1. Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
var mainWindow;
var dist_dir_path = './dist/git/marcel2021.github.io';
var git;
var localBranch = "gh-pages" + new Date().getTime();
// const options: SimpleGitOptions = {
//   baseDir: dist_dir_path,
//   binary: 'git',
//   maxConcurrentProcesses: 6
// };
console.log("resource : " + __dirname);
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
    console.debug("start to init git");
    git.init()
        .then(function onInit(initResult) { console.log(initResult); })
        .then(function () { return git.addRemote('origin', 'git@github.com-marcel:marcel2021/marcel2021.github.io.git'); })
        .then(function onRemoteAdd(addRemoteResult) { console.log(addRemoteResult); checkoutGit(event, message); })["catch"](function (err) {
        if (err.message.indexOf("remote origin already exists") != -1) {
            git.getRemotes(true)
                .then(function (remote_list) {
                var index = remote_list.findIndex(function (remote) { return remote.name == 'origin'; });
                if (remote_list[index].refs.push != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git' && remote_list[index].refs.fetch != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git') {
                    console.error("remote origin inits wrong");
                    git.removeRemote("origin").then(function () {
                        console.debug("origin removed");
                        initGit(event, message);
                    })["catch"](function (err) {
                        console.error("===removeRemote fail===");
                        console.error(err);
                        console.error("=====================");
                        event.returnValue = "fail1";
                    });
                }
                console.debug("remote origin already inits");
                checkoutGit(event, message);
            })["catch"](function (err) {
                console.error("===getRemotes fail===");
                console.error(err);
                console.error("=====================");
                event.returnValue = "fail2";
            });
        }
        console.log(err);
        console.log("init error");
    });
}
function checkoutGit(event, message) {
    console.log("checkout");
    git.fetch()
        .then(function (res) {
        console.log("fetch success");
        git.checkoutBranch(localBranch, 'origin/gh-pages')
            .then(function (res) {
            console.log("checkout success");
            gitPullPush(event, message);
        })["catch"](function (err) {
            console.log("checkout err : " + err);
            if (err.message.indexOf("already exists") !== -1)
                checkoutGit(event, message);
        });
    })["catch"](function (err) {
        console.log("Fetch error : " + err);
        event.returnValue = "fail3";
    });
}
function gitPullPush(event, message) {
    saveImage(message);
    git
        .pull()
        .add('./*')
        .commit("update at : " + new Date().getTime())
        .push('origin', 'HEAD:gh-pages')
        .then(function (res) {
        console.log("push success");
        git.checkoutLocalBranch('init')
            .then(function () {
            git.deleteLocalBranch(localBranch)
                .then(function () { return event.returnValue = "success"; })["catch"](function (err) { return event.returnValue = "fail6"; });
        })["catch"](function (err) {
            console.log("fail to checkout main local ");
            console.log(err);
            if (err.message.indexOf("already exists") != -1) {
                git.checkout('init').then(function (res) {
                    git.deleteLocalBranch(localBranch).then(function () { return event.returnValue = "success"; })["catch"](function (err) { return event.returnValue = "fail6"; });
                })["catch"](function (err) { return event.returnValue = "fail5"; });
            }
        });
    })["catch"](function (err) {
        console.log("push error ");
        console.log(err);
        event.returnValue = "fail4";
    });
}
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
            for (var index = 0, len = res.filePaths.length; index < len; index++) {
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
electron_1.ipcMain.on('add_img', function (event, message) {
    // event.sender.send('message', message)
    // event.returnValue = "success to receive renderer message"
    selectImageFile(event, message);
    console.log("Receive from renderer : " + message);
});
electron_1.ipcMain.on("distribution", function (event, message) {
    initGit(event, message);
    console.log("Receive from renderer : " + message);
});
electron_1.ipcMain.on("dist_complete", function (event, message) {
    setTimeout(function () {
        console.log("Reload");
        event.returnValue = "realod";
        mainWindow.reload();
    }, 10000);
});

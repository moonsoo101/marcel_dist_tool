// public/electron.ts
import { app, BrowserWindow, ipcMain, IpcMainEvent, dialog, OpenDialogOptions } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as fs from 'fs'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import imageSize from 'image-size'

// 1. Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
let mainWindow: BrowserWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
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
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false
  });
  mainWindow.setIcon(path.join(__dirname, 'icon.ico'))
  mainWindow.maximize();
  mainWindow.show();

  ipcMain.on('hello', (event: any, args: any) => {
    console.log(args)
    event.sender.send('hello', `Hello from main process: ${new Date()}.`)
  })

  // 3. and load the index.html of the app.
  if (isDev) {
    // 개발 중에는 개발 도구에서 호스팅하는 주소에서 로드
    // await session.defaultSession.loadExtension(path.join(__dirname, 'react-devtools'))
    // BrowserWindow.addDevToolsExtension("C:\\Users\\정문수\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.7.0_0")
    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
      installExtension(extension)
          .then((name) => console.log(`Added Extension: ${name}`))
          .catch((err) => console.log('An error occurred: ', err));
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션 환경에서는 패키지 내부 리소스에 접근
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = undefined!;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// The function triggered by your button
function selectImageFile(event: IpcMainEvent, message : any) {

  // Open a dialog to ask for the file path
  const options: OpenDialogOptions = {
    title: 'Select Image file',
    // defaultPath: '/path/to/something/',
    // buttonLabel: 'Do it',
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }
    ],
    properties: message.multi ? ['openFile', 'multiSelections'] : ['openFile']
  };

  let fileSelectionPromise = dialog.showOpenDialog(options);
  fileSelectionPromise.then(function (res) {
      if (res.filePaths.length === 0 || res.canceled)
      {
        console.log("not selected")
        event.reply("chosenFile", {code : -1, data : {}});
      }
      else
      {
        let retData = [];
        for (let index=0, len=res.filePaths.length; index<len; index++)
        {
          const base64 = fs.readFileSync(res.filePaths[index]).toString('base64');
          const dimension = imageSize(res.filePaths[index])
          retData.push({data: base64, ext : path.extname(res.filePaths[index]), size: dimension})
        }
        event.reply("chosenFile", {code : 0, data : retData});
      }
      event.returnValue = "success"
  }).catch(function(err) {
    console.log("=====================================");
    console.log("fileSelectionPromise error : " + err);
    console.log(err);
    console.log("=====================================");
    event.reply("chosenFile", {code : -2, data : {}});  
    event.returnValue = "fail"
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
ipcMain.on('add_img', (event: IpcMainEvent, message: any) => {
  // event.sender.send('message', message)
  // event.returnValue = "success to receive renderer message"
  selectImageFile(event, message);
  console.log("Receive from renderer : " + message);
})
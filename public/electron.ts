// public/electron.ts
import { app, BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent, dialog, OpenDialogOptions } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as fs from 'fs'
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import imageSize from 'image-size'
import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git';

// 1. Gabage Collection이 일어나지 않도록 함수 밖에 선언함.
let mainWindow: BrowserWindow;
const dist_dir_path = './dist/git/marcel2021.github.io'
let git: SimpleGit;
const localBranch = `gh-pages${new Date().getTime()}`

class IPCError extends Error {
  code:number
  constructor(m: string, code: number) {
      super(m);
      this.code = code
      // Set the prototype explicitly.
      Object.setPrototypeOf(this, IPCError.prototype);
  }

  toString() {
      return `IPC Error : {code : ${this.code}, message : ${this.message}}\n ${this.stack}`
  }
}

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
  const ssh_dir = path.join(app.getPath('home'), '.ssh')
  if (!fs.existsSync(ssh_dir))
  { 
    fs.mkdirSync(ssh_dir, { recursive: true })
    console.log("make .ssh dir")
  }

  const pri_key_path = path.join(ssh_dir, 'id_rsa-marcel')
  if (!fs.existsSync(pri_key_path)) 
  {
    fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/id_rsa-marcel'), pri_key_path)
    console.log("copy private key")
  }

  const pub_key_path = path.join(ssh_dir, 'id_rsa-marcel.pub')
  if (!fs.existsSync(pub_key_path))
  {
    fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/id_rsa-marcel.pub'), pub_key_path)
    console.log("copy pub key")
  }
  
  const config_path = path.join(ssh_dir, 'config')
  if (!fs.existsSync(config_path))
  {
    fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/config'), config_path)
    console.log("copy config")
  }
  else
  {
    const old_conf = fs.readFileSync(config_path)
    const new_conf = fs.readFileSync(path.join(__dirname, 'extraResources/.ssh/config'))
    //새로운 conf내용 없음
    if ( old_conf.toString().indexOf( new_conf.toString() ) === -1 )
    {
      fs.appendFileSync(config_path, new_conf.toString())
      console.log("append config")
    }
    else
      console.log("ssh config file is up to date")
  }

  const host_path = path.join(ssh_dir, 'known_hosts')
  if (!fs.existsSync(host_path))
  {
    fs.copyFileSync(path.join(__dirname, 'extraResources/.ssh/known_hosts'), host_path)
    console.log("copy config")
  }
  else
  {
    const old_host = fs.readFileSync(host_path)
    const new_host = fs.readFileSync(path.join(__dirname, 'extraResources/.ssh/known_hosts'))
    //새로운 conf내용 없음
    if ( old_host.toString().indexOf( new_host.toString() ) === -1 )
    {
      fs.appendFileSync(host_path, new_host.toString())
      console.log("append config")
    }
    else
      console.log("ssh config file is up to date")
  }

  if (!fs.existsSync(dist_dir_path)) 
    fs.mkdirSync(dist_dir_path, { recursive: true })

  // const img_fold = path.join(dist_dir_path, 'assets/imgs')
  // if (!fs.existsSync(img_fold)) 
  //   fs.mkdirSync(img_fold, { recursive: true })

  git = simpleGit(dist_dir_path);
  git.customBinary( path.join(__dirname, 'extraResources/MinGit/2.30.0/cmd/git.exe') )

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

async function initGit(event:IpcMainInvokeEvent, message:any)
{
  console.debug("start to init git")
  try {
    const init_git_res = await git.init()
    console.log(init_git_res)
    const add_remote_res = await git.addRemote('origin', 'git@github.com-marcel:marcel2021/marcel2021.github.io.git')
    console.log(add_remote_res)
    return { code : 0, message : "git init success"}
    // handle add remote error 
  } catch (err) {
    // if git already has remote
    if ( err.message.indexOf("remote origin already exists") !=-1 )
    {
      try {
        const remote_list = await git.getRemotes(true)
        const index:number = remote_list.findIndex(remote => remote.name == 'origin');
        //wrong origin
        if (remote_list[index].refs.push != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git' && remote_list[index].refs.fetch != 'git@github.com-marcel:marcel2021/marcel2021.github.io.git')
        {
          try {
            console.error("remote origin inits wrong")
            const remove_res = await git.removeRemote("origin")
            console.debug("origin removed")
            return { code : 0, message : "git init&add remote success by removing wrong origin"}
            //handle remove remote error
          } catch (error) {
            console.error("===removeRemote fail===")
            console.error(err)
            console.error("=====================")
            throw new IPCError("removeRemote fail", -1)
          }
        }
        else
        {
          console.debug("remote origin already inits, no need to init again")
          return { code : 0, message : "git init success, already init&add origin"}
        }
        // handle get remote error
      } catch (error) {
        console.error("===getRemotes fail===")
        console.error(err)
        console.error("=====================")
        if ( error instanceof IPCError)
          throw error
        throw new IPCError("getRemotes fail", -1)
      }
    }
    // error for init somewhere...
    console.log(err)
    console.log("init error somewhere")
    throw new IPCError("git init error somewhere", -1)
  }
}

async function checkoutGit(event:IpcMainInvokeEvent, message:any)
{
  try {
    console.log("checkout")
    await git.fetch()
    console.log("fetch success")
    await git.checkoutBranch(localBranch, 'origin/gh-pages')
    console.log("checkout success");
    return { code : 0, message : "git checkout new branch"}
  } catch (error) {
    if (error.message.indexOf("already exists") !==-1)
    {
      try {
        await git.checkout(localBranch)
        return { code : 0, message : "git checkout existing branch"}
      } catch (error) {
        throw new IPCError("fail to checkout existing branch", -1)
      }
    }
    // if (error instanceof IPCError)
    //   throw error;
    throw new IPCError("git checout error somewhere", -1)
  }
}

async function gitPullPush(event:IpcMainInvokeEvent, message:any)
{
  try {
    saveImage(message);
    await git.pull().add('./*').commit(`update at : ${new Date().getTime()}`).push('origin', 'HEAD:gh-pages') 
    console.log("push success");
    await git.checkoutLocalBranch('init')
    await git.deleteLocalBranch(localBranch)
    return { code : 0, message : "git push&checkout init branch success"}
  } catch (err) {
    console.log("fail to checkout main local ")
    console.log(err);
    if ( err.message.indexOf("already exists") !=-1 )
    {
      try {
        await git.checkout('init')
        await git.deleteLocalBranch(localBranch)
        return { code : 0, message : "git push&checkout already existing init branch success"}
      } catch (error) {
        throw new IPCError("gitPullPush error at checkout&delete old branch", -1)
      }
    } 
    // if (err instanceof IPCError)
    //   throw err;
    throw new IPCError("gitPullPush error somewhere", -1)
  }
}

// The function triggered by your button
async function selectImageFile(event:IpcMainInvokeEvent, message : any) {

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

  try {
    let {filePaths, canceled} = await dialog.showOpenDialog(options);  
    if (filePaths.length === 0 || canceled)
      {
        console.log("not selected")
        return {code : -1, data : {}};
      }
      else
      {
        let retData = [];
        for (let index=0, len=filePaths.length; index<len; index++)
        {
          const base64 = fs.readFileSync(filePaths[index]).toString('base64');
          const dimension = imageSize(filePaths[index])
          retData.push({data: base64, ext : path.extname(filePaths[index]), size: dimension})
        }
        return {code : 0, data : retData};
      }
  } catch (error) {
    return {code : -2, data : {}};  
  }
}

function saveImage(message:any)
{
  const image_dir = path.join(dist_dir_path, 'assets/imgs')
  let jsonData = {photos: [], date: new Date().getTime()};
  for (let i=0, j=message.length; i<j; i++)
  {
    let new_filename;
    const photo = message[i]
    if (photo.new)
    {
      const base64ContentArray = photo.src.split(",")     
      // base64 content cannot contain whitespaces but nevertheless skip if there are!
      const mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]
      const ext = mimeType.split('/')[1]
      let base64Data = base64ContentArray[1]
      fs.writeFileSync(path.join(image_dir, `${i}.${ext}`), base64Data , 'base64')
      new_filename = `/assets/imgs/${i}.${ext}`
      console.log(`save new img : ${i}.${ext}`)
    }
    //이전 파일
    else
    {
      let [fileName, ext] = path.basename(photo.src).split('.')
      ext = ext.split("?")[0]
      new_filename = `/assets/imgs/${i}.${ext}`
      //순서 바뀐 경우
      if (i!==photo.idx)
      {
        fs.renameSync(path.join(image_dir,`${fileName}.${ext}`), path.join(image_dir,`${i}.${ext}`))
        console.log(`rename img : ${fileName}.${ext} => ${i}.${ext}`)
      }
    }
    jsonData.photos.push({
      "src": new_filename,
      "width": photo.width,
      "height": photo.height
    })
  }
  fs.writeFileSync(path.join(dist_dir_path, "./PhotosDatabase.json"), JSON.stringify(jsonData), 'utf8')

  const fileList = fs.readdirSync(image_dir).sort(function(a, b)  {
    return parseInt(a) - parseInt(b);
  })

  for (let i=jsonData.photos.length, j=fileList.length; i<j; i++)
  {
    fs.unlinkSync(path.join(image_dir, fileList[i]))
    console.log(`delete : ${fileList[i]}`)
  }

}

// listen the channel `message` and resend the received message to the renderer process
ipcMain.handle('add_img', async (event:IpcMainInvokeEvent, message: any) => {
  console.log("call add_img from renderer");
  try {
    const res = await selectImageFile(event, message);
    return res;
  } catch (error) {
    if ( "code" in error && "data" in error )
      return error
    return {code : -3, data : {}};
  }
})

ipcMain.handle("distribution", async (event: IpcMainInvokeEvent, message: any) => {
  try {
    console.log("call distribution from renderer");
    await initGit(event, message)
    await checkoutGit(event, message)
    const res = await gitPullPush(event, message)
    return res
  } catch (error) {
    return {code : -1, message : error.message }
  }
})

ipcMain.handle("dist_complete", async (event: IpcMainInvokeEvent, message: any) => {
  await new Promise(resolve => setTimeout(resolve, 10000));
  return mainWindow.reload();
})
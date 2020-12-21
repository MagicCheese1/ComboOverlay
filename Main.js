const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const fs = require("fs");

let config = JSON.parse(fs.readFileSync("config.json"));

let win;

let ComboConfigReady = false;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: config.Developer ? 800 : 543,
    height: config.Developer ? 800 : 215,
    frame: false,
    alwaysOnTop: true,
    focusable: false,
    movable: true,
    resizable: false,
    opacity: 0.5,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.setIgnoreMouseEvents(true);
  if (!config.Developer)
    win.setPosition(config.Window.Position.X, config.Window.Position.Y);

  // and load the index.html of the app.
  win.loadFile("static/index.html");
  if (config.Developer) win.webContents.openDevTools();
}
function WaitForComboConfig() {
  if (ComboConfigReady == false) {
    setTimeout(
      WaitForComboConfig(),
      10000
    ); /* this checks the flag every 100 milliseconds*/
  } else {
    let windowPositon = win.getPosition();
    config.Window.Position.X = windowPositon[0];
    config.Window.Position.Y = windowPositon[1];
    fs.writeFileSync("config.json", JSON.stringify(config));
    win.close();
  }
}

app.whenReady().then(() => {
  createWindow();
  let IgnoreMouseEvents = true;
  win.webContents.send("cfg", config);
  globalShortcut.register("alt+1", () => {
    if (IgnoreMouseEvents) {
      win.setIgnoreMouseEvents(false);
      IgnoreMouseEvents = false;
      win.webContents.send("ping", true);
    } else {
      win.setIgnoreMouseEvents(true);
      IgnoreMouseEvents = true;
      win.webContents.send("ping", false);
    }
  });
  globalShortcut.register("alt+3", () => {
    win.webContents.send("ComboConfigReq", true);
    WaitForComboConfig();
  });
  globalShortcut.register("alt+2", () => {
    win.webContents.send("Reset", true);
  });
});

ipcMain.on("asynchronous-message", (event, combos) => {
  let NewCombos = [];
  for (combo in combos) {
    let name = combos[combo].Name;
    let skills = [];
    for (skill in combo.Skills) {
      let keys = [];
      let orKeys = [];
      for (key in combo.Skills[skill].Keys) {
        if (combo.Skills[skill].Keys[key]) keys.push(key);
        else if (combo.Skills[skill].orKeys[key]) orKeys.push(key);
      }
      skills.push(
        new SKeyState(
          keys,
          combos[combo].Skills[skill].leftMouse,
          combos[combo].Skills[skill].rightMouse,
          orKeys
        )
      );
    }
    NewCombos.push({ Name: name, Skills: skills });
  }
  config.Combos = NewCombos;
  ComboConfigReady = true;
});

class SKeyState {
  constructor(keys = [], leftMouse = false, rightMouse = false, orKeys = []) {
    this.Keys = keys;
    this.OrKeys = orKeys;
    this.LeftMouse = leftMouse;
    this.RightMouse = rightMouse;
  }
}

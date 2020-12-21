const iohook = require("iohook");
const electron = require("electron");
const { keyState, combo } = require("../entities");

let Current = new keyState();
let Combos = [
  new combo("BdoCombo", [
    new keyState([16, 88]),
    new keyState([32]),
    new keyState([], false, true, [65, 68]),
    new keyState([16], false, true),
    new keyState([16], true, false),
    new keyState([70]),
    new keyState([], true, true),
    new keyState([83], false, true),
    new keyState([16], false, true),
    new keyState([83], true, true),
    new keyState([81]),
    new keyState([87], false, true),
  ]),
];
var ComboState = [0, 0];
SetColors();
iohook.on("keydown", (event) => {
  Current.Keys[event.rawcode] = true;
  if (event.shiftKey) Current.Keys[16] = true;
  CheckComboProgression();
});

iohook.on("keyup", (event) => {
  Current.Keys[event.rawcode] = false;
  if (event.shiftKey) Current.Keys[16] = false;
});

iohook.on("mousedown", (event) => {
  if (event.button == 1) Current.LeftMouse = true;
  else if (event.button == 2) Current.RightMouse = true;

  CheckComboProgression();
});

iohook.on("mouseup", (event) => {
  if (event.button == 1) Current.LeftMouse = false;
  else if (event.button == 2) Current.RightMouse = false;
});

iohook.start();
console.log(ComboState);

function CheckComboProgression() {
  if (Current.has(Combos[ComboState[0]].Skills[ComboState[1]])) {
    ComboState[1]++;

    if (ComboState[1] >= Combos[ComboState[0]].Skills.length) ComboState[1] = 0;
    //console.log(ComboState[1]);

    SetColors();
  }
}
function SetColors() {
  console.log(Combos[ComboState[0]].Skills[ComboState[1]]);
  for (
    let i = 0;
    i < Combos[ComboState[0]].Skills[ComboState[1]].Keys.length;
    i++
  ) {
    try {
      if (Combos[ComboState[0]].Skills[ComboState[1]].Keys[i])
        document.getElementById(i.toString()).style.fill = "#897F00";
      else document.getElementById(i.toString()).style.fill = "Red";
    } catch (e) {}
    try {
      if (Combos[ComboState[0]].Skills[ComboState[1]].OrKeys[i])
        document.getElementById(i.toString()).style.fill = "#5B9CA2";
    } catch (e) {}
  }
  if (Combos[ComboState[0]].Skills[ComboState[1]].LeftMouse)
    document.getElementById("LPM").style.fill = "#897F00";
  else document.getElementById("LPM").style.fill = "Red";

  if (Combos[ComboState[0]].Skills[ComboState[1]].RightMouse)
    document.getElementById("PPM").style.fill = "#897F00";
  else document.getElementById("PPM").style.fill = "Red";

  document.getElementById("app2").innerText = ComboState[1];
}

electron.ipcRenderer.on("ping", (event, state) => {
  if (state == true) {
    document.getElementById("border").style.visibility = "visible";
  } else {
    document.getElementById("border").style.visibility = "hidden";
  }
});

electron.ipcRenderer.on("Reset", (event, state) => {
  ComboState[1] = 0;
  SetColors();
});

electron.ipcRenderer.on("cfg", (event, state) => {});

electron.ipcRenderer.on("ComboConfigReq", (event, state) => {
  electron.ipcRenderer.sendSync("asynchronous-message", Combos);
});

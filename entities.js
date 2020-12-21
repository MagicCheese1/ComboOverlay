class keyState {
  constructor(keys = [], leftMouse = false, rightMouse = false, orKeys = []) {
    this.Keys = new Array(300).fill(false);
    keys.forEach((k) => {
      this.Keys[k] = true;
    });
    this.OrKeys = new Array(300).fill(false);
    orKeys.forEach((k) => {
      this.OrKeys[k] = true;
    });
    this.LeftMouse = leftMouse;
    this.RightMouse = rightMouse;
  }

  has(otherKeyState = new keyState()) {
    for (let key in otherKeyState.Keys) {
      if (otherKeyState.Keys[key] && !this.Keys[key]) return false;
    }
    if (otherKeyState.LeftMouse && !this.LeftMouse) return false;
    if (otherKeyState.RightMouse && !this.RightMouse) return false;
    if (otherKeyState.OrKeys.includes(true)) {
      for (let key in otherKeyState.OrKeys) {
        if (otherKeyState.OrKeys[key] && this.Keys[key]) return true;
      }
      return false;
    }
    return true;
  }
}

class combo {
  constructor(name, skills = []) {
    this.Name = name;
    this.Skills = skills;
  }
}

exports.keyState = keyState;
exports.combo = combo;

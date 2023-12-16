var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/lib/somfy.ts
var somfy_exports = {};
__export(somfy_exports, {
  default: () => somfy_default
});
module.exports = __toCommonJS(somfy_exports);
var import_dotenv = __toESM(require("dotenv"));
var fs = __toESM(require("fs"));
import_dotenv.default.config();
var Tahoma = class {
  constructor(pod, email, password) {
    __publicField(this, "POD");
    __publicField(this, "OVERKIZ_URL", "ha101-1.overkiz.com");
    __publicField(this, "TOKEN");
    __publicField(this, "JSESSIONID");
    __publicField(this, "email");
    __publicField(this, "password");
    this.POD = pod;
    this.email = email || "";
    this.password = password || "";
  }
  get GATEWAY_URL() {
    return `https://gateway-${this.POD}.local:8443/enduser-mobile-web/1/enduserAPI`;
  }
  generateToken() {
    return __async(this, null, function* () {
      if (fs.existsSync("./somfy.json")) {
        const data = JSON.parse(fs.readFileSync("./somfy.json", "utf8"));
        this.TOKEN = data.token;
        return null;
      }
      const res = yield fetch(`https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/login`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `userId=${this.email}&userPassword=${this.password}`
      });
      this.JSESSIONID = res.headers.get("set-cookie").split(";")[0].split("=")[1];
      yield fetch(
        `https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/config/${this.POD}/local/tokens/generate`,
        {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Cookie: `JSESSIONID=${this.JSESSIONID}`
          }
        }
      ).then((res2) => res2.json()).then((data) => this.TOKEN = data.token);
      yield fetch(`https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/config/${this.POD}/local/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: "TS-Somfy",
          token: this.TOKEN,
          scope: "devmode"
        })
      });
      if (fs.existsSync("./somfy.json")) {
        fs.writeFileSync("./somfy.json", JSON.stringify({ token: this.TOKEN }));
      } else {
        fs.appendFileSync("./somfy.json", JSON.stringify({ token: this.TOKEN }));
      }
      return null;
    });
  }
  getDevices() {
    return __async(this, null, function* () {
      return yield fetch(`${this.GATEWAY_URL}/setup/devices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.TOKEN}`
        }
      }).then((res) => {
        res.json();
      }).catch((err) => console.log(err));
    });
  }
  // getDevice(deviceURL: string) {
  //   return this.call(`/setup/devices/${deviceURL}`);
  // }
  // getDeviceStates(deviceURL: string) {
  //   return this.call(`/setup/devices/${deviceURL}/states`);
  // }
  call(URL, init) {
    return __async(this, null, function* () {
      return yield fetch(`${this.GATEWAY_URL}/${URL}`, __spreadValues({
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.TOKEN}`
        }
      }, init)).then((res) => {
        res.json();
      }).catch((err) => {
        console.error(`\u26A1\uFE0F Error: ${err}`);
      });
    });
  }
};
var somfy_default = Tahoma;

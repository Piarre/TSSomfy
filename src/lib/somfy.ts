import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

class Tahoma {
  private POD: string;
  private OVERKIZ_URL = "ha101-1.overkiz.com";

  private TOKEN: string;
  private JSESSIONID: string;

  email: string;
  password: string;

  constructor(pod, email?, password?) {
    this.POD = pod;
    this.email = email || "";
    this.password = password || "";
  }

  get GATEWAY_URL(): string {
    return `https://gateway-${this.POD}.local:8443/enduser-mobile-web/1/enduserAPI`;
  }

  async generateToken() {
    if (fs.existsSync("./somfy.json")) {
      const data = JSON.parse(fs.readFileSync("./somfy.json", "utf8"));
      this.TOKEN = data.token;
      return null;
    }

    const res = await fetch(`https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/login`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `userId=${this.email}&userPassword=${this.password}`,
    });

    this.JSESSIONID = res.headers.get("set-cookie").split(";")[0].split("=")[1];

    await fetch(
      `https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/config/${this.POD}/local/tokens/generate`,
      {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Cookie: `JSESSIONID=${this.JSESSIONID}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => (this.TOKEN = data.token));

    await fetch(`https://${this.OVERKIZ_URL}/enduser-mobile-web/enduserAPI/config/${this.POD}/local/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: "TS-Somfy",
        token: this.TOKEN,
        scope: "devmode",
      }),
    });

    if (fs.existsSync("./somfy.json")) {
      fs.writeFileSync("./somfy.json", JSON.stringify({ token: this.TOKEN }));
    } else {
      fs.appendFileSync("./somfy.json", JSON.stringify({ token: this.TOKEN }));
    }

    return null;
  }

  async getDevices() {
    return await fetch(`${this.GATEWAY_URL}/setup/devices`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.TOKEN}`,
        
      },
      
    })
      .then((res) => {
        res.json();
      })
      .catch((err) => console.log(err));
  }

  // getDevice(deviceURL: string) {
  //   return this.call(`/setup/devices/${deviceURL}`);
  // }

  // getDeviceStates(deviceURL: string) {
  //   return this.call(`/setup/devices/${deviceURL}/states`);
  // }

  private async call(URL: string, init?: RequestInit) {
    return await fetch(`${this.GATEWAY_URL}/${URL}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.TOKEN}`,
      },
      ...init,
    })
      .then((res) => {
        res.json();
      })
      .catch((err) => {
        console.error(`⚡️ Error: ${err}`);
      });
  }
}

export default Tahoma;

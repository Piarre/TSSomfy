declare class Tahoma {
    private POD;
    private OVERKIZ_URL;
    private TOKEN;
    private JSESSIONID;
    email: string;
    password: string;
    constructor(pod: any, email?: any, password?: any);
    get GATEWAY_URL(): string;
    generateToken(): Promise<any>;
    getDevices(): Promise<void>;
    private call;
}

export { Tahoma as default };

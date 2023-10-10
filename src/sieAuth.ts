import axios from "axios";

export class SieAuth {
    private baseUrl?: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl;
    }

    async getToken(username: string, pass: string): Promise<string> {
        const res = await axios.post<TokenResult>(`${this.baseUrl}/login/Ingresar`, { user: username, pass: pass });
        if (res.data.json)
            return res.data.json.token;
        throw Error("incorrect username or password");
    }
}

interface TokenResult {
    json: { token: string }
}

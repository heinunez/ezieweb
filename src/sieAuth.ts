import axios from "axios";

export class SieAuth {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getToken(username: string, pass: string): Promise<string> {
        const { data } = await axios.post<TokenResult>(`${this.baseUrl}/login/Ingresar`, { user: username, pass: pass })
        return data.json.token;
    }
}

interface TokenResult {
    json: { token: string }
}

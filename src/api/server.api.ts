export const silentLoginToken = (remove = true) =>
    {
        var searchParams = new URLSearchParams(window.location.search);
        const userToken = searchParams.get("t");
        if (userToken && remove)
        {
            searchParams.delete("t");
            if (window.history.replaceState)
            {
                let params = searchParams.toString();
                if (params.length > 0) params = `?${params}`;
                window.history.replaceState(
                    {},
                    `${window.location.origin}${params}`
                );
            }
        }
    
        return userToken;
    };

class storage
{
    static local = "localStorage";
    static session = "sessionStorage";
    public storage:any

    //localStorage, sessionStorage
    constructor(storageType:any)
    {
        this.storage = window[storageType];
    }

    clear(key:string)
    {
        this.storage.removeItem(key);
    }

    readJSON(key:string)
    {
        let data = this.storage.getItem(key) || undefined;
        return data ? JSON.parse(data) : undefined;
    }

    writeJSON(key:string, data:[Object])
    {
        // console.log("writeJSON -> ", key, data)
        this.storage.setItem(key, JSON.stringify(data));
    }
}

interface UserDataType{
    token?:string
}
interface APIResponseType {
    success:boolean,
    isLoading:boolean,
    data:[]

}
export class webAPI
{
    localStorage = new storage(storage.local);
    sessionStorage = new storage(storage.session);

    clear()
    {
        this.sessionStorage.clear("user-data");
    }

    get token()
    {
        const userData = this.userData;
        return userData ? userData.token : undefined;
    }

    set token(token: string | undefined) {
        const userData = this.userData;
        if (userData) {
            userData.token = token || '';
            this.userData = userData;
        }
    }
    public get userData():UserDataType | undefined
    {
        return this.sessionStorage.readJSON("user-data");
    }
    public set userData(userData: UserDataType) {
        if (userData) {
            this.sessionStorage.writeJSON("user-data", [userData]);
        } else {
            this.sessionStorage.clear("user-data");
        }
    }
    createHeaders<T extends Record<string, string>>(authorization:boolean, hasBody = true)
    {
        let headers:Record<string,string>= { "Content-Type": "application/json; charset=utf-8" };

        if (authorization === true)
            headers["Authorization"] = "Bearer " + this.token;

        return headers as T;
    }

    async get<T extends APIResponseType>(url:string, authorization:boolean):Promise<T>
    {
        let json = {};
        let headers = this.createHeaders(authorization);
        const response = await fetch(url, { headers: headers });
        if (response.status === 200)
        {
            json = await response.json();
        }

        return json as T;
    }

    async put(url:string, data:Record<string,{}>, authorization:boolean)
    {
        return this.sendData(url, "PUT",  authorization,data);
    }

    async post(url:string, data:Record<string,{}>, authorization:boolean)
    {
        return this.sendData(url, "POST",  authorization,data);
    }

    /**
     * Delete a specific object
     * @param {String} url
     * @param {Boolean} authorization
     */
    async delete(url:string, authorization:boolean)
    {
        return this.sendData(url, "DELETE",  authorization,undefined);
    }
    async sendData(url:string, method:string, authorization:boolean,data?:Record<string,string|{}>)
    {
        const fetchMethod = method.toUpperCase();

        let headers = this.createHeaders(authorization);
        // "Content-Type": "application/x-www-form-urlencoded"
        let response = await fetch(url, {
            method: fetchMethod, // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: headers,
            redirect: "follow", // manual, *follow, err
            referrer: "no-referrer", // no-referrer, *client
        });

        let result = {};
        if (response.status === 200)
        {
            result =
                await response.json();
        }

        return result;
    }
}
class ServerApi  extends webAPI{
    async userPermissionsList()
    {
        try
        {
            const { success } = await this.get("/api/v1/permissions", true);
            return success;
        }
        catch (err)
        {
            console.log("permission", err);
            throw err;
        }
    }

    async validateToken()
    {
        return new Promise((resolve, reject) =>
        {
            if (this.token)
            {
                this.post("/api/v1/token", { token: this.token }, false)
                    .then((response:any) =>
                    {
                        if(typeof this.token !=="string"){
                            if (!response.token)
                                {
                                    reject("token is missing");
                                }
                                else
                                {
                                    this.token = response.token;
                                    resolve(true);
                                }
                        }
                    })
                    .catch((err) => reject(err));
            }
            else
            {
                reject("no token");
            }
        });
    }

    async silentLogin(token:string)
    {
        return new Promise((resolve, reject) =>
        {
            this.post("/api/v1/silent-login", { token: token }, false)
                .then((userData) =>
                {
                    console.log("silent login ", userData);

                    resolve((this.userData = userData));
                })
                .catch((err) =>
                {
                    console.log("silent login err", err);
                    reject(err);
                });
        });
    }
}

export default new ServerApi()
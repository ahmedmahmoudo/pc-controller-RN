import axios, {AxiosInstance} from "axios";

class Http {
  client: AxiosInstance;
  constructor() {
    this.client = axios.create();
  }

  call = (method: string) => {
    return this.client.get(method);
  };

  post = (method: string, action: string) => {
    return this.client.post(method, {action});
  };

  configure = (baseUrl: string) => {
    this.client.defaults.baseURL = baseUrl;
    this.client.defaults.headers = {
      "Content-Type": "application/json",
    };
    return this.call("/ping");
  };
}

export default new Http();

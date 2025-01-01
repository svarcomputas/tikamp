import { Cookies } from 'react-cookie';
import { PingApi } from '../api/api.ts';
import { Configuration } from '../api/configuration.ts';

class TikampApi {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  private accessToken = () => {
    return this.cookies.get('access_token');
  };

  private configuration = () => {
    const openapiConfig = new Configuration();
    openapiConfig.basePath = process.env.REACT_APP_API_URL;
    openapiConfig.baseOptions = {
        headers: { Authorization: 'Bearer ' + this.accessToken() },
    };
    return openapiConfig;
  };

  public pingApi = () => {
    const api = new PingApi(this.configuration());
    return api;
  };
}

export default TikampApi;

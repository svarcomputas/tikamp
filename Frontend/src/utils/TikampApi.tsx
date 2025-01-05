import { Cookies } from 'react-cookie';
import { ActivitiesApi, LeaderboardsApi, PingApi, UserActivityApi } from '../api/api.ts';
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

  public activityApi = () => {
    const api = new ActivitiesApi(this.configuration());
    return api;
  };

  public userActivityApi = () => {
    const api = new UserActivityApi(this.configuration());
    return api;
  };

  public leaderboardApi = () => {
    const api = new LeaderboardsApi(this.configuration());
    return api;
  };
}

export default TikampApi;

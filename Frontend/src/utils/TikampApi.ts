import { Cookies } from 'react-cookie';
import { ActivitiesApi, ActivityDto, TotalLeaderboardEntryDto, LeaderboardsApi, MonthlyLeaderboardEntryDto, MonthlyUserActivityDto, UserActivityApi } from '../api/api.ts';
import { Configuration } from '../api/configuration.ts';

import { AxiosCacheInstance, CacheAxiosResponse } from 'axios-cache-interceptor';
class TikampApi {
  private cookies: Cookies;
  private cache: AxiosCacheInstance;
  private monthlyUserActivityRequestId: string[]  = [];
  private monthlyLeaderboardRequestId: string[]  = [];
  private leaderboardRequestId: string | null = null;
  private userActivityApi: UserActivityApi;
  private activitiesApi: ActivitiesApi;
  private leaderboardsApi: LeaderboardsApi;
  private loggedInUserId: string = '';

  constructor(cache: AxiosCacheInstance) {
    this.cache = cache;
    this.cookies = new Cookies();
    var config = new Configuration();
    config.basePath = process.env.REACT_APP_API_URL;
    config.baseOptions = {
        headers: { Authorization: 'Bearer ' + this.accessToken() },
    };
    this.userActivityApi = new UserActivityApi(config);
    this.activitiesApi = new ActivitiesApi(config);
    this.leaderboardsApi = new LeaderboardsApi(config);
  }
  
  private accessToken = () => {
    return this.cookies.get('access_token');
  };

  public setLoggedInUser = (userId:string) => {
    this.loggedInUserId = userId;
  }

  public getMonthlyActivity = async (month: number, userId: string): Promise<MonthlyUserActivityDto> => {
    var resp = await this.userActivityApi.apiUserActivityMonthUserIdGet(month, userId);
    if(userId === this.loggedInUserId){
      this.monthlyUserActivityRequestId[month] = (resp as CacheAxiosResponse).id;
    }
    return resp.data;
  }

  public getMonthlyLeaderboard = async (month: number): Promise<MonthlyLeaderboardEntryDto[]> => {
    var resp = await this.leaderboardsApi.apiLeaderboardsMonthMonthGet(month);
    this.monthlyLeaderboardRequestId[month] = (resp as CacheAxiosResponse).id;
    return resp.data;
  }

  public getTotalLeaderboard = async (): Promise<TotalLeaderboardEntryDto[]> => {
    var resp = await this.leaderboardsApi.apiLeaderboardsTotalGet();
    this.leaderboardRequestId = (resp as CacheAxiosResponse).id;
    return resp.data;
  }

  public getActivities = async (): Promise<ActivityDto[]> => {
    var resp = await this.activitiesApi.apiActivitiesGet();
    return resp.data.toSorted((a,b) => (a.month ?? 0) - (b.month ?? 0));
  }
  
  public evictCache = async (month: number) => {
    let activityId = this.monthlyUserActivityRequestId[month];
    let monthlyLedearboardId = this.monthlyLeaderboardRequestId[month];
    this.cache.storage.remove(activityId);
    this.cache.storage.remove(this.leaderboardRequestId ?? '');
    this.cache.storage.remove(monthlyLedearboardId);
  }

  public putUserActivity = async (day: number, quantity: number, month: number): Promise<any> => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    await this.userActivityApi.apiUserActivityPut({
      date: `2025-${monthStr}-${dayStr}T00:00:00.000Z`,
      quantity,
    });
    await this.evictCache(month);
  }
}

export default TikampApi;

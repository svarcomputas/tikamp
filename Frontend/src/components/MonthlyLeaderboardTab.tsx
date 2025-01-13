// MonthlyLeaderboardTab.tsx
import React, { useEffect, useState } from 'react';
import { ActivityDto, LeaderboardEntryDto, MonthlyLeaderboardEntryDto } from '../api';
import '../styles/MonthlyTab.css';
import MonthSelector from './MonthSelector';
import TikampApi from '../utils/TikampApi';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import { ClipLoader } from 'react-spinners';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  monthIndex: number;
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  leaderboardUpdated: () => void;
  shouldFetchLeaderboard: Boolean;
  loggedInUserId: string;
  api: TikampApi;
  onSelectEntry: (entry: LeaderboardEntryDto | null) => void;
}

const MonthlyLeaderboardTab: React.FC<Props> = ({
  monthIndex, 
  monthName,
  onNextMonth,
  onPreviousMonth,
  leaderboardUpdated,
  shouldFetchLeaderboard,
  loggedInUserId,
  api,
  onSelectEntry,
}) => {
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<MonthlyLeaderboardEntryDto[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorOccurd, setErrorOccurd] = useState(false);
  useEffect(() => {
    if(shouldFetchLeaderboard){
      setLoadingLeaderboard(true);
      const fetchData = async () => {
        await api.getMonthlyLeaderboard(monthIndex + 1)
        .then((data) => setMonthlyLeaderboard(data))
        .catch((error) => {
          setErrorOccurd(true);
          console.error(error)});
        leaderboardUpdated();
        setLoadingLeaderboard(false);
      }
      fetchData();
    }
  }, [monthIndex, api, shouldFetchLeaderboard, leaderboardUpdated]);


  useEffect(() => {
    const fetchData = async () => {
    await api.getActivities()
      .then((data) => setMonthlyActivity(data))
      .catch((error) => console.error(error));
      setLoadingActivities(false);
    }
    fetchData();
  }, [api]);
  return (
    <div className="monthly-tab">
      {loadingActivities ? (
        <div className="spinner-container">
          <ClipLoader size={40} color="#000" />
        </div>
      ) : (errorOccurd ? (<ErrorDisplay /> ) : (
        <>
          <MonthSelector 
            monthName={monthName}
            monthIndex={monthIndex}
            onNextMonth={onNextMonth}
            onPreviousMonth={onPreviousMonth}
            activity={monthlyActivity[monthIndex]}/>
          {loadingLeaderboard ? (
            <div className="spinner-container">
              <ClipLoader size={40} color="#000" />
            </div>
          ) : (
            <MonthlyLeaderboard
              entries={monthlyLeaderboard}
              onSelectEntry={onSelectEntry}
              activity={monthlyActivity[monthIndex]}
              loggedInUserId={loggedInUserId}
              />
          )}
        </>
      ))}
    </div>
  );
};

export default MonthlyLeaderboardTab;

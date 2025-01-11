// MonthlyLeaderboardTab.tsx
import React, { useEffect, useState } from 'react';
import { ActivityDto, LeaderboardEntryDto, MonthlyLeaderboardEntryDto } from '../api';
import '../styles/MonthlyTab.css';
import MonthSelector from './MonthSelector';
import TikampApi from '../utils/TikampApi';
import MonthlyLeaderboard from './MonthlyLeaderboard';

interface Props {
  monthIndex: number;
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  loggedInUserId: string;
  api: TikampApi;
  onSelectEntry: (entry: LeaderboardEntryDto | null) => void;
}

const MonthlyLeaderboardTab: React.FC<Props> = ({
  monthIndex, 
  monthName,
  onNextMonth,
  onPreviousMonth,
  loggedInUserId,
  api,
  onSelectEntry,
}) => {
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<MonthlyLeaderboardEntryDto[]>([]);
  
  useEffect(() => {
    api.getMonthlyLeaderboard(monthIndex + 1)
      .then((data) => setMonthlyLeaderboard(data))
      .catch((error) => console.error(error));
  }, [monthIndex, api]);


  useEffect(() => {
    api.getActivities()
      .then((data) => setMonthlyActivity(data))
      .catch((error) => console.error(error));
  }, [api]);
  return (
    <div className="monthly-tab">
      <MonthSelector 
        monthName={monthName}
        monthIndex={monthIndex}
        onNextMonth={onNextMonth}
        onPreviousMonth={onPreviousMonth}
        activity={monthlyActivity[monthIndex]}/>
      <MonthlyLeaderboard
        entries={monthlyLeaderboard}
        onSelectEntry={onSelectEntry}
        activity={monthlyActivity[monthIndex]}
        loggedInUserId={loggedInUserId}
        />
    </div>
  );
};

export default MonthlyLeaderboardTab;

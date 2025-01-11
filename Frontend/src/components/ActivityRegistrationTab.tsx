// MonthlyContainer.tsx
import React, { useEffect, useState } from 'react';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, LeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyTab.css';
import MonthSelector from './MonthSelector';
import TikampApi from '../utils/TikampApi';

interface Props {
  monthIndex: number;
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  loggedInUserId: string;
  entryToDisplayFor: LeaderboardEntryDto | null;
  api: TikampApi;
  resetSelectedEntry: () => void;
}

const ActivityRegistrationTab: React.FC<Props> = ({
  monthIndex, 
  monthName,
  onNextMonth,
  onPreviousMonth,
  loggedInUserId,
  entryToDisplayFor,
  api,
  resetSelectedEntry,
}) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    await api.putUserActivity(day, quantity, monthIndex +1)
  };

  useEffect(() => {
    api.getMonthlyActivity(monthIndex+1, entryToDisplayFor?.userId ?? loggedInUserId)
      .then((data) => setMonthlyData(data))
      .catch((error) => console.error(error));
  }, [monthIndex, api, entryToDisplayFor, loggedInUserId]);

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
      <MonthlyOverview
        monthIndex={monthIndex}
        monthName={monthName}
        loggedInUserId={loggedInUserId}
        data={monthlyData}
        displayingForEntry={entryToDisplayFor}
        activity={monthlyActivity[monthIndex]}
        onUpdateQuantity={handleUpdateQuantity}
        resetSelectedEntry={resetSelectedEntry}
        />
    </div>
  );
};

export default ActivityRegistrationTab;

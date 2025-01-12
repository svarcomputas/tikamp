// MonthlyContainer.tsx
import React, { useEffect, useState } from 'react';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, LeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyTab.css';
import MonthSelector from './MonthSelector';
import TikampApi from '../utils/TikampApi';
import { ClipLoader } from 'react-spinners';

interface Props {
  monthIndex: number;
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  dataUpdated: () => void;
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
  dataUpdated,
  loggedInUserId,
  entryToDisplayFor,
  api,
  resetSelectedEntry,
}) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);
  const [loadingUserActivity, setLoadingUserActivity] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    await api.putUserActivity(day, quantity, monthIndex +1)
    dataUpdated();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUserActivity(true);
      await api.getMonthlyActivity(monthIndex+1, entryToDisplayFor?.userId ?? loggedInUserId)
        .then((data) => setMonthlyData(data))
        .catch((error) => console.error(error));
      setLoadingUserActivity(false);
    }
    fetchData();
  }, [monthIndex, api, entryToDisplayFor, loggedInUserId]);

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
          ) : (
      <>
        <MonthSelector 
          monthName={monthName}
          monthIndex={monthIndex}
          onNextMonth={onNextMonth}
          onPreviousMonth={onPreviousMonth}
          activity={monthlyActivity[monthIndex]}/>
        {loadingUserActivity ? (
          <div className="spinner-container">
            <ClipLoader size={40} color="#000" />
          </div>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
};

export default ActivityRegistrationTab;

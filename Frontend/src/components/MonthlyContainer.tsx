// MonthlyContainer.tsx
import React, { useEffect, useState } from 'react';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, LeaderboardEntryDto, MonthlyLeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyContainer.css';
import MonthSelector from './MonthSelector';
import TikampApi from '../utils/TikampApi';
import { Tabs, TabsRef } from "flowbite-react";

interface Props {
  loggedInUserId: string;
  entryToDisplayFor: LeaderboardEntryDto | null;
  api: TikampApi;
  onSelectEntry: (entry: LeaderboardEntryDto | null) => void;
  setActiveTab: (value: React.SetStateAction<number>) => void;
  tabsRefMonthly: React.RefObject<TabsRef | null>;
}

const MonthlyContainer: React.FC<Props> = ({
  loggedInUserId,
  entryToDisplayFor,
  api,
  onSelectEntry,
  setActiveTab,
  tabsRefMonthly
}) => {
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [monthIndex, setMonthIndex] = useState(0); // TODO get current
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<MonthlyLeaderboardEntryDto[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    await api.putUserActivity(day, quantity, monthIndex +1)
  };

  const handleNextMonth = () => {
    setMonthIndex((prev) => (prev < 11 ? prev + 1 : prev));
  };

  const handlePreviousMonth = () => {
    setMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const resetSelectedEntry = () => {
    onSelectEntry(null)
  };

  useEffect(() => {
    api.getMonthlyActivity(monthIndex+1, entryToDisplayFor?.userId ?? loggedInUserId)
      .then((data) => setMonthlyData(data))
      .catch((error) => console.error(error));
  }, [monthIndex, api, entryToDisplayFor, loggedInUserId]);
  
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
    <div className="monthly-container">
      <MonthSelector 
        monthName={months[monthIndex]}
        monthIndex={monthIndex}
        onNextMonth={handleNextMonth}
        onPreviousMonth={handlePreviousMonth}
        activity={monthlyActivity[monthIndex]}/>
      <Tabs className="month-tabs-button" aria-label="Default tabs" ref={tabsRefMonthly} onActiveTabChange={(tab) => setActiveTab(tab)} variant="default">
        <Tabs.Item active title="Aktivitets registrering">
          <MonthlyOverview
            monthIndex={monthIndex}
            monthName={months[monthIndex]}
            loggedInUserId={loggedInUserId}
            data={monthlyData}
            displayingForEntry={entryToDisplayFor}
            activity={monthlyActivity[monthIndex]}
            onUpdateQuantity={handleUpdateQuantity}
            resetSelectedEntry={resetSelectedEntry}
          />
        </Tabs.Item>
        <Tabs.Item title="Resultattavle">
          <MonthlyLeaderboard
            entries={monthlyLeaderboard}
            onSelectEntry={onSelectEntry}
            activity={monthlyActivity[monthIndex]}
            loggedInUserId={loggedInUserId}
          />
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default MonthlyContainer;

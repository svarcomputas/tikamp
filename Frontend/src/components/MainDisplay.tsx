// MainDisplay.tsx
import { useEffect, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import MonthlyContainer from './MonthlyContainer';
import { ActivityDto, LeaderboardEntryDto, MonthlyLeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MainDisplay.css';
import TikampApi from '../utils/TikampApi';
import { useMsal } from '@azure/msal-react';
import { Flowbite, Tabs } from "flowbite-react";


interface MainDisplayProps {
  api: TikampApi;
}

const  MainDisplay: React.FC<MainDisplayProps> = ({ api }) => {
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const { accounts } = useMsal();
  const idOfLoggedInUser = accounts.length > 0 ? accounts[0].localAccountId : '';
  const [idOfDisplayedUser, setIdOfDisplayedUser] = useState<string | null>(idOfLoggedInUser);
  const [monthIndex, setMonthIndex] = useState(0);
  const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<MonthlyLeaderboardEntryDto[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);
  api.setLoggedInUser(idOfLoggedInUser ?? '');

  const handleNextMonth = () => {
    setMonthIndex((prev) => (prev < 11 ? prev + 1 : prev));
  };

  const handlePreviousMonth = () => {
    setMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const updateMonthlyActivityForUser = async (userId: string) => {
    await api.getMonthlyActivity(monthIndex+1, userId)
      .then((data) => setMonthlyData(data))
      .catch((error) => console.error(error));
  }

  const handleSelectTotalEntry = async (entry: LeaderboardEntryDto) => {
    setIdOfDisplayedUser(entry.userId ?? idOfLoggedInUser)
    await updateMonthlyActivityForUser(entry.userId ?? '')
  };

  const handleSelectMonthlyEntry = async (entry: LeaderboardEntryDto) => {
    setIdOfDisplayedUser(entry.userId ?? idOfLoggedInUser)
    await updateMonthlyActivityForUser(entry.userId ?? '')
  };

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    await api.putUserActivity(day, quantity, monthIndex +1)
  };

  useEffect(() => {
    api.getTotalLeaderboard()
      .then((data) => setTotalLeaderboard(data))
      .catch((error) => console.error(error));

    api.getActivities()
      .then((data) => setMonthlyActivity(data))
      .catch((error) => console.error(error));
  }, [api]);

  useEffect(() => {    
    api.getMonthlyActivity(monthIndex+1, idOfDisplayedUser ??'')
      .then((data) => setMonthlyData(data))
      .catch((error) => console.error(error));

    api.getMonthlyLeaderboard(monthIndex + 1)
      .then((data) => setMonthlyLeaderboard(data))
      .catch((error) => console.error(error));
  }, [monthIndex, api, idOfDisplayedUser]);

  return (
    <div className="main-container">
      
    <Flowbite>
       <Tabs aria-label="Default tabs" variant="default">
        <Tabs.Item active title="Månedlig oversikt">
          
          <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSelectTotalEntry} />
        </Tabs.Item>
        <Tabs.Item title="Total oversikt">
          <MonthlyContainer
            monthName={months[monthIndex]}
            monthIndex={monthIndex}
            onNextMonth={handleNextMonth}
            onPreviousMonth={handlePreviousMonth}
            leaderboardEntries={monthlyLeaderboard}
            monthlyData={monthlyData}
            loggedInUserId={idOfLoggedInUser}
            onSelectEntry={handleSelectMonthlyEntry}
            onUpdateQuantity={handleUpdateQuantity}
            activity={monthlyActivity[monthIndex]}
          />
        </Tabs.Item>
      </Tabs>
      </Flowbite>
      {/* <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSelectTotalEntry} />
      <MonthlyContainer
        monthName={months[monthIndex]}
        monthIndex={monthIndex}
        onNextMonth={handleNextMonth}
        onPreviousMonth={handlePreviousMonth}
        leaderboardEntries={monthlyLeaderboard}
        monthlyData={monthlyData}
        loggedInUserId={idOfLoggedInUser}
        onSelectEntry={handleSelectMonthlyEntry}
        onUpdateQuantity={handleUpdateQuantity}
        activity={monthlyActivity[monthIndex]}
      /> */}
    </div>
  );
}

export default MainDisplay;

// MainDisplay.tsx
import { useEffect, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import MonthlyContainer from './MonthlyContainer';
import { LeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MainDisplay.css';
import TikampApi from '../utils/TikampApi';

function MainDisplay() {
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [monthIndex, setMonthIndex] = useState(0);
  const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);

  const api = new TikampApi();
  const userActivityApi = api.userActivityApi();

  const handleNextMonth = () => {
    setMonthIndex((prev) => (prev < 11 ? prev + 1 : prev));
  };

  const handlePreviousMonth = () => {
    setMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSelectTotalEntry = async (entry: LeaderboardEntryDto) => {
    userActivityApi
      .apiUserActivityMonthUserIdGet(monthIndex+1, entry.userId ?? '')
      .then((response) => setMonthlyData(response.data))
      .catch((error) => console.error(error));
  };

  const handleSelectMonthlyEntry = async (entry: LeaderboardEntryDto) => {
    userActivityApi
      .apiUserActivityMonthUserIdGet(monthIndex+1, entry.userId ?? '')
      .then((response) => setMonthlyData(response.data))
      .catch((error) => console.error(error));
  };

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(monthIndex + 1).padStart(2, '0');
  
    userActivityApi.apiUserActivityPut({
      date: `2025-${monthStr}-${dayStr}T00:00:00.000Z`,
      quantity,
    });
  };

  useEffect(() => {
    const apiInstance = new TikampApi();
    const leaderboardApi = apiInstance.leaderboardApi();
    leaderboardApi.apiLeaderboardsTotalGet()
      .then((response) => setTotalLeaderboard(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const apiInstance = new TikampApi();
    const leaderboardApi = apiInstance.leaderboardApi();
    const userActivityApiInstance = apiInstance.userActivityApi();

    leaderboardApi.apiLeaderboardsMonthMonthGet(monthIndex + 1)
      .then((response) => setMonthlyLeaderboard(response.data))
      .catch((error) => console.error(error));

    userActivityApiInstance.apiUserActivityMonthGet(monthIndex + 1)
      .then((response) => setMonthlyData(response.data))
      .catch((error) => console.error(error));
  }, [monthIndex]);

  return (
    <div className="main-container">
      <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSelectTotalEntry} />
      <MonthlyContainer
        monthName={months[monthIndex]}
        monthIndex={monthIndex}
        onNextMonth={handleNextMonth}
        onPreviousMonth={handlePreviousMonth}
        leaderboardEntries={monthlyLeaderboard}
        monthlyData={monthlyData}
        onSelectEntry={handleSelectMonthlyEntry}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}

export default MainDisplay;

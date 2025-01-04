import { useEffect, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import MonthlyColumns from './MonthlyColumns';
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
    setMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const handlePreviousMonth = () => {
    setMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleSelectTotalEntry = async (entry: LeaderboardEntryDto) => {
    userActivityApi
        .apiUserActivityMonthUserIdGet(monthIndex, entry.userId ?? '')
        .then((response) => {
          console.log(response.data)
          setMonthlyData(response.data); 
        })
        .catch((error) => {
          console.error(error);
          //setUserActivtyResponse(`Error: ${error.toString()}`);
        });
  };

  const handleSelectMonthlyEntry = async (entry: LeaderboardEntryDto) => {
    userActivityApi
        .apiUserActivityMonthUserIdGet(monthIndex, entry.userId ?? '')
        .then((response) => {
            console.log(response.data)
            setMonthlyData(response.data); 
        })
        .catch((error) => {
            console.error(error);
            //setUserActivtyResponse(`Error: ${error.toString()}`);
        });
    };

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    userActivityApi.apiUserActivityPut({ date: `${monthIndex + 1}/${day}/2025 0:00:00`, quantity })
  };
  useEffect(() => {
    
    const api = new TikampApi();
    const leaderboardApi = api.leaderboardApi();
    leaderboardApi.apiLeaderboardsTotalGet()
      .then((response) => {console.log("Setting total leaderboard"); setTotalLeaderboard(response.data)})
      .catch((error) => console.error(error));
  }, []); 
  useEffect(() => {
    
    const api = new TikampApi();
    const leaderboardApi = api.leaderboardApi();
    const userActivityApi = api.userActivityApi();
    leaderboardApi.apiLeaderboardsMonthMonthGet(monthIndex+1)
      .then((response) => setMonthlyLeaderboard(response.data))
      .catch((error) => console.error(error));
  
    userActivityApi.apiUserActivityMonthGet(monthIndex+1)
      .then((response) => setMonthlyData(response.data))
      .catch((error) => console.error(error));
  }, [monthIndex]); 

  return (
    <div className="main-container">
      <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSelectTotalEntry} />
      <MonthlyColumns
        monthName={months[monthIndex]}
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

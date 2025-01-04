import React, { useState, useEffect } from 'react';
import { LeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import MonthlyOverview from './MonthlyOverview';
import '../styles/MonthlyColumn.css';

interface MonthlyColumnsProps {
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  leaderboardEntries: LeaderboardEntryDto[];
  monthlyData: MonthlyUserActivityDto | null;
  onSelectEntry: (entry: LeaderboardEntryDto) => void;
  onUpdateQuantity: (day: number, quantity: number) => void;
}

const MonthlyColumns: React.FC<MonthlyColumnsProps> = ({
  monthName,
  onNextMonth,
  onPreviousMonth,
  leaderboardEntries,
  monthlyData,
  onSelectEntry,
  onUpdateQuantity
}) => {
  const [activityName, setActivityName] = useState<string | null | undefined>(null);
  const [level1, setLevel1] = useState<number | null | undefined>(null);
  const [level2, setLevel2] = useState<number | null | undefined>(null);
  const [level3, setLevel3] = useState<number | null | undefined>(null);

  useEffect(() => {
    if (monthlyData?.activity) {
      setActivityName(monthlyData.activity.name);
      setLevel1(monthlyData.activity.level1);
      setLevel2(monthlyData.activity.level2);
      setLevel3(monthlyData.activity.level3);
    } else {
      setActivityName(null);
      setLevel1(null);
      setLevel2(null);
      setLevel3(null);
    }
  }, [monthlyData]);

  return (
    <div className="monthly-columns-container">
      <MonthlyLeaderboard
        monthName={monthName}
        activityName={activityName}
        level1={level1}
        level2={level2}
        level3={level3}
        entries={leaderboardEntries}
        onSelectEntry={onSelectEntry}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
      <MonthlyOverview
        monthName={monthName}
        activityName={activityName}
        level1={level1}
        level2={level2}
        level3={level3}
        data={monthlyData}
        onUpdateQuantity={onUpdateQuantity}
      />
    </div>
  );
};

export default MonthlyColumns;

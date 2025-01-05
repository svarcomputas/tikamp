// MonthlyContainer.tsx
import React from 'react';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, MonthlyLeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyContainer.css';

interface Props {
  monthName: string;
  monthIndex: number;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  leaderboardEntries: MonthlyLeaderboardEntryDto[];
  monthlyData: MonthlyUserActivityDto | null;
  onSelectEntry: (entry: MonthlyLeaderboardEntryDto) => void;
  onUpdateQuantity: (day: number, quantity: number) => void;
  activity?: ActivityDto;
}

const MonthlyContainer: React.FC<Props> = ({
  monthName,
  monthIndex,
  onNextMonth,
  onPreviousMonth,
  leaderboardEntries,
  monthlyData,
  onSelectEntry,
  onUpdateQuantity,
  activity
}) => {
  return (
    <div className="monthly-container">
      <div className="monthly-header">
        <button 
          onClick={onPreviousMonth} 
          disabled={monthIndex === 0}
          className="arrow-button"
        >
          {'<'}
        </button>
        <h2>{monthName}</h2>
        <button 
          onClick={onNextMonth} 
          disabled={monthIndex === 11}
          className="arrow-button"
        >
          {'>'}
        </button>
      </div>
      <div className="columns-wrapper">
        <MonthlyLeaderboard
          entries={leaderboardEntries}
          onSelectEntry={onSelectEntry}
          activity={activity}
        />
        <MonthlyOverview
          monthIndex={monthIndex}
          data={monthlyData}
          activity={activity}
          onUpdateQuantity={onUpdateQuantity}
        />
      </div>
    </div>
  );
};

export default MonthlyContainer;

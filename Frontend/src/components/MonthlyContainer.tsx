// MonthlyContainer.tsx
import React from 'react';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import MonthlyOverview from './MonthlyOverview';
import { LeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyContainer.css';

interface Props {
  monthName: string;
  monthIndex: number;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  leaderboardEntries: LeaderboardEntryDto[];
  monthlyData: MonthlyUserActivityDto | null;
  onSelectEntry: (entry: LeaderboardEntryDto) => void;
  onUpdateQuantity: (day: number, quantity: number) => void;
}

const MonthlyContainer: React.FC<Props> = ({
  monthName,
  monthIndex,
  onNextMonth,
  onPreviousMonth,
  leaderboardEntries,
  monthlyData,
  onSelectEntry,
  onUpdateQuantity
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
          activity={monthlyData?.activity}
        />
        <MonthlyOverview
          monthIndex={monthIndex}
          data={monthlyData}
          onUpdateQuantity={onUpdateQuantity}
        />
      </div>
    </div>
  );
};

export default MonthlyContainer;

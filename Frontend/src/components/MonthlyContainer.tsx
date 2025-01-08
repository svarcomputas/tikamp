// MonthlyContainer.tsx
import React from 'react';
import MonthlyLeaderboard from './MonthlyLeaderboard';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, MonthlyLeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyContainer.css';
import { formatActivityValue } from '../utils/conversions';

interface Props {
  monthName: string;
  monthIndex: number;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  leaderboardEntries: MonthlyLeaderboardEntryDto[];
  monthlyData: MonthlyUserActivityDto | null;
  onSelectEntry: (entry: MonthlyLeaderboardEntryDto) => void;
  onUpdateQuantity: (day: number, quantity: number) => Promise<any>;
  activity?: ActivityDto;
  loggedInUserId: string;
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
  activity,
  loggedInUserId
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
      <div className="activity-header">
        <h3>{activity?.name || ''}</h3>
        <h5>{activity?.description || ''}</h5>
        {activity?.level1 == null && activity?.level2 == null && activity?.level3 == null ? (
          <p>{activity?.description || 'Ikke noe nivå registrert enda'}</p>
        ) : (
          <div className="levels">
            <span>Nivå 1: {formatActivityValue(activity?.level1 ?? 0, activity?.unit ?? 0)}</span>
            <span>Nivå 2: {formatActivityValue(activity?.level2 ?? 0, activity?.unit ?? 0)}</span>
            <span>Nivå 3: {formatActivityValue(activity?.level3 ?? 0, activity?.unit ?? 0)}</span>
          </div>
        )}
      </div>
      <div className="columns-wrapper">
        <MonthlyLeaderboard
          entries={leaderboardEntries}
          onSelectEntry={onSelectEntry}
          activity={activity}
          loggedInUserId={loggedInUserId}
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

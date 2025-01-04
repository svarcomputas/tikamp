import React from 'react';
import { LeaderboardEntryDto } from '../api';
import '../styles/MonthlyLeaderboard.css';

interface MonthlyLeaderboardProps {
  monthName: string;
  activityName: string | null | undefined;
  level1: number | null | undefined;
  level2: number | null | undefined;
  level3: number | null | undefined;
  entries: LeaderboardEntryDto[];
  onSelectEntry: (entry: LeaderboardEntryDto) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthlyLeaderboard: React.FC<MonthlyLeaderboardProps> = ({
  monthName,
  activityName,
  level1,
  level2,
  level3,
  entries,
  onSelectEntry,
  onPreviousMonth,
  onNextMonth,
}) => {
  return (
    <div className="monthly-leaderboard-container">
      <div className="month-header">
        <button onClick={onPreviousMonth} className="arrow-button">{'<'}</button>
        <h2>{monthName}</h2>
        <button onClick={onNextMonth} className="arrow-button">{'>'}</button>
      </div>
      <div className="activity-header">
        <h3>{activityName}</h3>
        {level1 === null && level2 === null && level3 === null ? (
          <p>No levels set for this activity</p>
        ) : (
          <div className="levels">
            <span>Level1: {level1}</span>
            <span>Level2: {level2}</span>
            <span>Level3: {level3}</span>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Points</th>
            <th>Month Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.userId || index} onClick={() => onSelectEntry(entry)}>
              <td>{index + 1}</td>
              <td>{entry.userName}</td>
              <td>{entry.points}</td>
              <td>{entry.monthPointsFromLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyLeaderboard;

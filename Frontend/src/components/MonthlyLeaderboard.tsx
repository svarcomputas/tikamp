// MonthlyLeaderboard.tsx
import React from 'react';
import { MonthlyLeaderboardEntryDto, ActivityDto } from '../api';
import '../styles/MonthlyLeaderboard.css';

interface Props {
  entries: MonthlyLeaderboardEntryDto[];
  onSelectEntry: (entry: MonthlyLeaderboardEntryDto) => void;
  activity?: ActivityDto;
}

const MonthlyLeaderboard: React.FC<Props> = ({ entries, onSelectEntry, activity }) => {
  return (
    <div className="monthly-leaderboard">
      <div className="activity-header">
        <h3>{activity?.name || ''}</h3>
        {activity?.level1 == null && activity?.level2 == null && activity?.level3 == null ? (
          <p>{activity?.description || 'No levels set'}</p>
        ) : (
          <div className="levels">
            <span>Level1: {activity?.level1}</span>
            <span>Level2: {activity?.level2}</span>
            <span>Level3: {activity?.level3}</span>
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Navn</th>
            <th>Antall</th>
            <th>Poeng</th>
            <th>Plasserings poeng</th>
            <th>Nivå poeng</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={entry.userId || idx} onClick={() => onSelectEntry(entry)}>
              <td>{idx + 1}</td>
              <td>{entry.userName}</td>
              <td>{entry.exerciseQuantity}</td>
              <td>{entry.points}</td>
              <td>{entry.monthPlacementPoints}</td>
              <td>{entry.monthPointsFromLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyLeaderboard;

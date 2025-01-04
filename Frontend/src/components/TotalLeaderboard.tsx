import React from 'react';
import { LeaderboardEntryDto } from '../api';
import '../styles/TotalLeaderboard.css';

interface TotalLeaderboardProps {
  entries: LeaderboardEntryDto[];
  onSelectEntry: (entry: LeaderboardEntryDto) => void;
}

const TotalLeaderboard: React.FC<TotalLeaderboardProps> = ({ entries, onSelectEntry }) => {
  return (
    <div className="total-leaderboard-container">
      <h2>All-Time Leaderboard</h2>
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

export default TotalLeaderboard;

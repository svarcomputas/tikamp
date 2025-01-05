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
      <h2>Resultattavle 2025</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Navn</th>
            <th>Poeng</th>
            <th>Plasserings poeng</th>
            <th>Nivå poeng</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.userId || index} onClick={() => onSelectEntry(entry)}>
              <td>{index + 1}</td>
              <td>{entry.userName}</td>
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

export default TotalLeaderboard;

import React from 'react';
import { MonthlyLeaderboardEntryDto, ActivityDto } from '../api';
import '../styles/MonthlyLeaderboard.css';

interface Props {
  entries: MonthlyLeaderboardEntryDto[];
  onSelectEntry: (entry: MonthlyLeaderboardEntryDto) => void;
  activity?: ActivityDto;
  loggedInUserId: string;
}

const MonthlyLeaderboard: React.FC<Props> = ({ entries, onSelectEntry, activity, loggedInUserId }) => {
  const getActivityUnitHeader = (unit: number) => {
    switch (unit) {
      case 0:
        return 'Antall';
      case 1:
        return 'Kilometer';
      case 2:
        return 'Minutter';
      default:
        return 'Antall';
    }
  };


  // Merge level rows with entries and sort them based on exerciseQuantity
  const mergedEntries = [
    ...(activity?.level3 ? [{ isLevel: true, userName: 'Nivå 3', exerciseQuantity: activity.level3 }] : []),
    ...(activity?.level2 ? [{ isLevel: true, userName: 'Nivå 2', exerciseQuantity: activity.level2 }] : []),
    ...(activity?.level1 ? [{ isLevel: true, userName: 'Nivå 1', exerciseQuantity: activity.level1 }] : []),
    ...entries.map(entry => ({ ...entry, isLevel: false })),
  ].sort((a, b) => (b.exerciseQuantity || 0) - (a.exerciseQuantity || 0));

  return (
    <div className="monthly-leaderboard">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Navn</th>
            <th>{getActivityUnitHeader(activity?.unit || 0)}</th>
            <th>Poeng</th>
            <th>Plasserings poeng</th>
            <th>Nivå poeng</th>
          </tr>
        </thead>
        <tbody>
          {mergedEntries.map((entry, idx) => {
            // Determine the class name for the row based on its condition
            let rowClass = '';
            let rowNum = idx+1;
            if (entry.isLevel) {
              // Level rows get specific class
              if (entry.userName === 'Nivå 3') rowClass = 'gold-row';
              if (entry.userName === 'Nivå 2') rowClass = 'silver-row';
              if (entry.userName === 'Nivå 1') rowClass = 'bronze-row';
            } else {
              // User rows based on points
              if (entry.points !== undefined) {
                if ((entry.exerciseQuantity ?? 0)  >= (activity?.level3 || 0)) rowClass = 'gold-row';
                else if ((entry.exerciseQuantity ?? 0) >= (activity?.level2 || 0)) {rowClass = 'silver-row'; rowNum-=1;}
                else if ((entry.exerciseQuantity ?? 0) >= (activity?.level1 || 0)) {rowClass = 'bronze-row'; rowNum -=2;}
                else {rowNum -=3;}
              }
              if (entry.userId === loggedInUserId) rowClass += ' user-row'; // Logged-in user row
            }

            // Render level rows
            if (entry.isLevel) {
              return (
                <tr key={`level-${entry.userName}`} className={`level-${rowClass}`}>
                  <td colSpan={6}>
                    <em>{entry.userName}:</em> {entry.exerciseQuantity}
                  </td>
                </tr>
              );
            }

            // Regular user row
            return (
              <tr
                key={entry.userId || rowNum}
                className={rowClass}
                onClick={() => onSelectEntry(entry)} // Top row not clickable
              >
                <td>{rowNum}</td>
                <td>
                  {entry.userName} {entry.userId === loggedInUserId && <em>(deg)</em>}
                </td>
                <td>{entry.exerciseQuantity}</td>
                <td>{entry.points}</td>
                <td>{entry.monthPlacementPoints}</td>
                <td>{entry.monthPointsFromLevel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyLeaderboard;


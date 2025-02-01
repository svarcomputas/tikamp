import React from 'react';
import { LeaderboardEntryDto } from '../api';
import '../styles/TotalLeaderboard.css';
import { Table } from "flowbite-react";
import { SponsorerWithImportedLogos } from './Sponsorer';

interface TotalLeaderboardProps {
  entries: LeaderboardEntryDto[];
  onSelectEntry: (entry: LeaderboardEntryDto | null) => void;
}

const TotalLeaderboard: React.FC<TotalLeaderboardProps> = ({ entries, onSelectEntry }) => {
  return (
    <div className="total-leaderboard-container">
      
      <span className="total-leaderboard-title">Resultattavle 2025</span><br/><br/>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Navn</Table.HeadCell>
          <Table.HeadCell>Poeng</Table.HeadCell>
          <Table.HeadCell>Plasserings poeng</Table.HeadCell>
          <Table.HeadCell>Nivå poeng</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        {entries.map((entry, index) => (
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={entry.userId || index} onClick={() => onSelectEntry(entry)}>
            <Table.Cell>{index + 1}</Table.Cell>
            <Table.Cell>{entry.userName}</Table.Cell>
            <Table.Cell>{entry.points}</Table.Cell>
            <Table.Cell>{entry.monthPlacementPoints}</Table.Cell>
            <Table.Cell>{entry.monthPointsFromLevel} </Table.Cell>
          </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <SponsorerWithImportedLogos />
    </div>
  );
};

export default TotalLeaderboard;

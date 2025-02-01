import React, { useState, useEffect } from 'react';
import { TotalLeaderboardEntryDto, MedalTypeDto } from '../api';
import '../styles/TotalLeaderboard.css';
import { Table } from "flowbite-react";
import MedalGold from '../assets/svgs/medal-gold.svg';
import MedalSilver from '../assets/svgs/medal-silver.svg';
import MedalBronze from '../assets/svgs/medal-bronze.svg';
import TikampApi from '../utils/TikampApi';

interface TotalLeaderboardProps {
  onSelectEntry: (entry: TotalLeaderboardEntryDto | null) => void;
  loggedInUserId: string;
  api: TikampApi;
  leaderboardUpdated: () => void;
  shouldFetchLeaderboard: Boolean;
}

/**
 * This component handles displaying the medals.
 * On large screens, it shows every medal icon.
 * On small screens, it abbreviates each medal type (if count > 1) by showing one icon and a "+N" indicator.
 */
const MedalDisplay: React.FC<{ medals?: number[]; isSmallScreen: boolean }> = ({ medals, isSmallScreen }) => {
  // Count medals—ignore medal type 0.
  let goldCount = 0,
    silverCount = 0,
    bronzeCount = 0;
  medals?.forEach((medal) => {
    if (medal === MedalTypeDto.NUMBER_3) goldCount++;
    else if (medal === MedalTypeDto.NUMBER_2) silverCount++;
    else if (medal === MedalTypeDto.NUMBER_1) bronzeCount++;
  });

  if (!isSmallScreen) {
    // Large screen: display all medal icons in order.
    return (
      <div className="medals-container">
        {goldCount > 0 &&
          Array.from({ length: goldCount }).map((_, i) => (
            <img key={`gold-${i}`} src={MedalGold} alt="Gold" className="medal-icon" />
          ))}
        {silverCount > 0 &&
          Array.from({ length: silverCount }).map((_, i) => (
            <img key={`silver-${i}`} src={MedalSilver} alt="Silver" className="medal-icon" />
          ))}
        {bronzeCount > 0 &&
          Array.from({ length: bronzeCount }).map((_, i) => (
            <img key={`bronze-${i}`} src={MedalBronze} alt="Bronze" className="medal-icon" />
          ))}
      </div>
    );
  } else {
    // Small screen: abbreviated view.
    // For each medal type that has been achieved, display one icon and, if count > 1, a plus indicator.
    return (
      <div className="medals-container">
        {goldCount > 0 && (
          <span className="medal-abbr">
            <img src={MedalGold} alt="Gold" className="medal-icon" />
            {goldCount > 1 && <span className="medal-count">+{goldCount}</span>}
          </span>
        )}
        {silverCount > 0 && (
          <span className="medal-abbr">
            <img src={MedalSilver} alt="Silver" className="medal-icon" />
            {silverCount > 1 && <span className="medal-count">+{silverCount}</span>}
          </span>
        )}
        {bronzeCount > 0 && (
          <span className="medal-abbr">
            <img src={MedalBronze} alt="Bronze" className="medal-icon" />
            {bronzeCount > 1 && <span className="medal-count">+{bronzeCount}</span>}
          </span>
        )}
      </div>
    );
  }
};

const TotalLeaderboard: React.FC<TotalLeaderboardProps> = ({ 
  onSelectEntry, 
  loggedInUserId,
  leaderboardUpdated,
  api,
  shouldFetchLeaderboard, }) => {
  // Check for small screen size.
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [totalLeaderboard, setTotalLeaderboard] = useState<TotalLeaderboardEntryDto[]>([]);
    useEffect(() => {
        if(shouldFetchLeaderboard){
          setLoadingLeaderboard(true);
          const fetchData = async () => {
            await api.getTotalLeaderboard()
            .then((data) => setTotalLeaderboard(data))
            .catch((error) => {
              console.error(error)});
            leaderboardUpdated();
          }
          fetchData();
        }
      }, [api, shouldFetchLeaderboard, leaderboardUpdated]);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="total-leaderboard-container">
      <span className="total-leaderboard-title">Resultattavle 2025</span>
      <br />
      <br />
      <Table striped>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Navn</Table.HeadCell>
          <Table.HeadCell>Poeng</Table.HeadCell>
          <Table.HeadCell>Medaljer</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {totalLeaderboard.map((entry, index) => {
            // Compute total points as the sum of month placement and level points.
            const totalPoints =
              (entry.monthPointsFromLevel || 0) + (entry.monthPlacementPoints || 0);

            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={entry.userId || index}
                onClick={() => onSelectEntry(entry)}
              >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <p>
                    {entry.userName ?? ""}{" "}
                    <em>{entry.userId === loggedInUserId ? "(deg)" : ""}</em>
                  </p>
                </Table.Cell>
                <Table.Cell>{totalPoints}</Table.Cell>
                <Table.Cell>
                  <MedalDisplay medals={entry.medals || []} isSmallScreen={isSmallScreen} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default TotalLeaderboard;

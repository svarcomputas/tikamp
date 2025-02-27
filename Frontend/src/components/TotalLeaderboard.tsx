import React, { useState, useEffect, useRef, JSX } from 'react';
import { TotalLeaderboardEntryDto, MedalTypeDto } from '../api';
import '../styles/TotalLeaderboard.css';
import { Table } from "flowbite-react";
import MedalGold from '../assets/svgs/medal-gold.svg';
import MedalSilver from '../assets/svgs/medal-silver.svg';
import MedalBronze from '../assets/svgs/medal-bronze.svg';
import TikampApi from '../utils/TikampApi';
import { SponsorerWithImportedLogos } from './Sponsorer';

interface TotalLeaderboardProps {
  onSelectEntry: (entry: TotalLeaderboardEntryDto | null) => void;
  loggedInUserId: string;
  api: TikampApi;
  leaderboardUpdated: () => void;
  shouldFetchLeaderboard: Boolean;
}

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [availableSlots, setAvailableSlots] = useState<number>(0);
  const medalSlotWidth = 24; // adjust as needed

  useEffect(() => {
    const calcAvailableSlots = () => {
      if (containerRef.current) {
        const slots = Math.max(Math.floor(containerRef.current.offsetWidth / medalSlotWidth), 6);
        setAvailableSlots(slots > 0 ? slots : 1);
      }
    };
    calcAvailableSlots();
    window.addEventListener('resize', calcAvailableSlots);
    return () => window.removeEventListener('resize', calcAvailableSlots);
  }, [medalSlotWidth]);
  // For non-small screens, show every medal icon.
  if (!isSmallScreen) {
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
  }

  const renderMedalGroup = (count: number, medalSrc: string, medalAlt: string, slots: number) => {
    if (count <= 0) return null;
    let icons: JSX.Element[] = [];
    if (count > slots) {
      const iconsToShow = slots - 1;
      for (let i = 0; i < iconsToShow; i++) {
        icons.push(
          <img key={`${medalAlt}-${i}`} src={medalSrc} alt={medalAlt} className="medal-icon" />
        );
      }
      icons.push(
        <span key={`${medalAlt}-plus`} className="medal-count">
          +{count - iconsToShow}
        </span>
      );
    } else {
      for (let i = 0; i < count; i++) {
        icons.push(
          <img key={`${medalAlt}-${i}`} src={medalSrc} alt={medalAlt} className="medal-icon" />
        );
      }
    }
    return <span className="medal-group">{icons}</span>;
  };

  let silverMin: number = silverCount >= 2 ? 2 : (silverCount === 1 ? 1 : 0);
  let bronzeMin: number = bronzeCount >= 2 ? 2 : (bronzeCount === 1 ? 1 : 0);
  let goldSlots: number = availableSlots - silverMin - bronzeMin;
  let silverSlots: number = availableSlots - goldSlots - bronzeMin;
  let bronzeSlots: number = availableSlots - goldSlots - silverSlots;
  return (
    <div className="medals-container" ref={containerRef}>
      {renderMedalGroup(goldCount, MedalGold, "Gold", goldSlots)}
      {renderMedalGroup(silverCount, MedalSilver, "Silver", silverSlots)}
      {renderMedalGroup(bronzeCount, MedalBronze, "Bronze", bronzeSlots)}
    </div>
  );
};

const TotalLeaderboard: React.FC<TotalLeaderboardProps> = ({ 
  onSelectEntry, 
  loggedInUserId,
  leaderboardUpdated,
  api,
  shouldFetchLeaderboard,
}) => {
  // Check for small screen size.
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [ ,setLoadingLeaderboard] = useState(true);
  const [totalLeaderboard, setTotalLeaderboard] = useState<TotalLeaderboardEntryDto[]>([]);

  useEffect(() => {
    if (shouldFetchLeaderboard) {
      setLoadingLeaderboard(true);
      const fetchData = async () => {
        await api.getTotalLeaderboard()
          .then((data) => setTotalLeaderboard(data))
          .catch((error) => { console.error(error); });
        leaderboardUpdated();
      };
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
            const totalPoints = (entry.monthPointsFromLevel || 0) + (entry.monthPlacementPoints || 0);

            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={entry.userId || index}
                onClick={() => onSelectEntry(entry)}
              >
                <Table.Cell>{entry.placement}</Table.Cell>
                <Table.Cell>
                  <p>
                    {entry.userName ?? ""} <em>{entry.userId === loggedInUserId ? "(deg)" : ""}</em>
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
      <SponsorerWithImportedLogos />
    </div>
  );
};

export default TotalLeaderboard;

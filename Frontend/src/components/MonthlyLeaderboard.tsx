import React, { useEffect, useState } from 'react';
import { MonthlyLeaderboardEntryDto, ActivityDto } from '../api';
import '../styles/MonthlyLeaderboard.css';
import MedalGold from '../assets/svgs/medal-gold.svg';
import MedalSilver from '../assets/svgs/medal-silver.svg';
import MedalBronze from '../assets/svgs/medal-bronze.svg';
import Trophy1st from '../assets/svgs/trophy-1st.svg';
import Trophy2nd from '../assets/svgs/trophy-2nd.svg';
import Trophy3rd from '../assets/svgs/trophy-3rd.svg';
import InfoButton from '../assets/svgs/info-button.tsx';
import { Table } from 'flowbite-react';
import PointsInfoPopup from './Popup/PointsInfoPopup.tsx';
import { formatActivityValue } from '../utils/conversions.ts';

interface Props {
  entries: MonthlyLeaderboardEntryDto[];
  onSelectEntry: (entry: MonthlyLeaderboardEntryDto) => void;
  activity?: ActivityDto;
  loggedInUserId: string;
}

const MonthlyLeaderboard: React.FC<Props> = ({ entries, onSelectEntry, activity, loggedInUserId }) => {

  const [total, setTotal] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
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
  const getMedal = (total: number) => {
    if (activity?.level3 && total >= activity.level3) return MedalGold;
    if (activity?.level2 && total >= activity.level2) return MedalSilver;
    if (activity?.level1 && total >= activity.level1) return MedalBronze;
    return null;
  };

  useEffect(() => {
    const calculatedTotal = entries.reduce((sum, activity) => sum + (activity.exerciseQuantity || 0), 0);
    setTotal(calculatedTotal);
  }, [entries]);
  return (
    <div className="monthly-leaderboard">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>#</Table.HeadCell>
          <Table.HeadCell>Navn</Table.HeadCell>
          <Table.HeadCell>{getActivityUnitHeader(activity?.unit || 0)}</Table.HeadCell>
          <Table.HeadCell className='points-column'>
            <div className='points-header'>
              <p>Poeng</p> 
              <div className="points-info-button" onClick={() => setShowInfo(true)} >
                <InfoButton />
              </div>
            </div>
            </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {entries.map((entry, index) => {
            return (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={entry.userId || index} onClick={() => onSelectEntry(entry)}>
              <Table.Cell>
                { index +1}
                {/* <div className='placement-and-trophy'>
                  {index === 0 ? <img src={Trophy1st} alt="Trophy-1st" className="trophy first" /> : (
                    index === 1 ? <img src={Trophy2nd} alt="Trophy-2nd" className="trophy second" /> : (
                      index === 2 ? <img src={Trophy3rd} alt="Trophy-3rd" className="trophy third" /> : ( index +1)
                    )
                  )}
                </div> */}
              </Table.Cell>
              <Table.Cell>
                <div className='name-and-trophy'>
                    <p >{(entry.userName ?? "")} <em>{ (entry.userId === loggedInUserId ? "(deg)" : "")}</em></p>
                {index === 0 ? <img src={Trophy1st} alt="Trophy-1st" className="trophy first" /> : (
                    index === 1 ? <img src={Trophy2nd} alt="Trophy-2nd" className="trophy second" /> : (
                      index === 2 ? <img src={Trophy3rd} alt="Trophy-3rd" className="trophy third" /> : ("")
                    )
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>{formatActivityValue(entry?.exerciseQuantity ?? 0, activity?.unit ?? 0)}</Table.Cell>
              <Table.Cell>
                <div className='points-row'>
                  <span>{entry.points + " ("}</span>
                  {getMedal(entry.exerciseQuantity ?? 0) !== null ? <img src={getMedal(entry.exerciseQuantity ?? 0)} alt="Medal" className="medal" /> : "0"}
                  <span>{" + " + entry.monthPlacementPoints + ")"}</span>
                </div>
              </Table.Cell>
            </Table.Row>
            )})}
          </Table.Body>
        </Table>
        {showInfo && <PointsInfoPopup onClose={() => setShowInfo(false)} activity={activity} />}
        <br/>
        <p className='total-count'>Totalt: {formatActivityValue(total ?? 0, activity?.unit ?? 0)}</p>
    </div>
  );
};

export default MonthlyLeaderboard;


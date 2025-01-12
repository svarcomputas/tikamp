import React, { useEffect, useState } from 'react';
import Calendar from './Calendar/Calendar';
import { MonthlyUserActivityDto, UserActivityDto, ActivityDto, LeaderboardEntryDto } from '../api';
import '../styles/MonthlyOverview.css';
import { Button } from 'flowbite-react';
import MedalGold from '../assets/svgs/medal-gold.svg';
import MedalSilver from '../assets/svgs/medal-silver.svg';
import MedalBronze from '../assets/svgs/medal-bronze.svg';
import LevelInfoPopup from './Popup/LevelInfoPopup';
import InfoButton from '../assets/svgs/info-button';
import { formatActivityValue } from '../utils/conversions';

const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

interface Props {
  monthIndex: number;
  monthName: string;
  loggedInUserId: string;
  data: MonthlyUserActivityDto | null;
  displayingForEntry: LeaderboardEntryDto | null;
  onUpdateQuantity: (day: number, quantity: number) => Promise<any>;
  resetSelectedEntry: () => void;
  activity?: ActivityDto;
}

const MonthlyOverview: React.FC<Props> = ({ 
    monthIndex,
    monthName,
    loggedInUserId,
    data,
    displayingForEntry,
    onUpdateQuantity,
    resetSelectedEntry,
    activity }) => {
  const [localActivities, setLocalActivities] = useState<UserActivityDto[]>([]);
  const [total, setTotal] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const totalDays = daysInMonth(2025, monthIndex);
    const existingActivities = data?.usersActivities || [];
    const fullList = Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      const found = existingActivities.find((a) => a.day === dayNum);
      return found || { day: dayNum, quantity: 0 };
    });
    setLocalActivities(fullList);
  }, [data, monthIndex]);

  useEffect(() => {
    const calculatedTotal = localActivities.reduce((sum, activity) => sum + (activity.quantity || 0), 0);
    setTotal(calculatedTotal);
  }, [localActivities]);

  const getMedal = () => {
    if (activity?.level3 && total >= activity.level3) return MedalGold;
    if (activity?.level2 && total >= activity.level2) return MedalSilver;
    if (activity?.level1 && total >= activity.level1) return MedalBronze;
    return null;
  };

  const handleDayUpdate = async (day: number, newQuantity: number) => {
    await onUpdateQuantity(day, newQuantity);
    setLocalActivities((prev) => 
      prev.map((p) => (p.day === day ? { ...p, quantity: newQuantity } : p))
    );
  };

  return (
    <div className="monthly-overview">
      <div className="monthly-overview-info">
        {displayingForEntry && displayingForEntry.userId !== loggedInUserId ? (
          <>
            <span>Viser aktivitet for <span className="monthly-overview-other-user">{displayingForEntry.userName}</span></span>
            <Button color="cyan" pill onClick={resetSelectedEntry} className="select-me-button" size="xs">
              Vis meg
            </Button>
          </>
        ) : (
          <span>Rediger din aktivitet</span>
        )}
        <div className="month-total">
          Totalt: {formatActivityValue(total, activity?.unit ?? 0)}
          {getMedal() && <img src={getMedal()} alt="Medal" className="medal" />}
          <div onClick={() => setShowInfo(true)} className="info-button">
            <InfoButton />
          </div>
        </div>
      </div>
      <Calendar
        year={2025}
        monthIndex={monthIndex}
        monthName={monthName}
        daysData={localActivities}
        isSelf={!data || data.isSelf || false}
        activity={activity}
        onDayUpdate={handleDayUpdate}
      />
      {showInfo && <LevelInfoPopup onClose={() => setShowInfo(false)} activity={activity} />}
    </div>
  );
};

export default MonthlyOverview;

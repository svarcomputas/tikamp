// MonthlyOverview.tsx
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar/Calendar';
import { MonthlyUserActivityDto, UserActivityDto, ActivityDto, LeaderboardEntryDto } from '../api';
import '../styles/MonthlyOverview.css';
import { Button } from 'flowbite-react';

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

  const handleDayUpdate = async (day: number, newQuantity: number) => {
    await onUpdateQuantity(day, newQuantity);
    setLocalActivities((prev) => 
      prev.map((p) => (p.day === day ? { ...p, quantity: newQuantity } : p))
    );
  };

  return (
    <div className="monthly-overview">
      {displayingForEntry && displayingForEntry.userId !== loggedInUserId ? 
      <div className="monthly-overview-info">
        <span>Viser aktivitet for <span className="monthly-overview-other-user">{displayingForEntry.userName} </span></span>
        <Button color="cyan" pill onClick={resetSelectedEntry} className="select-me-button" size="xs">
          Vis meg
        </Button>
       </div>
       : <span>Rediger din aktivitet</span>}
      <Calendar
        year={2025}
        monthIndex={monthIndex}
        monthName={monthName}
        daysData={localActivities}
        isSelf={!data || data.isSelf || false}
        activity={activity}
        onDayUpdate={handleDayUpdate}
      />
    </div>
  );
};

export default MonthlyOverview;

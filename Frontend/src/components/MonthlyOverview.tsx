// MonthlyOverview.tsx
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar/Calendar';
import { MonthlyUserActivityDto, UserActivityDto, ActivityDto } from '../api';
import '../styles/MonthlyOverview.css';

const daysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

interface Props {
  monthIndex: number;
  data: MonthlyUserActivityDto | null;
  onUpdateQuantity: (day: number, quantity: number) => Promise<any>;
  activity?: ActivityDto;
}

const MonthlyOverview: React.FC<Props> = ({ monthIndex, data, onUpdateQuantity, activity }) => {
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
      <Calendar
        year={2025}
        monthIndex={monthIndex}
        daysData={localActivities}
        isSelf={!data || data.isSelf || false}
        activity={activity}
        onDayUpdate={handleDayUpdate}
      />
    </div>
  );
};

export default MonthlyOverview;

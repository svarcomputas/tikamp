import React, { useState } from 'react';
import { MonthlyUserActivityDto, UserActivityDto } from '../api';
import '../styles/MonthlyOverview.css';

interface MonthlyOverviewProps {
  monthName: string;
  activityName: string | null | undefined;
  level1: number | null | undefined;
  level2: number | null | undefined;
  level3: number | null | undefined;
  data: MonthlyUserActivityDto | null;
  onUpdateQuantity: (day: number, quantity: number) => void;
}

const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({
  monthName,
  activityName,
  level1,
  level2,
  level3,
  data,
  onUpdateQuantity
}) => {
  const [localActivities, setLocalActivities] = useState<UserActivityDto[]>(data?.usersActivities || []);

  const handleQuantityChange = (day: number, newQuantity: number) => {
    if (!data?.isSelf) return;
    const updated = localActivities.map((ua) => {
      if (ua.day === day) {
        return { ...ua, quantity: newQuantity };
      }
      return ua;
    });
    setLocalActivities(updated);
  };

  const handleBlur = (day: number, quantity: number) => {
    if (!data?.isSelf) return;
    onUpdateQuantity(day, quantity);
  };

  return (
    <div className="monthly-overview-container">
      <div className="month-header">
        <h2>{monthName}</h2>
      </div>
      <div className="activity-header">
        <h3>{activityName}</h3>
        {level1 === null && level2 === null && level3 === null ? (
          <p>No levels set for this activity</p>
        ) : (
          <div className="levels">
            <span>Level1: {level1}</span>
            <span>Level2: {level2}</span>
            <span>Level3: {level3}</span>
          </div>
        )}
      </div>
      <h4>Activity Overview</h4>
      {localActivities.map((ua, index) => (
        <div key={index} className="user-activity">
          <label>Day {ua.day}:</label>
          {data?.isSelf ? (
            <input
              type="number"
              value={ua.quantity || 0}
              onChange={(e) => handleQuantityChange(ua.day!, parseInt(e.target.value, 10))}
              onBlur={() => handleBlur(ua.day!, ua.quantity!)}
            />
          ) : (
            <span>{ua.quantity}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MonthlyOverview;

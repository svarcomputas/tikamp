// MonthlyOverview.tsx
import React, { useEffect, useState } from 'react';
import { MonthlyUserActivityDto, UserActivityDto } from '../api';
import InputNumber from 'rc-input-number';
import '../styles/MonthlyOverview.css';

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface Props {
  monthIndex: number;
  data: MonthlyUserActivityDto | null;
  onUpdateQuantity: (day: number, quantity: number) => void;
}

const MonthlyOverview: React.FC<Props> = ({ monthIndex, data, onUpdateQuantity }) => {
  const [localActivities, setLocalActivities] = useState<UserActivityDto[]>([]);
  const [didUpdate, setDidUpdate] = useState<Boolean>(false);
  useEffect(() => {
    if (!data) {
      setLocalActivities([]);
      return;
    }
    const totalDays = daysInMonth[monthIndex];
    const existingActivities = data.usersActivities || [];
    const fullList = Array.from({ length: totalDays }, (_, i) => {
      const dayNum = i + 1;
      const found = existingActivities.find((a) => a.day === dayNum);
      return found || { day: dayNum, quantity: 0 };
    });
    setLocalActivities(fullList);
  }, [data, monthIndex]);

  const handleChange = (day: number, value: number) => {
    console.log(""+didUpdate)
    if (!data?.isSelf || localActivities.find(p => p.day === day)?.quantity === value) return;
    setDidUpdate(true);
    console.log("io<"+didUpdate)
    setLocalActivities((prev) =>
      prev.map((p) => (p.day === day ? { ...p, quantity: value } : p))
    );
  };

  const handleBlur = (day: number, value: number) => {
    console.log("Blur" + didUpdate)
    if (!data?.isSelf || !didUpdate) return;
    setDidUpdate(false);
    onUpdateQuantity(day, value);
  };

  return (
    <div className="monthly-overview">
      <h3>Aktivitetsoversikt</h3>
      {localActivities.map((ua) => (
        <div key={ua.day} className="user-activity">
          <label>Dag {ua.day}:</label>
          {data?.isSelf ? (
            <InputNumber
              value={ua.quantity || 0}
              onChange={(e) => handleChange(ua.day ?? -1, e ?? -1)}
              onBlur={() => handleBlur(ua.day ?? -1, ua.quantity || 0)}
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

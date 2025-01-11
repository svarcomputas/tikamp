// Calendar.tsx
import React from 'react';
import DayBox from './DayBox';
import { ActivityDto, UserActivityDto } from '../../api';
import '../../styles/Calendar/Calendar.css';

interface CalendarProps {
  year: number;
  monthIndex: number;
  monthName: string;
  daysData: UserActivityDto[];
  isSelf: boolean;
  activity: ActivityDto | undefined;
  onDayUpdate: (day: number, newQuantity: number) => Promise<any>;
}

const Calendar: React.FC<CalendarProps> = ({
  year,
  monthIndex,
  monthName,
  daysData,
  isSelf,
  activity,
  onDayUpdate
}) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDay = (firstDayOfMonth.getDay() + 6) % 7; 
  const totalDays = daysData.length;
  // build a list that includes blanks for days before the month starts
  // and actual day boxes for the rest of the days
  const allDayBoxes: Array<{ dayNumber: number | null; quantity: number }> = [];
  for (let i = 0; i < startDay; i++) {
    allDayBoxes.push({ dayNumber: null, quantity: 0 });
  }
  for (let d = 1; d <= totalDays; d++) {
    const found = daysData.find((dd) => dd.day === d);
    allDayBoxes.push({ dayNumber: d, quantity: found?.quantity || 0 });
  }

  // chunk the list into weeks of 7 days
  const weeks: Array<Array<{ dayNumber: number | null; quantity: number }>> = [];
  for (let i = 0; i < allDayBoxes.length; i += 7) {
    weeks.push(allDayBoxes.slice(i, i + 7));
  }

  return (
    <div className="calendar-container">
      {/* <span className="calendar-title">{monthName} 2025</span> */}
      <div className="calendar-row header-row">
        <div>Man</div>
        <div>Tir</div>
        <div>Ons</div>
        <div>Tor</div>
        <div>Fre</div>
        <div>Lør</div>
        <div>Søn</div>
      </div>
      <div className="calendar-days">
        {weeks.map((week, i) => (
          <div className="calendar-row" key={i}>
            {week.map((dayItem, idx) => (
              <DayBox
                key={idx}
                dayNumber={dayItem.dayNumber}
                quantity={dayItem.quantity}
                isEditable={isSelf && dayItem.dayNumber !== null}
                activity={activity}
                onUpdate={(newVal) => onDayUpdate(dayItem.dayNumber!, newVal)}
                daysInMonth={totalDays}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
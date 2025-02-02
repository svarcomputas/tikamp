// DayBox.tsx
import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { parseActivityValue, formatActivityValue } from '../../utils/conversions';
import { ActivityDto } from '../../api';
import '../../styles/Calendar/DayBox.css';
import ErrorToast from '../ErrorToast';

interface Props {
  dayNumber: number | null;
  isEditable: boolean;
  quantity: number;
  activity: ActivityDto | undefined;
  onUpdate: (newValue: number) => Promise<any>; 
  daysInMonth: number;
  isActive: boolean;
}

const DayBox: React.FC<Props> = ({ 
  dayNumber,
  isEditable, 
  quantity, 
  activity, 
  onUpdate,
  daysInMonth,
  isActive
}) => {
      const [localValue, setLocalValue] = useState(
        formatActivityValue(quantity, activity?.unit ?? 0)
      );
      const [loading, setLoading] = useState(false);
      const [initalValue, setInitalValue] = useState(quantity);
      const [showErrorToast, setShowErrorToast] = useState(false);
      useEffect(() => {
        setLocalValue(formatActivityValue(quantity, activity?.unit ?? 0));
      }, [quantity, activity]);
    
      const level1 = activity?.level1 ?? 0;
      const level2 = activity?.level2 ?? 0;
      const level3 = activity?.level3 ?? 0;
      const rawQuantity = parseActivityValue(localValue, activity?.unit ?? 0);
      let bgColor = 'white';
      if (dayNumber !== null) {
        if (((rawQuantity >= (( 10 * level3) / daysInMonth) && activity?.unit === 0) ||
          (rawQuantity >= ( 1.5 * level3) && activity?.unit === 1) || 
          (rawQuantity >= (( 10 * level3) / daysInMonth) && activity?.unit === 2) )
          && level3 > 0) {
          bgColor = '#0d402b';
        } else if (rawQuantity >= (( 2 * level3) / daysInMonth) && level3 > 0) {
          bgColor = '#28C181';
        } else if (rawQuantity >= level3 / daysInMonth && level3 > 0) {
          bgColor = '#3BD796';
        } else if (rawQuantity >= level2 / daysInMonth && level2 > 0) {
          bgColor = '#5CDEA7';
        } else if (rawQuantity >= level1 / daysInMonth && level1 > 0) {
          bgColor = '#7CE4B9'; 
        } else if ( rawQuantity > 0) {
          bgColor = '#a6edd0'; 
        }
      }
    
      const handleBlur = async () => {
        if(rawQuantity === initalValue){
          setLocalValue(formatActivityValue(initalValue, activity?.unit ?? 0));
          return;
        }
        if(!isEditable || dayNumber === null  || isNaN(rawQuantity)){
          setShowErrorToast(true);
          setTimeout(() => setShowErrorToast(false), 3000);
          setLocalValue(formatActivityValue(initalValue, activity?.unit ?? 0));
          return;
        }
        setLoading(true);
        setInitalValue(rawQuantity);
        await onUpdate(rawQuantity);
        setLoading(false);
      };
    
      if (dayNumber === null) {
        return <div className="day-box blank-day" />;
      }
      
      return (
        <div className="day-box" style={{ backgroundColor: bgColor }}>
          {showErrorToast && <ErrorToast />}
          <div className={`day-number ${isActive ? 'active' : ''}`}>{dayNumber}</div>
          {loading ? (
            <div className="spinner-container">
              <ClipLoader size={20} color="#000" />
            </div>
          ) : isEditable ? (
            <input
              className="day-input"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
            />
          ) : (
            <div className="day-quantity">{formatActivityValue(quantity, activity?.unit ?? 0)}</div>
          )}
        </div>
      );
    };
    
    export default DayBox;
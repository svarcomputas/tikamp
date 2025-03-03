// MonthlyContainer.tsx
import React, { useEffect, useState } from 'react';
import MonthlyOverview from './MonthlyOverview';
import { ActivityDto, TotalLeaderboardEntryDto, MonthlyUserActivityDto } from '../api';
import '../styles/MonthlyTab.css';
import MonthSelector from './MonthSelector';
import ErrorDisplay from './ErrorDisplay';
import TikampApi from '../utils/TikampApi';
import { ClipLoader } from 'react-spinners';
import { SponsorerWithImportedLogos } from './Sponsorer';
import SummerImage from "../assets/images/summer_vacation.png";
import WinterImage from "../assets/images/winter_vacation.png";

interface Props {
  monthIndex: number;
  monthName: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  dataUpdated: () => void;
  loggedInUserId: string;
  entryToDisplayFor: TotalLeaderboardEntryDto | null;
  api: TikampApi;
  resetSelectedEntry: () => void;
}

const ActivityRegistrationTab: React.FC<Props> = ({
  monthIndex, 
  monthName,
  onNextMonth,
  onPreviousMonth,
  dataUpdated,
  loggedInUserId,
  entryToDisplayFor,
  api,
  resetSelectedEntry,
}) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyUserActivityDto | null>(null);
  const [loadingUserActivity, setLoadingUserActivity] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorOccurd, setErrorOccurd] = useState(false);
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);

  const handleUpdateQuantity = async (day: number, quantity: number) => {
    await api.putUserActivity(day, quantity, monthIndex +1)
    dataUpdated();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUserActivity(true);
      await api.getMonthlyActivity(monthIndex+1, entryToDisplayFor?.userId ?? loggedInUserId)
        .then((data) => {setMonthlyData(data); setErrorOccurd(false);})
        .catch((error) => {
          setErrorOccurd(true);
          console.error(" Got error fecting monthly data: "+error)});
      setLoadingUserActivity(false);
    }
    fetchData();
  }, [monthIndex, api, entryToDisplayFor, loggedInUserId]);

  useEffect(() => {
    const fetchData = async () => {
      await api.getActivities()
      .then((data) => setMonthlyActivity(data))
      .catch((error) => console.error(error));
      setLoadingActivities(false);
    }
    fetchData();
  }, [api]);
  return (
    <div className="monthly-tab">
      {loadingActivities ? (
            <div className="spinner-container">
              <ClipLoader size={40} color="#000" />
            </div>
          ) : (errorOccurd ? (<ErrorDisplay /> ) : (
      <>
        <MonthSelector 
          monthName={monthName}
          monthIndex={monthIndex}
          onNextMonth={onNextMonth}
          onPreviousMonth={onPreviousMonth}
          activity={monthlyActivity[monthIndex]}/>
        {(monthlyActivity[monthIndex]?.type !== 0) ? (
            (monthlyActivity[monthIndex]?.type === 1) ? (
              <img src={SummerImage} alt="Sommerferie" className="vacation-image " />
            ) : (<img src={WinterImage} alt="Vinterferie" className="vacation-image " />)
            ) : loadingUserActivity ? (
              <div className="spinner-container">
                <ClipLoader size={40} color="#000" />
              </div>
              ) : (
                <MonthlyOverview
                  monthIndex={monthIndex}
                  monthName={monthName}
                  loggedInUserId={loggedInUserId}
                  data={monthlyData}
                  displayingForEntry={entryToDisplayFor}
                  activity={monthlyActivity[monthIndex]}
                  onUpdateQuantity={handleUpdateQuantity}
                  resetSelectedEntry={resetSelectedEntry}
                />
              )
          }
          <SponsorerWithImportedLogos />
        </>
      ))}
    </div>
  );
};

export default ActivityRegistrationTab;

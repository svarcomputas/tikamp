import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import MedalGold from "../assets/svgs/medal-gold.svg";
import MedalSilver from "../assets/svgs/medal-silver.svg";
import MedalBronze from "../assets/svgs/medal-bronze.svg";
import SummerImage from "../assets/images/summer_vacation.png";
import WinterImage from "../assets/images/winter_vacation.png";
import { ActivityDto } from "../api";
import '../styles/ActivityDisplay.css';
import TikampApi from "../utils/TikampApi";
import { formatActivityValue } from "../utils/conversions";

interface Props {
  api: TikampApi;
}

const monthNames = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const ActivityDisplay: React.FC<Props> = ({ api }) => {
  
  const [monthlyActivity, setMonthlyActivity] = useState<ActivityDto[]>([]);
  useEffect(() => {
      api.getActivities()
        .then((data) => setMonthlyActivity(data))
        .catch((error) => console.error(error));
    }, [api]);
  return (
    <div className="activity-year-view grid grid-cols-2 gap-4">
      {monthNames.map((month, index) => {
        const activity = monthlyActivity.find(a => a.month === index +1 )
        if (!activity) {
          return (
          <Card key={month} className="activity-card">
            <h3 className="text-lg font-bold">{month}</h3>
            <h3>Ingenting registrert enda</h3>
          </Card>);
          }

        const { name, level1, level2, level3, description, type } = activity;

        return (
          <Card key={month} className="activity-card">
            {type === 1 ? (
              <div className="special-activity">
                <h3 className="text-lg font-bold">{month} - Sommerferie</h3>
                <img src={SummerImage} alt="Sommerferie" className="vacation-image " />
              </div>
            ) : type === 2 ? (
              <div className="special-activity">
                <h3 className="text-lg font-bold">{month} - Vinterferie</h3>
                <img src={WinterImage} alt="Vinterferie" className="vacation-image" />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold">{month} - {name}</h3>
                <div className="levels flex items-center gap-4 mt-2">
                  {level1 && (
                    <div className="level flex items-center gap-2">
                      <img src={MedalBronze} alt="Bronze Medal" className="medal-icon" />
                      <span>Nivå 1: {formatActivityValue(level1, activity?.unit ?? 0)}</span>
                    </div>
                  )}
                  {level2 && (
                    <div className="level flex items-center gap-2">
                      <img src={MedalSilver} alt="Silver Medal" className="medal-icon" />
                      <span>Nivå 2: {formatActivityValue(level2, activity?.unit ?? 0)}</span>
                    </div>
                  )}
                  {level3 && (
                    <div className="level flex items-center gap-2">
                      <img src={MedalGold} alt="Gold Medal" className="medal-icon" />
                      <span>Nivå 3: {formatActivityValue(level3, activity?.unit ?? 0)}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ActivityDisplay;
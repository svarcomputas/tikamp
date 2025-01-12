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
    <div className="activities-view">
    <div className="medal-info-display">
      <div className="medal-info bronze">
        <span>Bronsje: </span>
        <img src={MedalBronze} alt="Bronze Medal" className="medal-icon" />
        <span> (100 poeng)</span>
      </div>
      <div className="medal-info silver">
        <span>Sølv: </span>
        <img src={MedalSilver} alt="Silver Medal" className="medal-icon" />
        <span> (200 poeng)</span>
      </div>
      <div className="medal-info gold">
        <span>Gull: </span>
        <img src={MedalGold} alt="Gold Medal" className="medal-icon" />
        <span> (300 poeng)</span>
      </div>
    </div>
    <br/>
    <div className="activity-year-view">
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
          <Card key={month} className="activity-card p-2">
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
              < div className="lord">
                <h3 className="text-lg font-bold">{month} - {name}</h3>
                <div className="medal-info-display-card">
                  {level1 && (
                    <div className="medal-info-card bronze ">
                      <img src={MedalBronze} alt="Bronze Medal" className="medal-icon" />
                      <span>{formatActivityValue(level1, activity?.unit ?? 0)}</span>
                    </div>
                  )}
                  {level2 && (
                    <div className="medal-info-card silver">
                      <img src={MedalSilver} alt="Silver Medal" className="medal-icon" />
                      <span>{formatActivityValue(level2, activity?.unit ?? 0)}</span>
                    </div>
                  )}
                  {level3 && (
                    <div className="medal-info-card gold">
                      <img src={MedalGold} alt="Gold Medal" className="medal-icon" />
                      <span>{formatActivityValue(level3, activity?.unit ?? 0)}</span>
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
    </div>
  );
};

export default ActivityDisplay;
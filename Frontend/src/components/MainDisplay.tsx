// MainDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import { LeaderboardEntryDto } from '../api';
import '../styles/MainDisplay.css';
import TikampApi from '../utils/TikampApi';
import { useMsal } from '@azure/msal-react';
import { Flowbite, Tabs, TabsRef } from "flowbite-react";
import MonthlyLeaderboardTab from './MonthlyLeaderboardTab';
import ActivityRegistrationTab from './ActivityRegistrationTab';
import ActivityDisplay from './ActivityDisplay';


interface MainDisplayProps {
  api: TikampApi;
}

const  MainDisplay: React.FC<MainDisplayProps> = ({ api }) => {
  const months = [
    'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
  ];

  const tabsRef = useRef<TabsRef>(null);
  const [, setActiveTab] = useState(0);
  const { accounts } = useMsal();
  const idOfLoggedInUser = accounts.length > 0 ? accounts[0].localAccountId : '';
  const [entryToDisplay, setEntryToDisplay] = useState<LeaderboardEntryDto | null>(null);
  const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  api.setLoggedInUser(idOfLoggedInUser ?? '');
    const [monthIndex, setMonthIndex] = useState(0); // TODO get current
  
    const handleNextMonth = () => {
      setMonthIndex((prev) => (prev < 11 ? prev + 1 : prev));
    };
  
    const handlePreviousMonth = () => {
      setMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };
  
  const resetSelectedEntry = () => {
    setEntryToDisplay(null)
  };

  const handleSetIdOfDisplayedUser = async (entry: LeaderboardEntryDto | null) => {
    console.log("calling function")
    tabsRef.current?.setActiveTab(0);
    setActiveTab(0)
    setEntryToDisplay(entry)
  };

  useEffect(() => {
    api.getTotalLeaderboard()
      .then((data) => setTotalLeaderboard(data))
      .catch((error) => console.error(error));
  }, [api]);

  return (
    <div className="main-container">
      
    <Flowbite>
       <Tabs className="tabs-button" aria-label="Tabs with underline" variant="underline" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
       <Tabs.Item active title="Aktivitets registrering">
          <ActivityRegistrationTab
            monthIndex={monthIndex}
            monthName={months[monthIndex]}
            onNextMonth={handleNextMonth}
            onPreviousMonth={handlePreviousMonth}
            loggedInUserId={idOfLoggedInUser}
            entryToDisplayFor={entryToDisplay}
            api={api}
            resetSelectedEntry={resetSelectedEntry}
          />
        </Tabs.Item>
        <Tabs.Item active title="Månedlig tabell">
          <MonthlyLeaderboardTab
            monthIndex={monthIndex}
            monthName={months[monthIndex]}
            onNextMonth={handleNextMonth}
            onPreviousMonth={handlePreviousMonth}
            loggedInUserId={idOfLoggedInUser}
            api={api}
            onSelectEntry={handleSetIdOfDisplayedUser}
          />
        </Tabs.Item>
        <Tabs.Item title="Total oversikt">
          <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSetIdOfDisplayedUser} />
        </Tabs.Item>
        <Tabs.Item title="Aktiviteter">
          <ActivityDisplay api={api}/>
        </Tabs.Item>
      </Tabs>
      </Flowbite>
    </div>
  );
}

export default MainDisplay;

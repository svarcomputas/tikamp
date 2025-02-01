// MainDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import { TotalLeaderboardEntryDto } from '../api';
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
  const [fetchMonthlyLeaderbaord, setFetchMonthlyLeaderbaord] = useState<Boolean>(true);
  const [entryToDisplay, setEntryToDisplay] = useState<TotalLeaderboardEntryDto | null>(null);
  api.setLoggedInUser(idOfLoggedInUser ?? '');
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  
    const handleNextMonth = () => {
      setMonthIndex((prev) => (prev < 11 ? prev + 1 : prev));
      setFetchMonthlyLeaderbaord(true)
    };

    const handlePreviousMonth = () => {
      setMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
      setFetchMonthlyLeaderbaord(true)
    };
  
  const resetSelectedEntry = () => {
    setEntryToDisplay(null)
  };

  const handleSetIdOfDisplayedUser = async (entry: TotalLeaderboardEntryDto | null) => {
    tabsRef.current?.setActiveTab(0);
    setActiveTab(0)
    setEntryToDisplay(entry)
  };

  const handleClickOnTab = async (tab: number) => {
    setActiveTab(tab)
    if(tab === 1){
      resetSelectedEntry()
    }
  };

  return (
    <div className="main-container">
      
    <Flowbite>
       <Tabs className="tabs-button" aria-label="Tabs with underline" variant="underline" ref={tabsRef} onActiveTabChange={(tab) => handleClickOnTab(tab)}>
       <Tabs.Item active title="Registrering">
          <ActivityRegistrationTab
            monthIndex={monthIndex}
            monthName={months[monthIndex]}
            onNextMonth={handleNextMonth}
            onPreviousMonth={handlePreviousMonth}
            dataUpdated={() => setFetchMonthlyLeaderbaord(true)}
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
            leaderboardUpdated={() => setFetchMonthlyLeaderbaord(false)}
            shouldFetchLeaderboard={fetchMonthlyLeaderbaord}
            loggedInUserId={idOfLoggedInUser}
            api={api}
            onSelectEntry={handleSetIdOfDisplayedUser}
          />
        </Tabs.Item>
        <Tabs.Item title="Totalt">
          <TotalLeaderboard
            onSelectEntry={handleSetIdOfDisplayedUser} 
            leaderboardUpdated={() => setFetchMonthlyLeaderbaord(false)}
            shouldFetchLeaderboard={fetchMonthlyLeaderbaord}
            api={api}
            loggedInUserId={idOfLoggedInUser}
          />
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

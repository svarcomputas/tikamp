// MainDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import TotalLeaderboard from './TotalLeaderboard';
import MonthlyContainer from './MonthlyContainer';
import { LeaderboardEntryDto } from '../api';
import '../styles/MainDisplay.css';
import TikampApi from '../utils/TikampApi';
import { useMsal } from '@azure/msal-react';
import { Flowbite, Tabs, TabsRef } from "flowbite-react";


interface MainDisplayProps {
  api: TikampApi;
}

const  MainDisplay: React.FC<MainDisplayProps> = ({ api }) => {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const tabsRefMonthly = useRef<TabsRef>(null);
  const [activeTabMonth, setActiveTabMonth] = useState(0);
  const { accounts } = useMsal();
  const idOfLoggedInUser = accounts.length > 0 ? accounts[0].localAccountId : '';
  const [entryToDisplay, setEntryToDisplay] = useState<LeaderboardEntryDto | null>(null);
  const [totalLeaderboard, setTotalLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  api.setLoggedInUser(idOfLoggedInUser ?? '');

  const handleSetIdOfDisplayedUser = async (entry: LeaderboardEntryDto | null) => {
    tabsRef.current?.setActiveTab(0);
    tabsRefMonthly.current?.setActiveTab(0);
    setActiveTabMonth(0)
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
       <Tabs className="tabs-button" aria-label="Default tabs" variant="default" ref={tabsRef} onActiveTabChange={(tab) => setActiveTab(tab)}>
        <Tabs.Item active title="Månedlig oversikt">
          <MonthlyContainer
            loggedInUserId={idOfLoggedInUser}
            entryToDisplayFor={entryToDisplay}
            api={api}
            onSelectEntry={handleSetIdOfDisplayedUser}
            setActiveTab={setActiveTabMonth}
            tabsRefMonthly={tabsRefMonthly}
          />
        </Tabs.Item>
        <Tabs.Item title="Total oversikt">
          <TotalLeaderboard entries={totalLeaderboard} onSelectEntry={handleSetIdOfDisplayedUser} />
        </Tabs.Item>
      </Tabs>
      </Flowbite>
    </div>
  );
}

export default MainDisplay;

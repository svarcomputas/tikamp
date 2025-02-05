import React, { useState, useEffect } from 'react';
import '../styles/Sponsorer.css';
import { Modal } from 'flowbite-react';
import SqueezeLogo from '../assets/svgs/Squeeze-Logo-Beige.svg';
import OsloKlatrepark from '../assets/images/osloklatrepark_logo.jpg';
import InfoButton from './InfoButton';

interface Sponsor {
  logo: string;
  text: string;
}

interface SponsorerProps {
  sponsors: Sponsor[];
}
const SponsorPopup: React.FC<{ sponsors: Sponsor[], show: boolean, onClose: () => void }> = ({ sponsors, show, onClose }) => {
  return (
    <Modal show={show} onClose={onClose} size="lg">
      <Modal.Header>Sponsorer</Modal.Header>
      <Modal.Body>
        <div className="popup-content">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="popup-sponsor">
              <img src={sponsor.logo} alt={`Sponsor ${index + 1}`} className="popup-logo" />
              <p>{sponsor.text}</p>
              <br />
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

const Sponsorer: React.FC<SponsorerProps> = ({ sponsors }) => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const rowConfig = isSmallScreen ? [3, 3, 3] : [5, 5, 5];

  const rows: Sponsor[][] = [];
  let start = 0;
  let configIndex = 0;
  while (start < sponsors.length) {
    const logosInThisRow = rowConfig[configIndex] || rowConfig[rowConfig.length - 1];
    rows.push(sponsors.slice(start, start + logosInThisRow));
    start += logosInThisRow;
    configIndex++;
  }
console.log(showPopup)
  return (
    <div className="sponsorer-container">
      <div className="sponsor-header-container">
        <h2 className="sponsor-header">Sponsorer av Tikamp</h2>
        <InfoButton onClick={() => setShowPopup(true)} className="info-button"/>
      </div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="sponsorer-row">
          {row.map((sponsor, logoIndex) => (
            <div key={logoIndex} className="sponsorer-logo" onClick={() => { setShowPopup(true); }}>
              <img src={sponsor.logo} alt={`Sponsor ${rowIndex * 10 + logoIndex + 1}`} />
            </div>
          ))}
        </div>
      ))}

      
<SponsorPopup sponsors={sponsors} show={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export const SponsorerWithImportedLogos: React.FC = () => {
  const sponsors = [
    { logo: OsloKlatrepark, text: "Oslo Klatrepark er en klatrepark i vill og vakker natur med tolv spennende løyper, 80 elementer i trærne, samt løyper med hopp og flere ziplines. Løypene er bygd i forskjellige høyder og vanskelighetsgrader, så her er det noe for alle og enhver. Klatreparken har som mål å bidra til en sunnere, mer aktiv og spennende hverdag for alle, der man kan utprøve og utvikle sine ferdigheter. Den skal gi utfordringer på alle nivåer, slik at alle uansett forutsetninger kan oppleve mestring og glede ved fysisk aktivitet." },
    { logo: SqueezeLogo, text: "Massasje reduserer stress, stivhet og muskelspenninger, forbedrer søvnkvaliteten, og øker energinivå og fokus. Hos Squeeze får du profesjonell massasje med lange åpningstider." }
  ];
  return <Sponsorer sponsors={sponsors} />;
};

export default Sponsorer;





import React, { useState, useEffect } from 'react';
import '../styles/Sponsorer.css';

// Import local images from your repo

import SqueezeLogo from '../assets/svgs/Squeeze-Logo-Beige.svg';
import OksLogo from '../assets/svgs/OKS-Flat-Dark.svg';
// Import additional images as needed...

// If you plan to pass in images as props, you can adjust this interface.
interface SponsorerProps {
  logos: string[];
}

const Sponsorer: React.FC<SponsorerProps> = ({ logos }) => {
  // State to track whether we are on a small screen
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Check screen size on mount and on window resize
  useEffect(() => {
    const checkScreenSize = () => {
      // Adjust threshold as needed (768px here is just an example)
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Hardcoded row configuration: large screens will have up to five per row,
  // and small screens will have up to three per row.
  const rowConfig = isSmallScreen ? [3, 3, 3] : [5, 5, 5];

  // Split the logos array into rows based on the configuration.
  const rows: string[][] = [];
  let start = 0;
  let configIndex = 0;
  while (start < logos.length) {
    // Use the configured number for this row, or the last number if we run out of config entries.
    const logosInThisRow = rowConfig[configIndex] || rowConfig[rowConfig.length - 1];
    rows.push(logos.slice(start, start + logosInThisRow));
    start += logosInThisRow;
    configIndex++;
  }

  return (
    <div className="sponsorer-container">
      <h2 className='sponsor-header'>Sponsorer av Tikamp</h2>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="sponsorer-row">
          {row.map((logo, logoIndex) => (
            <div key={logoIndex} className="sponsorer-logo">
              <img src={logo} alt={`Sponsor ${rowIndex * 10 + logoIndex + 1}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const SponsorerWithImportedLogos: React.FC = () => {
  const logos = [OksLogo, SqueezeLogo];
  return <Sponsorer logos={logos} />;
};

export default Sponsorer;

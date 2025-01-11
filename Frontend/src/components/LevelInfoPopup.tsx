import MedalGold from '../assets/svgs/medal-gold.svg';
import MedalSilver from '../assets/svgs/medal-silver.svg';
import MedalBronze from '../assets/svgs/medal-bronze.svg';
import { Modal } from 'flowbite-react';
import { ActivityDto } from '../api';

const LevelInfoPopup: React.FC<{ onClose: () => void; activity?: ActivityDto }> = ({ onClose, activity }) => {
  return (
    <Modal dismissible show={true} onClose={onClose} size="lg">
      <Modal.Header>Nivåinformasjon</Modal.Header>
      <Modal.Body>
        <div className="level-info">
          {activity?.level3 && (
            <div className="level-info-item">
              <img src={MedalGold} alt="Gold Medal" className="medal-info" />
              <span>Nivå 3: {activity.level3}</span>
            </div>
          )}
          {activity?.level2 && (
            <div className="level-info-item">
              <img src={MedalSilver} alt="Silver Medal" className="medal-info" />
              <span>Nivå 2: {activity.level2}</span>
            </div>
          )}
          {activity?.level1 && (
            <div className="level-info-item">
              <img src={MedalBronze} alt="Bronze Medal" className="medal-info" />
              <span>Nivå 1: {activity.level1}</span>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default LevelInfoPopup;
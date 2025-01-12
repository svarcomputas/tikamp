import MedalGold from '../../assets/svgs/medal-gold.svg';
import MedalSilver from '../../assets/svgs/medal-silver.svg';
import MedalBronze from '../../assets/svgs/medal-bronze.svg';
import { Modal } from 'flowbite-react';
import { ActivityDto } from '../../api';
import { formatActivityValue } from '../../utils/conversions';

const LevelInfoPopup: React.FC<{ onClose: () => void; activity?: ActivityDto }> = ({ onClose, activity }) => {
  return (
    <Modal dismissible show={true} onClose={onClose} size="lg">
      <Modal.Header>Nivåinformasjon</Modal.Header>
      <Modal.Body>
        <div className="level-info">
          {activity?.level3 && (
            <div className="level-info-item">
              <img src={MedalGold} alt="Gold Medal" className="medal-info" />
              <span>Gull-nivå: {formatActivityValue(activity.level3, activity.unit ?? 0)}</span>
            </div>
          )}
          {activity?.level2 && (
            <div className="level-info-item">
              <img src={MedalSilver} alt="Silver Medal" className="medal-info" />
              <span>Sølv-nivå: {formatActivityValue(activity.level2, activity.unit ?? 0)}</span>
            </div>
          )}
          {activity?.level1 && (
            <div className="level-info-item">
              <img src={MedalBronze} alt="Bronze Medal" className="medal-info" />
              <span>Bronsje-nivå: {formatActivityValue(activity.level1, activity.unit ?? 0)}</span>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default LevelInfoPopup;
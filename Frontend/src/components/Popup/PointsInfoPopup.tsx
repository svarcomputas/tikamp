import React from 'react';
import { Modal, Table, Tabs } from 'flowbite-react';
import MedalGold from '../../assets/svgs/medal-gold.svg';
import MedalSilver from '../../assets/svgs/medal-silver.svg';
import MedalBronze from '../../assets/svgs/medal-bronze.svg';
import { ActivityDto } from '../../api';
import '../../styles/Popup/PointsInfoPopup.css';
import { formatActivityValue } from '../../utils/conversions';

interface PointsInfoPopupProps {
  onClose: () => void;
  activity?: ActivityDto
}

const PointsInfoPopup: React.FC<PointsInfoPopupProps> = ({ onClose, activity }) => {
  return (
    <Modal dismissible show={true} onClose={onClose} size="lg">
      <Modal.Header>Poenggivning</Modal.Header>
      <Modal.Body>
        <p>
          Poengene man får hver måned er summen av nivået man oppnår og plasseringen man får
        </p>
        <br/>
        <Tabs className="tabs-button" aria-label="Tabs with underline" variant="underline">
          <Tabs.Item title="Nivåpoeng" active>
            <div className="level-info">
              <div className="level-info-item">
                <img src={MedalGold} alt="Gold Medal" className="medal-info" />
                <div>
                  <span className="level-title">Gull-nivå: {formatActivityValue(activity?.level3??0, activity?.unit ?? 0)}</span>
                  <p className="level-description">Gir 300 poeng</p>
                </div>
              </div>
              <div className="level-info-item">
                <img src={MedalSilver} alt="Silver Medal" className="medal-info" />
                <div>
                  <span className="level-title">Sølv-nivå: {formatActivityValue(activity?.level2 ?? 0, activity?.unit ?? 0)}</span>
                  <p className="level-description">Gir 200 poeng</p>
                </div>
              </div>
              <div className="level-info-item">
                <img src={MedalBronze} alt="Bronze Medal" className="medal-info" />
                <div>
                  <span className="level-title">Bronsje-nivå: {formatActivityValue(activity?.level1 ?? 0, activity?.unit ?? 0)}</span>
                  <p className="level-description">Gir 100 poeng</p>
                </div>
              </div>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Plasseringspoeng">
            <div className="placement-info">
              <Table striped className="placement-table">
                <Table.Head>
                  <Table.HeadCell>Plassering</Table.HeadCell>
                  <Table.HeadCell>Poeng</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>1</Table.Cell>
                    <Table.Cell>400</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>2</Table.Cell>
                    <Table.Cell>360</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>3</Table.Cell>
                    <Table.Cell>330</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>4</Table.Cell>
                    <Table.Cell>300</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 20%</Table.Cell>
                    <Table.Cell>270</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 30%</Table.Cell>
                    <Table.Cell>240</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 40%</Table.Cell>
                    <Table.Cell>210</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 50%</Table.Cell>
                    <Table.Cell>180</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 60%</Table.Cell>
                    <Table.Cell>150</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 70%</Table.Cell>
                    <Table.Cell>120</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 80%</Table.Cell>
                    <Table.Cell>90</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Top 90%</Table.Cell>
                    <Table.Cell>60</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Deltatt</Table.Cell>
                    <Table.Cell>30</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </Tabs.Item>  
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default PointsInfoPopup;
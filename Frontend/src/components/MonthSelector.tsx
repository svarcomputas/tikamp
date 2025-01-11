import { Button, Table } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { ActivityDto } from "../api";
import '../styles/MonthSelector.css';
import { formatActivityValue } from "../utils/conversions";
interface Props {
  monthName: string;
  monthIndex: number;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  activity?: ActivityDto;
}

const MonthSelector: React.FC<Props> = ({
  monthName,
  monthIndex,
  onNextMonth,
  onPreviousMonth,
  activity
}) => {
  return (
    <div className="month-selector">
        <div className="flex gap-2">
            <Button pill
                onClick={onPreviousMonth} 
                disabled={monthIndex === 0}>
                <HiOutlineArrowLeft className="h-4 w-4" />
            </Button>
            <div className="month-selector-display">
                <span className="month-selector-title">{monthName} - {activity?.name}</span>
                
                </div>
                {/* <br/>
            <Table>
                <Table.Head>
                    <Table.HeadCell>Nivå 1</Table.HeadCell>
                    <Table.HeadCell>Nivå 2</Table.HeadCell>
                    <Table.HeadCell>Nivå 3</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{formatActivityValue(activity?.level1 ?? 0, activity?.unit ?? 0)}</Table.Cell>
                    <Table.Cell>{formatActivityValue(activity?.level2 ?? 0, activity?.unit ?? 0)}</Table.Cell>
                    <Table.Cell>{formatActivityValue(activity?.level3 ?? 0, activity?.unit ?? 0)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
                </Table>
                <span className="month-selector-info">{activity?.description}</span><br/>
            </div> */}
            <Button pill
                onClick={onNextMonth} 
                disabled={monthIndex === 11}>
                <HiOutlineArrowRight className="h-4 w-4" />
            </Button>
        </div>
    </div>
  );
}


export default MonthSelector;
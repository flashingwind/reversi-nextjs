import { CellFlag, CellValue } from "../utils/OthelloLogic";

type CellProps = {
    row: number;
    col: number;
    cellValue: CellValue;
    cellFlag: CellFlag;
    onClick: (row: number, col: number) => void;
}

const getStonetyle = (value: CellValue): string => {
    switch (value) {
        case -1:
            return 'white stone'; // Black stone
        case 1:
            return 'black stone'; // White stone
        default:
            return 'stone'; // Empty cell
    }
}

const Cell = ({ row,col,cellValue,cellFlag,onClick}:CellProps ) => {
    return (
        <div
        className={"cell "+cellFlag}
        onClick={() => onClick(row, col)}
        >
            <div className={getStonetyle(cellValue)}>{cellFlag}</div>
        </div>
    );
}
export default Cell;
export { getStonetyle };

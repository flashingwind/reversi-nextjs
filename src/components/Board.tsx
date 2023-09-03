// src/components/Board.tsx
import React from 'react';
import { CellMatrix, CellValue } from '../utils/OthelloLogic';

type CellClickHandler = (currentPlayer:CellValue, row: number, col: number) => void;

interface BoardProps {
    cells: CellMatrix;
    currentPlayer: CellValue;
    onCellClick: CellClickHandler;
}

const Board: React.FC<BoardProps> = ({ cells, currentPlayer, onCellClick }) => {
    return (
    <div className="board">
        {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
            {row.map((cellValue, colIndex) => (
                <div
                key={colIndex}
                className="cell"
                onClick={() => onCellClick(currentPlayer, rowIndex, colIndex)}
                >
                <div className="stone">{renderCellValue(cellValue)}</div>
                </div>
            ))}
            </div>
        ))}
    </div>
  );
};

const renderCellValue = (value: CellValue): string => {
  switch (value) {
    case -1:
      return '○'; // Black stone
    case 1:
      return '●'; // White stone
    default:
      return ''; // Empty cell
  }
};

export default Board;

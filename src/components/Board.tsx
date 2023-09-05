// src/components/Board.tsx
import React, { useState } from 'react';
import { CellMatrix, CellValue, processCells } from '../utils/OthelloLogic';

export interface BoardPropsType {
  player: CellValue;
  cells: CellMatrix;
  flags: CellMatrix;
}

const Board: React.FC = ({  }) => {
  const initialCells: CellMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const zeroCells: CellMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [BoardProps, setBoardProps] = useState<BoardPropsType>({
    // 先手(黒)・後手(白)
    player: 1 as CellValue,
    cells: initialCells,
    flags: zeroCells
  });

const onCellClick = (row: number, col: number) => {
  // Update the cells with the new move
  console.log(`click: ${row},${col}`);
  setBoardProps((prevBoardProps: BoardPropsType) => {
      const [isValid, newBoardProps] = processCells(prevBoardProps, row, col);
      if (isValid) {
        console.log(`click=${isValid} cells[${row}][${col}]=${newBoardProps.cells[row][col]} player=${newBoardProps.player}`);
      }
      return newBoardProps;
  });

};

  return (
    <div className="board">
      Current Player: {renderCellValue(BoardProps.player)}
      {BoardProps.cells.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
        {row.map((cellValue, colIndex) => (
          <div
            key={colIndex}
            className="cell"
            style={BoardProps.flags[rowIndex][colIndex] === -1 ? { background: "blue" } : {}}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
          <div className="stone" >{renderCellValue(cellValue)}</div>
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

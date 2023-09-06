// src/components/Board.tsx
import React, { useState } from 'react';
import { CellFlag, CellFlagMatrix, CellMatrix, CellValue, initialMap, markPlaceableCells, noneFlags, placeAndReverse } from '../utils/OthelloLogic';

export interface BoardPropsType {
  player: CellValue;
  map: CellMatrix;
  flags: CellFlagMatrix;
}

const Board: React.FC = ({  }) => {

  const [BoardProps, setBoardProps] = useState<BoardPropsType>({
    // 先手(黒)・後手(白)
    player: 1 as CellValue,
    map: initialMap(),
    flags: noneFlags(),
  });

const onCellClick = (row: number, col: number) => {
  // Update the map with the new move
  console.log(`click: ${row},${col}`);
  setBoardProps((prevBoardProps: BoardPropsType) => {
      const [isValid, newBoardProps] = placeAndReverse(prevBoardProps, row, col);
      if (isValid) {
        console.log(`click=${isValid} map[${row}][${col}]=${newBoardProps.map[row][col]} player=${newBoardProps.player}`);
        markPlaceableCells(newBoardProps);
      }
      return newBoardProps;
  });

};

  return (
    <div className="board">
      Current Player: {renderCellValue(BoardProps.player)}
      {BoardProps.map.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
        {row.map((cellValue, colIndex) => (
          <div
            key={colIndex}
            className={"cell "+ (BoardProps.flags[rowIndex][colIndex] === CellFlag.Changed ?  "changed"  : "")+" "+ (BoardProps.flags[rowIndex][colIndex] === CellFlag.Placeable ?  "placeable"  : "")}

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

import { useState } from 'react';
import Cell, { getStonetyle } from '../components/Cell';
import { CellFlag, CellFlagMatrix, CellMatrix, CellValue, initialMap, noneFlags, place, placeAutomatically, searchPlaceableCellsAndCalcScore } from '../utils/OthelloLogic';

export interface BoardPropsType {
  player: CellValue;
  map: CellMatrix;
  flags: CellFlagMatrix;
}

const Board = () => {
  const [BoardProps, setBoardProps] = useState<BoardPropsType>({
    // 先手(黒)・後手(白)
    player: 1 as CellValue,
    map: initialMap(),
    flags: noneFlags(),
  });

const onCellClick = (row: number, col: number):void => {
  // Update the map with the new move
  setBoardProps((prevBoardProps: BoardPropsType) => {
    const [isValid, newBoardProps] = place(prevBoardProps, row, col);
    if (isValid) {
      const [isValid2, newBoardProps2] = placeAutomatically(newBoardProps);
      const scores = searchPlaceableCellsAndCalcScore(newBoardProps2);
      scores.map(([r,c,_]) => {
        newBoardProps.flags[r][c] = CellFlag.Placeable;
      });
        return newBoardProps2;
    }
    return newBoardProps;
  });

};

  return (
    <div className="board">
      Current Player: {getStonetyle(BoardProps.player)}
      {BoardProps.map.map((row: CellValue[], rowIndex: number) => (
        <div key={rowIndex} className="row">
          {row.map((cellValue: CellValue, colIndex: number) => (
            <Cell key={"cell-"+rowIndex+"-"+colIndex} row = { rowIndex } col={ colIndex } onClick={ onCellClick } cellValue={ cellValue } cellFlag={ BoardProps.flags[rowIndex][colIndex] } />
          ))}
          </div>
      ))}
    </div>
  );
};


export default Board;

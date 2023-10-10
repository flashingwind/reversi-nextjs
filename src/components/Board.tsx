import { useState } from 'react';
import Cell, { getStonetyle } from '../components/Cell';
import { CellFlag, CellFlagMatrix, CellMatrix, CellValue, copyBoardProps, initialMap, noneFlags, place, placeAutomatically, searchPlaceableCellsAndCalcScore } from '../utils/OthelloLogic';

export interface BoardPropsType {
  player: CellValue;
  map: CellMatrix;
  flags: CellFlagMatrix;
  revCnt: number;
}
export interface LogPropsType {
  text: string[];
}

const Board = () => {
  const [BoardProps, setBoardProps] = useState<BoardPropsType>({
    // 先手(黒)・後手(白)
    player: 1 as CellValue,
    map: initialMap(),
    flags: noneFlags(),
    revCnt: 0
  });
  const [LogProps, setLogProps] = useState<LogPropsType>({
    text: [],
  });
  const onFullAutoButtonClick = (): void => {
    let intervalId = setInterval(genRandomClick, 100)
    // setTimeout(() => clearInterval(intervalId), 5000)
   }
   const genRandomClick = (): void => {
      onCellClick(Math.floor(Math.random() * 8), Math.floor(Math.random() * 8));
   }
  const onCellClick = (row: number, col: number):void => {
    // Update the map with the new move
    let logMsg = "";
    let is_both_skiped = false;
    setBoardProps((boardProps: BoardPropsType) => {
      let scores = searchPlaceableCellsAndCalcScore(boardProps);
      let newBoardProps = copyBoardProps(boardProps);
      for(let skipCnt = 0; skipCnt < 64;skipCnt++) {
        const isPlaced = place(newBoardProps, row, col);
        if (isPlaced||scores.length==0) {
          logMsg += "●: " + row + ", " + col;
          console.log("●: " + row + ", " + col);
          if (placeAutomatically(newBoardProps)) {
            console.log("○: Auto: OK");
          } else {
            is_both_skiped = true;
            logMsg += "○: Auto: : skip";
            console.log("○: Auto: skip");
          }
        }
        setLogProps((logProps: LogPropsType) => {
          const newLogProps: LogPropsType = {
            text: [logMsg],
          };
          return logProps;
        });
        scores = searchPlaceableCellsAndCalcScore(newBoardProps);
        scores.map(([r,c,_]) => {
          newBoardProps.flags[r][c] = CellFlag.Placeable;
        });
        if (scores.length != 0) {
          if (is_both_skiped) {
            break;
          }
          return newBoardProps;
        }
        newBoardProps = copyBoardProps(boardProps);
      }
      return newBoardProps;
    });
};
  // onCellClick(Math.floor( Math.random() * 8 ),Math.floor( Math.random() * 8 ));

  const getScoreString = ((BoardProps: BoardPropsType): string => {
    let white = 0;
    let black = 0;
    BoardProps.map.map((row, rowIndex) => {
      row.map((cell, colIndex) => {
        if (cell === 1) {
          black++;
        } else if (cell === -1) {
          white++;
        }
      });
    });
    return `●:${black} ○:${white}`;
  });
  return (
    <div className="board">
      <div className='score'>Current Player: {getStonetyle(BoardProps.player)} {getScoreString(BoardProps)} Revese count: {BoardProps.revCnt}</div>
      <div className='auto'><a href='#' onClick={onFullAutoButtonClick} >Full auto</a></div>
        <div className='cells_border'>
        {BoardProps.map.map((row: CellValue[], rowIndex: number) => (
          <div key={rowIndex} className="row">
            {row.map((cellValue: CellValue, colIndex: number) => (
              <Cell key={"cell-"+rowIndex+"-"+colIndex} row = { rowIndex } col={ colIndex } onClick={ onCellClick } cellValue={ cellValue } cellFlag={ BoardProps.flags[rowIndex][colIndex] } />
            ))}
            </div>
        ))}
      </div>
      <div className='text'>Msg:{ LogProps.text }</div>
    </div>
  );
};


export default Board;

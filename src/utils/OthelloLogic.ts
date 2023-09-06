import { BoardPropsType } from '../components/Board';

type Direction = [number, number];
type Coordinate = [number, number];
type CellValue = -1 | 0 | 1; // Define CellValue type here
type CellMatrix = CellValue[][];
export enum CellFlag {
  None,
  Changed,
  Placeable,
  Placed,
};
type CellFlagMatrix = CellFlag[][];

const OtheloLogic = ()=> {
  return ;
}

const directions: Direction[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];
export const initialMap = (): CellMatrix => {
  const initialMap: CellMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, -1, 1, 0, 0, 0],
    [0, 0, 0, 1, -1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  return initialMap;
};
export const zeroMap = (): CellMatrix => {
  const zeroMap: CellMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  return zeroMap;
};
export const noneFlags = (): CellFlagMatrix  => {
  const zeros:CellFlagMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  return zeros;
};
export const copyCellMatrix = (matrix: CellMatrix) => {
  let map2: CellMatrix = [];
  for(const l of matrix){
    map2.push([...l]);
  }
  return map2;
};
export const copyBoardProps = (boardProps: BoardPropsType): BoardPropsType => {
  let newBoardProps: BoardPropsType = {
    map: copyCellMatrix(boardProps.map),
    flags:  noneFlags(),
    player: boardProps.player,
  };
  return newBoardProps;
};
export const placeAndReverse = (boardProps: BoardPropsType, row: number, col: number, shortcutEval: boolean = false): [boolean, BoardPropsType] => {

  let isValid = false;
  const player = boardProps.player;
  const map: CellMatrix = boardProps.map;

  const newBoardProps = copyBoardProps(boardProps);
  if (map[row][col] !== 0) {
    // Cell is not empty
    // console.log("Cell is not empty");
    return [isValid, newBoardProps];
  }

  directions.forEach(([dy, dx], i) => {
    let r = row + dy;
    let c = col + dx;
    let foundEnermy = false;
    let rev_cache: Coordinate[] = [];
    while (0 <= r && r < map.length && 0 <= c && c < map[0].length) {
      // console.log(`1 search${dy},${dx}:${r},${c}: ${map[r][c]} === ${player}`);
      if (map[r][c] === 0) {
        // console.log(`   found0 ${map[r][c]}: ${r},${c}`);
        break;
      } else if (map[r][c] === -player) {
        // 敵
        foundEnermy = true;
        rev_cache = [...rev_cache, [r, c]];
        // console.log(`     foundEnermy ${map[r][c]}: ${r},${c}, rev_cache: `);
      } else if (map[r][c] === player) {
        // 味方
        // console.log(`   foun味方 ${map[r][c]}: ${r},${c}, rev_cache: `);
        if (foundEnermy) {
          // いきなり味方ではない
          isValid = true;
          if (shortcutEval) {
            // 短絡表羽化的にreturnする。変更しない
            return [isValid, newBoardProps];
          } else {
            console.table(rev_cache);
            newBoardProps.map[row][col] = player;// 置いた石
            rev_cache.forEach(([r, c]) => {
              newBoardProps.map[r][c] = player;
              newBoardProps.flags[r][c] = CellFlag.Changed;
              // console.log(`     rev: ${c} , ${r} = ${player}`);
              // console.log(newBoardProps.map[r][c]==1 ? "●" : "○");
            });
            newBoardProps.player = -player as CellValue;
          }
        } else {
          // console.log("  4 いきなり味方");
          break;
        }
      }

      r += dy;
      c += dx;
    }
    rev_cache = [];
  });
  return [isValid, newBoardProps];
};

export const markPlaceableCells = (boardProps: BoardPropsType) => {
  const flags = boardProps.flags;
  boardProps.map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (boardProps.map[rowIndex][colIndex] === 0) {
        const [isPlaceable, _] = placeAndReverse(boardProps, rowIndex, colIndex, true);
        if (isPlaceable) {
          flags[rowIndex][colIndex]=CellFlag.Placeable;
        }
      }
    });
  });
};
export type { CellFlagMatrix, CellMatrix, CellValue };
export default OtheloLogic;

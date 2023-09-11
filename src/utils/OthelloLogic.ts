import { BoardPropsType } from "../components/Board";

type Direction = [number, number];
type Coordinate = [number, number];
type CoordinateSet = Coordinate[];
type CellValue = -1 | 0 | 1; // Define CellValue type here
type CellMatrix = CellValue[][];
type ScoredCellMatrix = number[][];
export enum CellFlag {
  None,
  Changed,
  Placeable,
  Placed,
}

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
const scoredMap: ScoredCellMatrix = [
  [45, -11, 4, -1, -1, 4, -11, 45],
  [-11, -16, -1, -3, -3, 2, -16, -11],
  [4, -1, 2, -1, -1, 2, -1, 4],
  [-1, -3, -1, 0, 0, -1, -3, -1],
  [-1, -3, -1, 0, 0, -1, -3, -1],
  [4, -1, 2, -1, -1, 2, -1, 4],
  [-11, -16, -1, -3, -3, -1, -16, -11],
  [45, -11, 4, -1, -1, 4, -11, 45],
];

export const copyCellMatrix = (matrix: CellMatrix) => {
  const map2: CellMatrix = [];
  for(const l of matrix){
    map2.push([...l]);
  }
  return map2;
};
export const copyBoardProps = (boardProps: BoardPropsType): BoardPropsType => {
  const newBoardProps: BoardPropsType = {
    map: copyCellMatrix(boardProps.map),
    flags:  noneFlags(),
    player: boardProps.player,
  };
  return newBoardProps;
};

export const place = (boardProps: BoardPropsType, row: number, col: number): [boolean,BoardPropsType] => {
  const newBoardProps = copyBoardProps(boardProps);
  const [isValid, toBeRev] = searchReversibleCells(boardProps, row, col);
  if (isValid) {
    newBoardProps.map[row][col] = boardProps.player;
    toBeRev.forEach(([r, c]) => {
      newBoardProps.map[r][c] = boardProps.player;
      newBoardProps.flags[r][c] = CellFlag.Changed;
    });
    newBoardProps.player = -boardProps.player as CellValue;
  }
  return [isValid,newBoardProps];
}

export const placeAutomatically = (boardProps: BoardPropsType):[boolean,BoardPropsType] => {
  let maxScore = 0;
  let maxScoreCell:number[] = [];
  const scores = searchPlaceableCellsAndCalcScore(boardProps);
  if (scores.length != 0) {
    scores.sort((a, b) => b[2] - a[2]);
    const [row, col, s] = scores[0];
    const [isValid, newBoardProps] = place(boardProps, row, col);
    console.log(`auto: ${row}, ${col}, ${s}: ${isValid}`);
    return [isValid, newBoardProps];
  } else {
    return [false, boardProps];
  }
};

export const searchPlaceableCellsAndCalcScore = (boardProps: BoardPropsType): [number,number,number][] => {
  let socres: [number,number,number][]=[];
  boardProps.map.map((row: CellValue[], rowIndex: number) => {
    row.map((cellValue: CellValue, colIndex: number) => {
      const [isPlaceable, reversibleSet] = searchReversibleCells(boardProps, rowIndex, colIndex);
      if (isPlaceable) {
        let s = scoredMap[rowIndex][colIndex];
        for (const [r, c] of reversibleSet) {
          s += scoredMap[r][c];
        }
        socres=[...socres,[rowIndex,colIndex,s]];
      }
    });
  });
  return socres;

};

export const searchReversibleCells = (boardProps: BoardPropsType, row: number, col: number, shortcutEval = false): [boolean, CoordinateSet] => {
  let isValid = false;
  const player = boardProps.player;
  const map: CellMatrix = boardProps.map;
  let toBeRev: CoordinateSet= [];
  if (map[row][col] !== 0) {
    // Cell is not empty
    return [isValid, toBeRev];
  }
  directions.forEach(([dy, dx]) => {
    let r = row + dy;
    let c = col + dx;
    let foundEnermy = false;
    let toBeRevCache: CoordinateSet= [];
    while (0 <= r && r < map.length && 0 <= c && c < map[0].length) {
      if (map[r][c] === 0) {
        break;
      } else if (map[r][c] === -player) {
        // 敵
        foundEnermy = true;
        toBeRevCache = [...toBeRevCache, [r, c]];
      } else if (map[r][c] === player) {
        // 味方
        if (foundEnermy) {
          // 敵→味方
          isValid = true;
          if (shortcutEval) {
            // 短絡的にreturnする。toBeRevを変更しない
            return [isValid, toBeRev];
          } else {
            toBeRev = [...toBeRev, ...toBeRevCache];
            break;
          }
        } else {
          // いきなり味方;
          break;
        }
      }
      r += dy;
      c += dx;
    }
  });
  return [isValid, toBeRev];
};


export const markPlaceableCells = (boardProps: BoardPropsType) => {
  const flags = boardProps.flags;
  boardProps.map.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      if (boardProps.map[rowIndex][colIndex] === 0) {
        const [isPlaceable, _] = searchReversibleCells(boardProps, rowIndex, colIndex, true);
        if (isPlaceable) {
          flags[rowIndex][colIndex]=CellFlag.Placeable;
        }
      }
    });
  });
};
export type { CellFlagMatrix, CellMatrix, CellValue };
export default OtheloLogic;

import { BoardPropsType } from '../components/Board';

type Direction = [number, number];
type Coordinate = [number, number];
type CellValue = -1 | 0 | 1; // Define CellValue type here
type CellMatrix = CellValue[][];

const OtheloLogic = ()=> {
  return ;
}

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

export const copyBoardProps = (boardProps: BoardPropsType): BoardPropsType => {
  let cells2: CellMatrix = [];
  for(const l of boardProps.cells){
    cells2.push([...l]);
  }
  const flags2: CellMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // let flags2: CellMatrix = [];
  // for(const l of boardProps.flags){
  //   flags2.push([...l]);
  // }
  let newBoardProps: BoardPropsType = {
    cells: cells2,
    flags: flags2,
    player: boardProps.player,
  };
  return newBoardProps;
};
export const processCells = (boardProps: BoardPropsType, row: number, col: number, shortcutEval: boolean=false): [boolean, BoardPropsType] => {

  let isValid = false;
  const player = boardProps.player;
  const cells: CellMatrix = boardProps.cells;

  const newBoardProps = copyBoardProps(boardProps);
  if (cells[row][col] !== 0) {
    // Cell is not empty
    console.log("Cell is not empty");
    return [isValid, newBoardProps];
  }

  directions.forEach(([dy, dx], i) => {
    let r = row + dy;
    let c = col + dx;
    let foundEnermy = false;
    let rev_cache: Coordinate[] = [];
    while (0 <= r && r < cells.length && 0 <= c && c < cells[0].length) {
      console.log(`1 search${dy},${dx}:${r},${c}: ${cells[r][c]} === ${player}`);
      if (cells[r][c] === 0) {
        console.log(`   found0 ${cells[r][c]}: ${r},${c}`);
        break;
      } else if (cells[r][c] === -player) {
        // 敵
        foundEnermy = true;
        rev_cache=[...rev_cache,[r, c]];
        console.log(`     foundEnermy ${cells[r][c]}: ${r},${c}, rev_cache: `);
        // console.table(rev_cache);
      } else if (cells[r][c] === player) {
        // 味方
        console.log(`   foun味方 ${cells[r][c]}: ${r},${c}, rev_cache: `);
        if (foundEnermy) {
          // いきなり味方ではない
          isValid = true;
          if (shortcutEval) {
            // 短絡表羽化的にreturnする。変更しない
            return [isValid, newBoardProps];
          } else {
            newBoardProps.cells[row][col] = player;// 置いた石
            rev_cache.forEach(([r, c]) => {
              newBoardProps.cells[r][c] = player;
              newBoardProps.flags[r][c] = -1;
              console.log(`     rev: ${c} , ${r} = ${player}`);
              console.log(newBoardProps.cells[r][c]==1 ? "●" : "○");
            });
            newBoardProps.player = -player as CellValue;
          }
        } else {
          console.log("  4 いきなり味方");
        }
        break;
      }

      r += dy;
      c += dx;
    }
    rev_cache = [];
  });
  return [isValid,newBoardProps];
}
export type { CellMatrix, CellValue };
export default OtheloLogic;

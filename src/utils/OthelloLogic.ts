type Direction = [number, number];
type CellValue = -1 | 0 | 1; // Define CellValue type here
type CellMatrix = CellValue[][];

export function isValidMove(cells: CellMatrix, player: CellValue, row: number, col: number): boolean {
    if (cells[row][col] !== 0) {
      return false; // Cell is not empty
    }

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    let validMove = false;

    for (const [dx, dy] of directions) {
      let r = row + dx;
      let c = col + dy;
      let foundEnemy = false;
      if (cells[r][c] === -player) {
        foundEnemy = true;
      } else if (cells[r][c] === player || cells[r][c] === 0) {
        continue;
      }
      while (0 <= r && r < cells.length && 0 <= c && c < cells[0].length) {
        if (cells[r][c] === -player) {
        } else if (cells[r][c] === player) {
          if (foundEnemy) {
            validMove = true;
          }
          break;
        } else {
          break;
        }

        r += dx;
        c += dy;
      }
    }

    return validMove;
}
export type { CellMatrix, CellValue };

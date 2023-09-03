"use client"

import React, { useState } from 'react';
import Board from '../components/Board';
import { CellMatrix, CellValue, isValidMove } from '../utils/OthelloLogic';

const OthelloGame: React.FC = () => {
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

  const [cells, setCells] = useState<CellMatrix>(initialCells);

  let [player, setPlayer] = useState<CellValue>(-1);

  const handleCellClick = (currentPlayer: CellValue, row: number, col: number) => {
    console.log(`click: row=${row} col=${col} currentPlayer=${currentPlayer}`);
    console.log(`click: isValidMove=${isValidMove(cells, currentPlayer, row, col)}`);
    if (isValidMove(cells, currentPlayer, row, col)) {
      // Update the cells with the new move
      cells[row][col] = currentPlayer;
      if(currentPlayer === -1){
        player = 1;
      } else {
        player = -1;
      }
      console.log(`isValid: cells[row][col]=${cells[row][col]} currentPlayer=${currentPlayer}`);
    }
  };

  return (
      <Board cells={cells} currentPlayer={player} onCellClick={handleCellClick} />
  );
};

export default OthelloGame;

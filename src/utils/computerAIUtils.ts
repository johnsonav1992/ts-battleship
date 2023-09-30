import {
    BoardCell
    , ComputerAI
    , GameState
} from '../types/types';

export const STARTING_PROBABILITY = 3;
export const HIGHEST_PROBABILITY = 5;
export const LOWEST_PROBABILITY = 0;

export const updateComputerAI = ( state: GameState, attemptedCell: BoardCell['cellNum'], wasHit: boolean ): ComputerAI => {
    return {
        lastShot: {
            cellNum: attemptedCell
            , wasHit
        }
        , heatMapCells: state.computerAI.heatMapCells.map( cell => {
            if ( cell.cellNum === attemptedCell ) {
                return {
                    ...cell
                    , heatValue: wasHit ? HIGHEST_PROBABILITY : LOWEST_PROBABILITY
                };
            } else if ( isSurroundingHitCell( cell.cellNum, attemptedCell ) && !state.computerAttemptedCells.includes( cell.cellNum ) ) {
                return {
                    ...cell
                    , heatValue: wasHit ? cell.heatValue + 1 : cell.heatValue - 1
                };
            }
            return cell;
        } )
    };
};

export const isSurroundingHitCell = ( cellNum: BoardCell['cellNum'], attemptedCell: BoardCell['cellNum'] ) => {
    return cellNum === attemptedCell + 1
    || cellNum === attemptedCell - 1
    || cellNum === attemptedCell + 10
    || cellNum === attemptedCell - 10;
};

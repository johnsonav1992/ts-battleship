import {
    BoardCell
    , ComputerAI
    , GameState
} from '../types/types';

export const STARTING_PROBABILITY = 3;
export const SURROUNDING_HIT_PROBABILITY = 5;
export const IS_HIT_PROBABILITY = 6;
export const IS_MISS_PROBABILITY = 0;

export const buildStartingHeatMap = () => Array( 100 ).fill( null ).map( ( _, idx ) => ( {
    cellNum: idx + 1
    , heatValue: STARTING_PROBABILITY
} ) );

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
                    , heatValue: wasHit ? SURROUNDING_HIT_PROBABILITY : IS_MISS_PROBABILITY
                };
            } else if ( isSurroundingHitCell( cell.cellNum, attemptedCell ) && !state.computerAttemptedCells.includes( cell.cellNum ) ) {
                return {
                    ...cell
                    , heatValue: wasHit ? cell.heatValue + 1 : cell.heatValue - 1
                };
            }
            return cell;
        } )
        , targetingMode: true
    };
};

export const isSurroundingHitCell = ( cellNum: BoardCell['cellNum'], attemptedCell: BoardCell['cellNum'] ) => {
    return cellNum === attemptedCell + 1
    || cellNum === attemptedCell - 1
    || cellNum === attemptedCell + 10
    || cellNum === attemptedCell - 10;
};

export const findNextCellToFireOnAfterHit = ( state: GameState ) => {
    const prevHitCell = state.computerAI.lastShot.cellNum;

    const cellsAroundHitCell = state.computerAI.heatMapCells.filter(
        cell => isSurroundingHitCell( cell.cellNum, prevHitCell! )
                && cell.heatValue !== IS_HIT_PROBABILITY
                && cell.heatValue !== IS_MISS_PROBABILITY
    );

    const randomIndex = Math.floor( Math.random() * cellsAroundHitCell.length );
    return cellsAroundHitCell[ randomIndex ];
};

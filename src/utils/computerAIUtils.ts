import {
    BoardCell
    , ComputerAI
    , GameState
} from '../types/types';

export const STARTING_PROBABILITY = 3;
export const SURROUNDING_HIT_PROBABILITY = 10;
export const IS_HIT_PROBABILITY = 5;
export const IS_MISS_PROBABILITY = 0;

export const buildStartingHeatMap = () => Array( 100 ).fill( null ).map( ( _, idx ) => ( {
    cellNum: idx + 1
    , heatValue: STARTING_PROBABILITY
} ) );

export const updateComputerAI = ( state: GameState, attemptedCell: BoardCell['cellNum'], wasHit: boolean, wasShipJustSunk?: boolean ): ComputerAI => {
    return {
        lastShot: {
            cellNum: attemptedCell
            , wasHit
        }
        , sunkShip: wasShipJustSunk || false
        , heatMapCells: state.computerAI.heatMapCells.map( cell => {
            if ( cell.cellNum === attemptedCell ) {
                return {
                    ...cell
                    , heatValue: wasHit ? IS_HIT_PROBABILITY : IS_MISS_PROBABILITY
                };
            } else if ( isSurroundingHitCell( cell.cellNum, attemptedCell ) && !state.computerAttemptedCells.includes( cell.cellNum ) ) {
                return {
                    ...cell
                    , heatValue: wasHit ? SURROUNDING_HIT_PROBABILITY : cell.heatValue - 1
                };
            }
            return cell;
        } )
    };
};

export const isSurroundingHitCell = ( cellNum: BoardCell['cellNum'], attemptedCell: BoardCell['cellNum'] ) => {
    const attemptedRow = Math.ceil( attemptedCell / 10 );
    const attemptedColumn = ( attemptedCell - 1 ) % 10 + 1;

    const cellRow = Math.ceil( cellNum / 10 );
    const cellColumn = ( cellNum - 1 ) % 10 + 1;

    const isWithinHorizontal = Math.abs( attemptedColumn - cellColumn ) === 1 && attemptedRow === cellRow;
    const isWithinVertical = Math.abs( attemptedRow - cellRow ) === 1 && attemptedColumn === cellColumn;

    const isWithinBounds = cellNum >= 1 && cellNum <= 100;

    return isWithinBounds && ( isWithinHorizontal || isWithinVertical );
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

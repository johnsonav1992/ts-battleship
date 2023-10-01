import {
    BoardCell
    , ComputerAI
    , GameState
    , HeatMapCell
} from '../types/types';

export const STARTING_HIGH_PROBABILITY = 3;
export const STARTING_MID_PROBABILITY = 2;
export const STARTING_LOW_PROBABILITY = 1;
export const SURROUNDING_HIT_PROBABILITY = 10;
export const IS_SUNK_PROBABILITY = -1;
export const IS_HIT_PROBABILITY = 5;
export const IS_MISS_PROBABILITY = 0;

export const isInCenterGridOfBoard = ( cellNum: BoardCell['cellNum'] ) => {
    const boardSize = 10;
    const center = Math.floor( boardSize / 2 );
    const centerStart = center - 3;
    const centerEnd = center + 2;

    const row = Math.floor( ( cellNum - 1 ) / boardSize );
    const col = ( cellNum - 1 ) % boardSize;

    return (
        row >= centerStart
        && row <= centerEnd
        && col >= centerStart
        && col <= centerEnd
    );
};

export const isEvenCell = ( cellNum: BoardCell['cellNum'] ) => cellNum % 2 === 0;

export const buildStartingHeatMap = () => Array( 100 ).fill( null ).map( ( _, idx ) => {
    const cellNum = idx + 1;
    return {
        cellNum
        , heatValue: isEvenCell( cellNum )
            ? isInCenterGridOfBoard( cellNum )
                ? STARTING_HIGH_PROBABILITY
                : STARTING_MID_PROBABILITY
            : STARTING_LOW_PROBABILITY
    };
} );

export const updateComputerAI = ( state: GameState, attemptedCell: BoardCell['cellNum'], wasHit: boolean ): ComputerAI => {
    const isSurroundingHitCellAndNotAttempted = ( cell: HeatMapCell ) =>
        isSurroundingHitCell( cell.cellNum, attemptedCell )
        && !state.computerAttemptedCells.includes( cell.cellNum );

    const oldTargetStackMinusLastCell = state.computerAI.targetStack.slice( 0, -1 );

    const newTargetStack = [
        ...oldTargetStackMinusLastCell
        , ...( wasHit
            ? state.computerAI.heatMapCells
                .filter( cell => isSurroundingHitCellAndNotAttempted( cell ) )
                .map( cell => cell.cellNum )
            : [] )
    ];

    return {
        lastShot: {
            cellNum: attemptedCell
            , wasHit
        }
        , heatMapCells: state.computerAI.heatMapCells.map( cell => {
            if ( cell.cellNum === attemptedCell ) {
                return {
                    ...cell
                    , heatValue: wasHit
                        ? IS_HIT_PROBABILITY
                        : IS_MISS_PROBABILITY
                };
            } else if ( isSurroundingHitCellAndNotAttempted( cell ) ) {
                return {
                    ...cell
                    , heatValue: wasHit ? SURROUNDING_HIT_PROBABILITY : cell.heatValue - 1
                };
            }
            return cell;
        } )
        , targetStack: newTargetStack
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

export const findNextTargetedCell = ( state: GameState ) => {
    const targetStack = state.computerAI.targetStack;
    const lastTargetStackCell = targetStack[ targetStack.length - 1 ];
    return lastTargetStackCell;
};

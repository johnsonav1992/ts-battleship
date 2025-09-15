import {
    BoardCell
    , GameState
    , HeatMapCell
} from '../../types/types';
import { findProbabilityBasedTarget } from './mediumAIUtils';
import { getShipLength } from './generalAIUtils';

export const findConstraintBasedTarget = ( state: GameState ): BoardCell['cellNum'] | null => {
    if ( state.computerAI.huntingMode === 'targeting' && state.computerAI.currentTarget ) {
        return null;
    }

    const certainTarget = findCertainCellByElimination( state );
    if ( certainTarget ) return certainTarget;

    const overlapTarget = findOverlappingSquareTarget( state );
    if ( overlapTarget ) return overlapTarget;

    return findProbabilityBasedTarget( state );
};

export const findAdvancedTarget = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;

    if ( ai.currentTarget?.suspectedMultipleShips && ai.multipleTargets.length > 0 ) {
        const currentTargets = ai.currentTarget.potentialTargets.filter( cell =>
            !state.computerAttemptedCells.includes( cell )
        );

        if ( currentTargets.length > 0 ) {
            return currentTargets[ 0 ];
        }

        for ( const target of ai.multipleTargets ) {
            const availableTargets = target.potentialTargets.filter( cell =>
                !state.computerAttemptedCells.includes( cell )
            );
            if ( availableTargets.length > 0 ) {
                return availableTargets[ 0 ];
            }
        }
    }

    return null;
};

export const adjustHeatMapForEndgame = (
    heatMapCells: HeatMapCell[],
    remainingShips: { [key: string]: number },
    gameProgress: number
): HeatMapCell[] => {
    if ( gameProgress < 0.7 ) return heatMapCells;

    return heatMapCells.map( cell => {
        let adjustedHeat = cell.heatValue;

        const smallShipsRemaining = ( remainingShips.destroyer || 0 );
        if ( smallShipsRemaining > 0 && adjustedHeat > 0 ) {
            adjustedHeat *= 1.3;
        }

        return {
            ...cell
            , heatValue: adjustedHeat
        };
    } );
};

const findCertainCellByElimination = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;
    const remainingShips = Object.entries( ai.shipConstraints.remainingShips )
        .filter( ( [ , count ] ) => count > 0 );

    for ( const [ shipType, count ] of remainingShips ) {
        if ( count !== 1 ) continue;

        const length = getShipLength( shipType );
        const possiblePlacements = findAllPossiblePlacements( length, state );

        if ( possiblePlacements.length === 1 ) {
            const placement = possiblePlacements[ 0 ];
            for ( const cellNum of placement ) {
                if ( !state.computerAttemptedCells.includes( cellNum ) ) {
                    return cellNum;
                }
            }
        }
    }

    return null;
};

const findOverlappingSquareTarget = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;
    const remainingShips = Object.entries( ai.shipConstraints.remainingShips )
        .filter( ( [ , count ] ) => count > 0 )
        .map( ( [ ship ] ) => ship );

    if ( remainingShips.length === 0 ) return null;

    if ( remainingShips.length > 3 ) return null;

    const cellProbabilities = Array( 100 ).fill( 0 );

    for ( const shipType of remainingShips ) {
        const length = getShipLength( shipType );
        const possiblePlacements = findAllPossiblePlacements( length, state );

        if ( possiblePlacements.length === 0 ) continue;

        for ( const placement of possiblePlacements ) {
            for ( const cellNum of placement ) {
                cellProbabilities[ cellNum - 1 ] += 1 / possiblePlacements.length;
            }
        }
    }

    let bestCell = null;
    let bestProbability = 0;

    for ( let cellNum = 1; cellNum <= 100; cellNum++ ) {
        if ( state.computerAttemptedCells.includes( cellNum ) ) continue;

        const probability = cellProbabilities[ cellNum - 1 ];
        if ( probability > bestProbability && probability > 0.8 ) {
            bestProbability = probability;
            bestCell = cellNum;
        }
    }

    return bestCell;
};

const findAllPossiblePlacements = (
    length: number,
    state: GameState
): BoardCell['cellNum'][][] => {
    const placements: BoardCell['cellNum'][][] = [];
    const attemptedCells = state.computerAttemptedCells;
    const hitCells = state.playerCells.filter( c => c.status === 'hit' ).map( c => c.cellNum );

    for ( let row = 1; row <= 10; row++ ) {
        for ( let col = 1; col <= 10 - length + 1; col++ ) {
            const startCell = ( row - 1 ) * 10 + col;
            const shipCells = Array.from( { length }, ( _, i ) => startCell + i );

            if ( isValidShipPlacement( shipCells, attemptedCells, hitCells ) ) {
                placements.push( shipCells );
            }
        }
    }

    for ( let row = 1; row <= 10 - length + 1; row++ ) {
        for ( let col = 1; col <= 10; col++ ) {
            const startCell = ( row - 1 ) * 10 + col;
            const shipCells = Array.from( { length }, ( _, i ) => startCell + ( i * 10 ) );

            if ( isValidShipPlacement( shipCells, attemptedCells, hitCells ) ) {
                placements.push( shipCells );
            }
        }
    }

    return placements;
};

const isValidShipPlacement = (
    shipCells: BoardCell['cellNum'][],
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][]
): boolean => {
    return !shipCells.some( cell =>
        attemptedCells.includes( cell ) && !hitCells.includes( cell )
    );

};

import {
    BoardCell
    , GameState
} from '../../types/types';

export const findProbabilityBasedTarget = ( state: GameState ): BoardCell['cellNum'] | null => {
    if ( state.computerAI.huntingMode === 'targeting' && state.computerAI.currentTarget ) {
        return null;
    }

    const ai = state.computerAI;
    const remainingShips = Object.entries( ai.shipConstraints.remainingShips )
        .filter( ( [ _, count ] ) => count > 0 )
        .map( ( [ ship, _ ] ) => ship );

    if ( remainingShips.length === 0 ) return null;

    const shipLengths = remainingShips.map( ship => getShipLength( ship ) );
    const probabilityMap = calculateShipFitProbabilities(
        state.computerAttemptedCells,
        state.playerCells.filter( c => c.status === 'hit' ).map( c => c.cellNum ),
        shipLengths
    );

    const availableCells = probabilityMap.filter( cell =>
        !state.computerAttemptedCells.includes( cell.cellNum )
        && cell.probability > 0
    );

    if ( availableCells.length === 0 ) return null;

    const maxProbability = Math.max( ...availableCells.map( c => c.probability ) );
    const bestCells = availableCells.filter( c => c.probability === maxProbability );

    return bestCells[ Math.floor( Math.random() * bestCells.length ) ].cellNum;
};

const calculateShipFitProbabilities = (
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][],
    shipLengths: number[]
): Array<{cellNum: BoardCell['cellNum']; probability: number}> => {
    const probabilities = Array( 100 ).fill( 0 ).map( ( _, idx ) => ( {
        cellNum: idx + 1
        , probability: 0
    } ) );

    for ( const length of shipLengths ) {
        for ( let row = 1; row <= 10; row++ ) {
            for ( let col = 1; col <= 10 - length + 1; col++ ) {
                const startCell = ( row - 1 ) * 10 + col;
                const shipCells = Array.from( { length }, ( _, i ) => startCell + i );

                if ( isValidShipPlacement( shipCells, attemptedCells, hitCells ) ) {
                    for ( const cellNum of shipCells ) {
                        if ( !attemptedCells.includes( cellNum ) ) {
                            probabilities[ cellNum - 1 ].probability += 1;
                        }
                    }
                }
            }
        }

        for ( let row = 1; row <= 10 - length + 1; row++ ) {
            for ( let col = 1; col <= 10; col++ ) {
                const startCell = ( row - 1 ) * 10 + col;
                const shipCells = Array.from( { length }, ( _, i ) => startCell + ( i * 10 ) );

                if ( isValidShipPlacement( shipCells, attemptedCells, hitCells ) ) {
                    for ( const cellNum of shipCells ) {
                        if ( !attemptedCells.includes( cellNum ) ) {
                            probabilities[ cellNum - 1 ].probability += 1;
                        }
                    }
                }
            }
        }
    }

    return probabilities;
};

const isValidShipPlacement = (
    shipCells: BoardCell['cellNum'][],
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][]
): boolean => {
    const hasOverlapWithMisses = shipCells.some( cell =>
        attemptedCells.includes( cell ) && !hitCells.includes( cell )
    );

    return !hasOverlapWithMisses;
};

const getShipLength = ( shipType: string ): number => {
    const lengths: { [key: string]: number } = {
        destroyer: 2
        , submarine: 3
        , cruiser: 3
        , battleship: 4
        , carrier: 5
    };
    return lengths[ shipType ] || 2;
};

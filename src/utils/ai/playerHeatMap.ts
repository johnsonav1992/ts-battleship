import {
    BoardCell
    , GameState
    , HeatMapCell
} from '../../types/types';
import { getShipLength } from './generalAIUtils';

export const buildPlayerHeatMap = (
    computerCells: BoardCell[],
    computerShips: GameState['computerShips'],
    playerAttemptedCells: BoardCell['cellNum'][]
): HeatMapCell[] => {
    const remainingShips = computerShips.filter( ship => !ship.isSunk );

    if ( remainingShips.length === 0 ) {
        return Array( 100 ).fill( 0 ).map( ( _, idx ) => ( {
            cellNum: idx + 1
            , heatValue: 0
        } ) );
    }

    const probabilityMap = Array( 100 ).fill( 0 );
    const hitCells = computerCells.filter( cell => cell.status === 'hit' ).map( cell => cell.cellNum );

    for ( const ship of remainingShips ) {
        const shipLength = getShipLength( ship.id );

        for ( let cellNum = 1; cellNum <= 100; cellNum++ ) {
            if ( playerAttemptedCells.includes( cellNum ) ) continue;

            probabilityMap[ cellNum - 1 ] += countShipPlacementsIncluding(
                cellNum,
                shipLength,
                playerAttemptedCells,
                hitCells
            );
        }
    }

    return probabilityMap.map( ( heatValue, idx ) => ( {
        cellNum: idx + 1
        , heatValue: Math.max( heatValue, 0.1 )
    } ) );
};

const countShipPlacementsIncluding = (
    cellNum: BoardCell['cellNum'],
    shipLength: number,
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][]
): number => {
    let count = 0;
    const BASE_HIT_BONUS = 50;
    const CONSECUTIVE_BONUS = 100;

    for ( let startOffset = 0; startOffset < shipLength; startOffset++ ) {
        const horizontalStart = cellNum - startOffset;
        const verticalStart = cellNum - ( startOffset * 10 );

        if ( canPlaceShipHorizontally( horizontalStart, shipLength, attemptedCells, hitCells ) ) {
            const shipCells = Array.from( { length: shipLength }, ( _, i ) => horizontalStart + i );
            const hitIntersections = shipCells.filter( cell => hitCells.includes( cell ) );

            if ( hitIntersections.length > 0 ) {
                const consecutiveScore = calculateConsecutiveBonus( hitIntersections, 'horizontal' );
                count += BASE_HIT_BONUS * hitIntersections.length + consecutiveScore * CONSECUTIVE_BONUS;
            } else {
                count += 1;
            }
        }

        if ( canPlaceShipVertically( verticalStart, shipLength, attemptedCells, hitCells ) ) {
            const shipCells = Array.from( { length: shipLength }, ( _, i ) => verticalStart + ( i * 10 ) );
            const hitIntersections = shipCells.filter( cell => hitCells.includes( cell ) );

            if ( hitIntersections.length > 0 ) {
                const consecutiveScore = calculateConsecutiveBonus( hitIntersections, 'vertical' );
                count += BASE_HIT_BONUS * hitIntersections.length + consecutiveScore * CONSECUTIVE_BONUS;
            } else {
                count += 1;
            }
        }
    }

    return count;
};

const calculateConsecutiveBonus = ( hitCells: BoardCell['cellNum'][], direction: 'horizontal' | 'vertical' ): number => {
    if ( hitCells.length < 2 ) return 0;

    const sortedHits = [ ...hitCells ].sort( ( a, b ) => a - b );
    let maxConsecutive = 0;
    let currentConsecutive = 1;

    for ( let i = 1; i < sortedHits.length; i++ ) {
        const expectedDiff = direction === 'horizontal' ? 1 : 10;
        const actualDiff = sortedHits[ i ] - sortedHits[ i - 1 ];

        if ( actualDiff === expectedDiff ) {
            currentConsecutive++;
        } else {
            maxConsecutive = Math.max( maxConsecutive, currentConsecutive );
            currentConsecutive = 1;
        }
    }

    maxConsecutive = Math.max( maxConsecutive, currentConsecutive );
    return maxConsecutive >= 2 ? Math.pow( maxConsecutive, 2 ) : 0;
};

const canPlaceShipHorizontally = (
    startCell: BoardCell['cellNum'],
    shipLength: number,
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][]
): boolean => {
    if ( startCell < 1 ) return false;

    const startRow = Math.ceil( startCell / 10 );
    const startCol = ( ( startCell - 1 ) % 10 ) + 1;

    if ( startCol + shipLength - 1 > 10 ) return false;

    const shipCells = Array.from( { length: shipLength }, ( _, i ) => startCell + i );

    return shipCells.every( cell => {
        const cellRow = Math.ceil( cell / 10 );
        if ( cellRow !== startRow ) return false;

        if ( attemptedCells.includes( cell ) && !hitCells.includes( cell ) ) return false;

        return true;
    } );
};

const canPlaceShipVertically = (
    startCell: BoardCell['cellNum'],
    shipLength: number,
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][]
): boolean => {
    if ( startCell < 1 ) return false;

    const startRow = Math.ceil( startCell / 10 );
    const startCol = ( ( startCell - 1 ) % 10 ) + 1;

    if ( startRow + shipLength - 1 > 10 ) return false;

    const shipCells = Array.from( { length: shipLength }, ( _, i ) => startCell + ( i * 10 ) );

    return shipCells.every( cell => {
        if ( cell > 100 ) return false;

        const cellCol = ( ( cell - 1 ) % 10 ) + 1;
        if ( cellCol !== startCol ) return false;

        if ( attemptedCells.includes( cell ) && !hitCells.includes( cell ) ) return false;

        return true;
    } );
};

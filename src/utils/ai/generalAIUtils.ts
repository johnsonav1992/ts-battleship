import {
    BoardCell
    , ComputerAI
    , GameState
    , HeatMapCell
} from '../../types/types';

export const STARTING_HIGH_PROBABILITY = 3;
export const STARTING_MID_PROBABILITY = 2;
export const STARTING_LOW_PROBABILITY = 1;
export const SURROUNDING_HIT_PROBABILITY = 10;
export const IS_SUNK_PROBABILITY = -1;
export const IS_HIT_PROBABILITY = 5;
export const IS_MISS_PROBABILITY = 0;

export const isInCenterGridOfBoard = ( cellNum: BoardCell['cellNum'] ) => {
    const boardSize = 10;
    const centerPoint = Math.floor( boardSize / 2 );
    const centerStart = centerPoint - 3;
    const centerEnd = centerPoint + 2;

    const row = Math.floor( ( cellNum - 1 ) / boardSize );
    const col = ( cellNum - 1 ) % boardSize;

    return row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd;
};

export const isEvenCell = ( cellNum: BoardCell['cellNum'] ) => cellNum % 2 === 0;

export const canShipFitHorizontally = ( cellNum: BoardCell['cellNum'], shipLength: number ) => {
    const col = ( ( cellNum - 1 ) % 10 ) + 1;
    return col + shipLength - 1 <= 10;
};

export const canShipFitVertically = ( cellNum: BoardCell['cellNum'], shipLength: number ) => {
    const row = Math.ceil( cellNum / 10 );
    return row + shipLength - 1 <= 10;
};

export const buildStartingHeatMap = () => {
    const standardShipLengths = [ 2, 3, 3, 4, 5 ];
    const probabilityMap = Array( 100 ).fill( 0 );

    for ( let cellNum = 1; cellNum <= 100; cellNum++ ) {
        let shipPlacementCount = 0;

        for ( const shipLength of standardShipLengths ) {
            shipPlacementCount += countHorizontalPlacementsIncluding( cellNum, shipLength );
            shipPlacementCount += countVerticalPlacementsIncluding( cellNum, shipLength );
        }

        const centerBias = calculateCenterBias( cellNum );
        probabilityMap[ cellNum - 1 ] = shipPlacementCount + centerBias;
    }

    return normalizeHeatMap( probabilityMap );
};

export const updateComputerAI = ( state: GameState, attemptedCell: BoardCell['cellNum'], wasHit: boolean, shipSunk?: boolean ): ComputerAI => {
    const currentAI = state.computerAI;

    if ( !wasHit ) {
        return handleMissedShot( currentAI, attemptedCell, state.computerAttemptedCells );
    }

    const allHits = currentAI.currentTarget
        ? [ ...currentAI.currentTarget.hits, attemptedCell ]
        : [ attemptedCell ];

    if ( shipSunk ) {
        return handleSunkShip( currentAI, attemptedCell, allHits, state );
    }

    return handleSuccessfulHit( currentAI, attemptedCell, allHits, state );
};

export const isSurroundingHitCell = ( cellNum: BoardCell['cellNum'], attemptedCell: BoardCell['cellNum'] ) => {
    const attemptedRow = Math.ceil( attemptedCell / 10 );
    const attemptedColumn = ( attemptedCell - 1 ) % 10 + 1;

    const cellRow = Math.ceil( cellNum / 10 );
    const cellColumn = ( cellNum - 1 ) % 10 + 1;

    const isHorizontallyAdjacent = Math.abs( attemptedColumn - cellColumn ) === 1 && attemptedRow === cellRow;
    const isVerticallyAdjacent = Math.abs( attemptedRow - cellRow ) === 1 && attemptedColumn === cellColumn;
    const isWithinBounds = cellNum >= 1 && cellNum <= 100;

    return isWithinBounds && ( isHorizontallyAdjacent || isVerticallyAdjacent );
};

export const determineShipDirection = ( hits: BoardCell['cellNum'][] ): 'horizontal' | 'vertical' | 'unknown' => {
    if ( hits.length < 2 ) return 'unknown';

    const hitRows = hits.map( cell => Math.ceil( cell / 10 ) );
    const hitColumns = hits.map( cell => ( ( cell - 1 ) % 10 ) + 1 );

    const allInSameRow = hitRows.every( row => row === hitRows[ 0 ] );
    const allInSameColumn = hitColumns.every( col => col === hitColumns[ 0 ] );

    if ( allInSameRow ) return 'horizontal';
    if ( allInSameColumn ) return 'vertical';
    return 'unknown';
};

export const generateSmartTargets = (
    hits: BoardCell['cellNum'][],
    direction: 'horizontal' | 'vertical' | 'unknown',
    attemptedCells: BoardCell['cellNum'][]
): BoardCell['cellNum'][] => {
    if ( hits.length === 0 ) return [];

    if ( direction === 'unknown' ) {
        const firstHit = hits[ 0 ];
        return getAdjacentCells( firstHit ).filter( cell =>
            isValidCell( cell ) && !attemptedCells.includes( cell )
        );
    }

    const orderedHits = [ ...hits ].sort( ( a, b ) => a - b );
    const potentialTargets: BoardCell['cellNum'][] = [];

    if ( direction === 'horizontal' ) {
        const leftmostHit = orderedHits[ 0 ];
        const rightmostHit = orderedHits[ orderedHits.length - 1 ];
        const hitRow = Math.ceil( leftmostHit / 10 );

        const leftExtension = leftmostHit - 1;
        const rightExtension = rightmostHit + 1;

        if ( Math.ceil( leftExtension / 10 ) === hitRow && isValidCell( leftExtension ) ) {
            potentialTargets.push( leftExtension );
        }
        if ( Math.ceil( rightExtension / 10 ) === hitRow && isValidCell( rightExtension ) ) {
            potentialTargets.push( rightExtension );
        }
    } else if ( direction === 'vertical' ) {
        const topmostHit = orderedHits[ 0 ];
        const bottommostHit = orderedHits[ orderedHits.length - 1 ];

        const upwardExtension = topmostHit - 10;
        const downwardExtension = bottommostHit + 10;

        if ( isValidCell( upwardExtension ) ) potentialTargets.push( upwardExtension );
        if ( isValidCell( downwardExtension ) ) potentialTargets.push( downwardExtension );
    }

    return potentialTargets.filter( target => !attemptedCells.includes( target ) );
};

export const findBestHuntingTarget = (
    heatMapCells: HeatMapCell[],
    attemptedCells: BoardCell['cellNum'][]
): BoardCell['cellNum'] | null => {
    const availableCells = heatMapCells.filter( cell =>
        !attemptedCells.includes( cell.cellNum ) && cell.heatValue > IS_MISS_PROBABILITY
    );

    if ( availableCells.length === 0 ) {
        const fallbackCells = heatMapCells.filter( cell =>
            !attemptedCells.includes( cell.cellNum )
        );
        if ( fallbackCells.length === 0 ) return null;
        return fallbackCells[ Math.floor( Math.random() * fallbackCells.length ) ].cellNum;
    }

    const hasAnyHits = heatMapCells.some( cell => cell.heatValue === IS_HIT_PROBABILITY );
    if ( !hasAnyHits ) {
        const parityFiltered = availableCells.filter( cell => {
            const row = Math.ceil( cell.cellNum / 10 );
            const col = ( ( cell.cellNum - 1 ) % 10 ) + 1;
            return ( row + col ) % 2 === 0;
        } );

        if ( parityFiltered.length > 0 ) {
            const totalWeight = parityFiltered.reduce( ( sum, cell ) => sum + Math.max( cell.heatValue, 0.1 ), 0 );
            let randomWeight = Math.random() * totalWeight;

            for ( const cell of parityFiltered ) {
                randomWeight -= Math.max( cell.heatValue, 0.1 );
                if ( randomWeight <= 0 ) {
                    return cell.cellNum;
                }
            }
            return parityFiltered[ 0 ].cellNum;
        }
    }

    const totalWeight = availableCells.reduce( ( sum, cell ) => sum + Math.max( cell.heatValue, 0.1 ), 0 );
    let randomWeight = Math.random() * totalWeight;

    for ( const cell of availableCells ) {
        randomWeight -= Math.max( cell.heatValue, 0.1 );
        if ( randomWeight <= 0 ) {
            return cell.cellNum;
        }
    }

    return availableCells[ 0 ].cellNum;
};

export const findBestDirectionalTarget = (
    hits: BoardCell['cellNum'][],
    direction: 'horizontal' | 'vertical',
    availableTargets: BoardCell['cellNum'][]
): BoardCell['cellNum'] => {
    const sortedHits = [ ...hits ].sort( ( a, b ) => a - b );

    if ( direction === 'horizontal' ) {
        const leftmost = sortedHits[ 0 ] - 1;
        const rightmost = sortedHits[ sortedHits.length - 1 ] + 1;

        if ( availableTargets.includes( leftmost ) ) return leftmost;
        if ( availableTargets.includes( rightmost ) ) return rightmost;
    } else if ( direction === 'vertical' ) {
        const topmost = sortedHits[ 0 ] - 10;
        const bottommost = sortedHits[ sortedHits.length - 1 ] + 10;

        if ( availableTargets.includes( topmost ) ) return topmost;
        if ( availableTargets.includes( bottommost ) ) return bottommost;
    }

    return availableTargets[ 0 ];
};

const countHorizontalPlacementsIncluding = ( cellNum: number, shipLength: number ) => {
    const startPositions = Array.from(
        { length: shipLength },
        ( _, i ) => cellNum - i
    ).filter( pos => pos >= 1 && canShipFitHorizontally( pos, shipLength ) && pos + shipLength - 1 >= cellNum );

    return startPositions.length;
};

const countVerticalPlacementsIncluding = ( cellNum: number, shipLength: number ) => {
    const startPositions = Array.from(
        { length: shipLength },
        ( _, i ) => cellNum - ( i * 10 )
    ).filter( pos => pos >= 1 && canShipFitVertically( pos, shipLength ) && pos + ( shipLength - 1 ) * 10 >= cellNum );

    return startPositions.length;
};

const calculateCenterBias = ( cellNum: number ) => {
    const row = Math.ceil( cellNum / 10 );
    const col = ( ( cellNum - 1 ) % 10 ) + 1;
    const distanceFromCenter = Math.abs( row - 5.5 ) + Math.abs( col - 5.5 );
    return Math.max( 0, 4 - distanceFromCenter ) * 0.1;
};

const normalizeHeatMap = ( probabilityMap: number[] ): HeatMapCell[] => {
    const maxProbability = Math.max( ...probabilityMap );
    const minProbability = Math.min( ...probabilityMap );
    const probabilityRange = maxProbability - minProbability;

    return Array( 100 ).fill( null ).map( ( _, idx ) => {
        const cellNum = idx + 1;
        const normalizedHeat = probabilityRange > 0
            ? 1 + ( ( probabilityMap[ idx ] - minProbability ) / probabilityRange ) * 2
            : 2;

        return {
            cellNum
            , heatValue: Math.round( normalizedHeat * 10 ) / 10
        };
    } );
};

const handleMissedShot = ( currentAI: ComputerAI, attemptedCell: number, computerAttemptedCells: number[] ): ComputerAI => {
    const updatedHeatMap = updateHeatMapForMiss( currentAI.heatMapCells, attemptedCell );

    if ( currentAI.currentTarget && currentAI.currentTarget.hits.length > 0 ) {
        const remainingTargets = currentAI.currentTarget.potentialTargets.filter(
            target => target !== attemptedCell && !computerAttemptedCells.includes( target )
        );

        return {
            ...currentAI
            , lastShot: {
                cellNum: attemptedCell
                , wasHit: false
            }
            , currentTarget: {
                ...currentAI.currentTarget
                , potentialTargets: remainingTargets
            }
            , targetStack: remainingTargets
            , heatMapCells: updatedHeatMap
        };
    }

    return {
        ...currentAI
        , lastShot: {
            cellNum: attemptedCell
            , wasHit: false
        }
        , heatMapCells: updatedHeatMap
    };
};

const handleSunkShip = ( currentAI: ComputerAI, attemptedCell: number, allHits: number[], state: GameState ): ComputerAI => {
    const sunkShip = findSunkShip( state, attemptedCell );
    const updatedConstraints = updateShipConstraints( currentAI.shipConstraints, sunkShip );

    return {
        ...currentAI
        , lastShot: {
            cellNum: attemptedCell
            , wasHit: true
        }
        , huntingMode: 'hunting' as const
        , currentTarget: null
        , targetStack: []
        , shipConstraints: updatedConstraints
        , heatMapCells: updateHeatMapAfterSink( currentAI.heatMapCells, allHits, attemptedCell )
    };
};

const handleSuccessfulHit = ( currentAI: ComputerAI, attemptedCell: number, allHits: number[], state: GameState ): ComputerAI => {
    const shipDirection = determineShipDirection( allHits );
    const nextTargets = generateSmartTargets( allHits, shipDirection, [ ...state.computerAttemptedCells, attemptedCell ] );

    return {
        ...currentAI
        , lastShot: {
            cellNum: attemptedCell
            , wasHit: true
        }
        , huntingMode: 'targeting' as const
        , currentTarget: {
            hits: allHits
            , direction: shipDirection
            , potentialTargets: nextTargets
            , possibleShipLengths: calculatePossibleShipLengths( allHits, state )
            , suspectedMultipleShips: detectMultipleShips( allHits, shipDirection )
        }
        , targetStack: nextTargets
        , heatMapCells: updateHeatMapForHit( currentAI.heatMapCells, attemptedCell )
    };
};

const findSunkShip = ( state: GameState, attemptedCell: number ) => {
    return state.playerShips.find( ship =>
        ship.isSunk && state.playerCells.some( cell =>
            cell.cellNum === attemptedCell && cell.shipImg?.label.startsWith( ship.id )
        )
    );
};

const updateShipConstraints = ( constraints: ComputerAI['shipConstraints'], sunkShip: any ) => {
    if ( !sunkShip ) return constraints;

    return {
        ...constraints
        , remainingShips: {
            ...constraints.remainingShips
            , [ sunkShip.id ]: Math.max( 0, constraints.remainingShips[ sunkShip.id ] - 1 )
        }
    };
};

const updateHeatMapForMiss = ( heatMapCells: HeatMapCell[], attemptedCell: number ) => {
    return heatMapCells.map( cell =>
        cell.cellNum === attemptedCell
            ? {
                ...cell
                , heatValue: IS_MISS_PROBABILITY
            }
            : cell
    );
};

const updateHeatMapForHit = ( heatMapCells: HeatMapCell[], attemptedCell: number ) => {
    return heatMapCells.map( cell =>
        cell.cellNum === attemptedCell
            ? {
                ...cell
                , heatValue: IS_HIT_PROBABILITY
            }
            : cell
    );
};

const updateHeatMapAfterSink = (
    heatMapCells: HeatMapCell[],
    sunkShipCells: BoardCell['cellNum'][],
    lastHit: BoardCell['cellNum']
): HeatMapCell[] => {
    return heatMapCells.map( cell => {
        if ( cell.cellNum === lastHit ) {
            return {
                ...cell
                , heatValue: IS_SUNK_PROBABILITY
            };
        }

        if ( sunkShipCells.includes( cell.cellNum ) ) {
            return {
                ...cell
                , heatValue: IS_SUNK_PROBABILITY
            };
        }

        const isAdjacentToSunkShip = sunkShipCells.some( sunkCell =>
            isSurroundingHitCell( cell.cellNum, sunkCell )
        );

        if ( isAdjacentToSunkShip ) {
            return {
                ...cell
                , heatValue: Math.max( 0, cell.heatValue - 2 )
            };
        }

        return cell;
    } );
};

const getAdjacentCells = ( cellNum: BoardCell['cellNum'] ): BoardCell['cellNum'][] => {
    const row = Math.ceil( cellNum / 10 );
    const col = ( ( cellNum - 1 ) % 10 ) + 1;

    const adjacentCells: BoardCell['cellNum'][] = [];

    if ( col > 1 ) adjacentCells.push( cellNum - 1 );
    if ( col < 10 ) adjacentCells.push( cellNum + 1 );
    if ( row > 1 ) adjacentCells.push( cellNum - 10 );
    if ( row < 10 ) adjacentCells.push( cellNum + 10 );

    return adjacentCells;
};

const isValidCell = ( cellNum: number ) => cellNum >= 1 && cellNum <= 100;

const detectMultipleShips = ( hits: BoardCell['cellNum'][], direction: 'horizontal' | 'vertical' | 'unknown' ): boolean => {
    if ( hits.length < 3 ) return false;

    if ( direction === 'horizontal' ) {
        const sortedHits = [ ...hits ].sort( ( a, b ) => a - b );
        for ( let i = 1; i < sortedHits.length; i++ ) {
            if ( sortedHits[ i ] - sortedHits[ i - 1 ] > 1 ) {
                return true;
            }
        }
    } else if ( direction === 'vertical' ) {
        const sortedHits = [ ...hits ].sort( ( a, b ) => a - b );
        for ( let i = 1; i < sortedHits.length; i++ ) {
            if ( sortedHits[ i ] - sortedHits[ i - 1 ] > 10 ) {
                return true;
            }
        }
    }

    return false;
};

const calculatePossibleShipLengths = ( hits: BoardCell['cellNum'][], state: GameState ): number[] => {
    const remainingShips = Object.entries( state.computerAI.shipConstraints.remainingShips )
        .filter( ( [ _, count ] ) => count > 0 )
        .map( ( [ ship, _ ] ) => getShipLength( ship ) );

    return remainingShips.filter( length => length >= hits.length );
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

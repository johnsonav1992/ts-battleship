import {
    BoardCell
    , ComputerAI
    , GameState
    , HeatMapCell
} from '../../types/types';

export const IS_MISS_PROBABILITY = 0;

export const canShipFitHorizontally = ( cellNum: BoardCell['cellNum'], shipLength: number ) => {
    const col = ( ( cellNum - 1 ) % 10 ) + 1;
    return col + shipLength - 1 <= 10;
};

export const canShipFitVertically = ( cellNum: BoardCell['cellNum'], shipLength: number ) => {
    const row = Math.ceil( cellNum / 10 );
    return row + shipLength - 1 <= 10;
};

export const buildDynamicHeatMap = (
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][],
    remainingShips: { [key: string]: number }
) => {
    const shipLengths = Object.entries( remainingShips )
        .filter( ( [ , count ] ) => count > 0 )
        .flatMap( ( [ ship, count ] ) => Array( count ).fill( getShipLength( ship ) ) );

    if ( shipLengths.length === 0 ) {
        return Array( 100 ).fill( 0 ).map( ( _, idx ) => ( {
            cellNum: idx + 1
            , heatValue: 0
        } ) );
    }

    const probabilityMap = Array( 100 ).fill( 0 );

    for ( const shipLength of shipLengths ) {
        for ( let cellNum = 1; cellNum <= 100; cellNum++ ) {
            if ( attemptedCells.includes( cellNum ) ) continue;

            probabilityMap[ cellNum - 1 ] += countShipPlacementsIncluding(
                cellNum,
                shipLength,
                attemptedCells,
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
    const HIT_BONUS_MULTIPLIER = 50;

    for ( let startOffset = 0; startOffset < shipLength; startOffset++ ) {
        const horizontalStart = cellNum - startOffset;
        const verticalStart = cellNum - ( startOffset * 10 );

        if ( canPlaceShipHorizontally( horizontalStart, shipLength, attemptedCells, hitCells ) ) {
            const shipCells = Array.from( { length: shipLength }, ( _, i ) => horizontalStart + i );
            const hitIntersections = shipCells.filter( cell => hitCells.includes( cell ) );

            if ( hitIntersections.length > 0 ) {
                count += HIT_BONUS_MULTIPLIER;
            } else {
                count += 1;
            }
        }

        if ( canPlaceShipVertically( verticalStart, shipLength, attemptedCells, hitCells ) ) {
            const shipCells = Array.from( { length: shipLength }, ( _, i ) => verticalStart + ( i * 10 ) );
            const hitIntersections = shipCells.filter( cell => hitCells.includes( cell ) );

            if ( hitIntersections.length > 0 ) {
                count += HIT_BONUS_MULTIPLIER;
            } else {
                count += 1;
            }
        }
    }

    return count;
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

    const hitCells = state.playerCells
        .filter( cell => cell.status === 'hit' )
        .map( cell => cell.cellNum );

    const allHitCells = wasHit ? [ ...hitCells, attemptedCell ] : hitCells;

    const updatedHeatMap = buildDynamicHeatMap(
        [ ...state.computerAttemptedCells, attemptedCell ],
        allHitCells,
        currentAI.shipConstraints.remainingShips
    );

    if ( !wasHit ) {
        return {
            ...handleMissedShot( currentAI, attemptedCell, state.computerAttemptedCells )
            , heatMapCells: updatedHeatMap
        };
    }

    const allHits = currentAI.currentTarget
        ? [ ...currentAI.currentTarget.hits, attemptedCell ]
        : [ attemptedCell ];

    if ( shipSunk ) {
        return {
            ...handleSunkShip( currentAI, attemptedCell, allHits, state )
            , heatMapCells: updatedHeatMap
        };
    }

    return {
        ...handleSuccessfulHit( currentAI, attemptedCell, allHits, state )
        , heatMapCells: updatedHeatMap
    };
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

    const hasAnyHits = heatMapCells.some( cell => cell.heatValue > 50 );
    if ( !hasAnyHits ) {
        const parityFiltered = availableCells.filter( cell => {
            const row = Math.ceil( cell.cellNum / 10 );
            const col = ( ( cell.cellNum - 1 ) % 10 ) + 1;
            return ( row + col ) % 2 === 0;
        } );

        if ( parityFiltered.length > 0 ) {
            const maxHeatValue = Math.max( ...parityFiltered.map( cell => cell.heatValue ) );
            const bestCells = parityFiltered.filter( cell => cell.heatValue === maxHeatValue );
            return bestCells[ Math.floor( Math.random() * bestCells.length ) ].cellNum;
        }
    }

    const maxHeatValue = Math.max( ...availableCells.map( cell => cell.heatValue ) );
    const bestCells = availableCells.filter( cell => cell.heatValue === maxHeatValue );
    return bestCells[ Math.floor( Math.random() * bestCells.length ) ].cellNum;
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

    if ( currentAI.currentTarget && currentAI.currentTarget.hits.length > 0 ) {
        const remainingTargets = currentAI.currentTarget.potentialTargets.filter(
            target => target !== attemptedCell && !computerAttemptedCells.includes( target )
        );

        if ( currentAI.currentTarget.direction !== 'unknown' && currentAI.currentTarget.hits.length >= 2 ) {
            const separation = detectShipSeparation(
                currentAI.currentTarget.hits,
                attemptedCell,
                currentAI.currentTarget.direction
            );

            if ( separation ) {
                const segment1Targets = generateSmartTargets(
                    separation.segment1,
                    currentAI.currentTarget.direction,
                    [ ...computerAttemptedCells, attemptedCell ]
                );
                const segment2Targets = generateSmartTargets(
                    separation.segment2,
                    currentAI.currentTarget.direction,
                    [ ...computerAttemptedCells, attemptedCell ]
                );

                const primarySegment = separation.segment1.length >= separation.segment2.length ? separation.segment1 : separation.segment2;
                const secondarySegment = separation.segment1.length >= separation.segment2.length ? separation.segment2 : separation.segment1;
                const primaryTargets = separation.segment1.length >= separation.segment2.length ? segment1Targets : segment2Targets;
                const secondaryTargets = separation.segment1.length >= separation.segment2.length ? segment2Targets : segment1Targets;

                return {
                    ...currentAI
                    , lastShot: {
                        cellNum: attemptedCell
                        , wasHit: false
                    }
                    , currentTarget: {
                        hits: primarySegment
                        , direction: currentAI.currentTarget.direction
                        , potentialTargets: primaryTargets
                        , possibleShipLengths: calculatePossibleShipLengths( primarySegment, {
                            computerAttemptedCells: [ ...computerAttemptedCells, attemptedCell ]
                        } as GameState )
                        , suspectedMultipleShips: true
                    }
                    , multipleTargets: [
                        ...currentAI.multipleTargets
                        , {
                            hits: secondarySegment
                            , direction: currentAI.currentTarget.direction
                            , potentialTargets: secondaryTargets
                            , possibleShipLengths: calculatePossibleShipLengths( secondarySegment, {
                                computerAttemptedCells: [ ...computerAttemptedCells, attemptedCell ]
                            } as GameState )
                        }
                    ]
                };
            }
        }

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
        };
    }

    return {
        ...currentAI
        , lastShot: {
            cellNum: attemptedCell
            , wasHit: false
        }
        , huntingMode: 'hunting' as const
        , currentTarget: null
        , targetStack: []
    };
};

const handleSunkShip = ( currentAI: ComputerAI, attemptedCell: number, _allHits: number[], state: GameState ): ComputerAI => {
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

export const detectShipSeparation = (
    hits: BoardCell['cellNum'][],
    missedCell: BoardCell['cellNum'],
    direction: 'horizontal' | 'vertical'
): { segment1: BoardCell['cellNum'][]; segment2: BoardCell['cellNum'][] } | null => {
    const sortedHits = [ ...hits ].sort( ( a, b ) => a - b );

    if ( direction === 'horizontal' ) {
        const missRow = Math.ceil( missedCell / 10 );
        const hitRow = Math.ceil( sortedHits[ 0 ] / 10 );
        if ( missRow !== hitRow ) return null;

        const segment1 = sortedHits.filter( hit => hit < missedCell );
        const segment2 = sortedHits.filter( hit => hit > missedCell );

        if ( segment1.length > 0 && segment2.length > 0 ) {
            return {
                segment1
                , segment2
            };
        }
    } else if ( direction === 'vertical' ) {
        const missCol = ( ( missedCell - 1 ) % 10 ) + 1;
        const hitCol = ( ( sortedHits[ 0 ] - 1 ) % 10 ) + 1;
        if ( missCol !== hitCol ) return null;

        const segment1 = sortedHits.filter( hit => hit < missedCell );
        const segment2 = sortedHits.filter( hit => hit > missedCell );

        if ( segment1.length > 0 && segment2.length > 0 ) {
            return {
                segment1
                , segment2
            };
        }
    }

    return null;
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
        .filter( ( [ , count ] ) => count > 0 )
        .map( ( [ ship ] ) => getShipLength( ship ) );

    return remainingShips.filter( length => length >= hits.length );
};

export const getShipLength = ( shipType: string ): number => {
    const lengths: { [key: string]: number } = {
        destroyer: 2
        , submarine: 3
        , cruiser: 3
        , battleship: 4
        , carrier: 5
    };
    return lengths[ shipType ] || 2;
};

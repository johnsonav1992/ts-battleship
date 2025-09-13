import {
    BoardCell,
    ComputerAI,
    GameState,
    HeatMapCell
} from '../types/types';

export const STARTING_HIGH_PROBABILITY = 3;
export const STARTING_MID_PROBABILITY = 2;
export const STARTING_LOW_PROBABILITY = 1;
export const SURROUNDING_HIT_PROBABILITY = 10;
export const IS_SUNK_PROBABILITY = -1;
export const IS_HIT_PROBABILITY = 5;
export const IS_MISS_PROBABILITY = 0;

export const isInCenterGridOfBoard = (cellNum: BoardCell['cellNum']) => {
    const boardSize = 10;
    const centerPoint = Math.floor(boardSize / 2);
    const centerStart = centerPoint - 3;
    const centerEnd = centerPoint + 2;

    const row = Math.floor((cellNum - 1) / boardSize);
    const col = (cellNum - 1) % boardSize;

    return row >= centerStart && row <= centerEnd && col >= centerStart && col <= centerEnd;
};

export const isEvenCell = (cellNum: BoardCell['cellNum']) => cellNum % 2 === 0;

const canShipFitHorizontally = (cellNum: BoardCell['cellNum'], shipLength: number) => {
    const col = ((cellNum - 1) % 10) + 1;
    return col + shipLength - 1 <= 10;
};

const canShipFitVertically = (cellNum: BoardCell['cellNum'], shipLength: number) => {
    const row = Math.ceil(cellNum / 10);
    return row + shipLength - 1 <= 10;
};

export const buildStartingHeatMap = () => {
    const standardShipLengths = [2, 3, 3, 4, 5];
    const probabilityMap = Array(100).fill(0);

    for (let cellNum = 1; cellNum <= 100; cellNum++) {
        let shipPlacementCount = 0;

        for (const shipLength of standardShipLengths) {
            shipPlacementCount += countHorizontalPlacementsIncluding(cellNum, shipLength);
            shipPlacementCount += countVerticalPlacementsIncluding(cellNum, shipLength);
        }

        const centerBias = calculateCenterBias(cellNum);
        probabilityMap[cellNum - 1] = shipPlacementCount + centerBias;
    }

    return normalizeHeatMap(probabilityMap);
};

const countHorizontalPlacementsIncluding = (cellNum: number, shipLength: number) => {
    const startPositions = Array.from(
        {length: shipLength},
        (_, i) => cellNum - i
    ).filter(pos => pos >= 1 && canShipFitHorizontally(pos, shipLength) && pos + shipLength - 1 >= cellNum);

    return startPositions.length;
};

const countVerticalPlacementsIncluding = (cellNum: number, shipLength: number) => {
    const startPositions = Array.from(
        {length: shipLength},
        (_, i) => cellNum - (i * 10)
    ).filter(pos => pos >= 1 && canShipFitVertically(pos, shipLength) && pos + (shipLength - 1) * 10 >= cellNum);

    return startPositions.length;
};

const calculateCenterBias = (cellNum: number) => {
    const row = Math.ceil(cellNum / 10);
    const col = ((cellNum - 1) % 10) + 1;
    const distanceFromCenter = Math.abs(row - 5.5) + Math.abs(col - 5.5);
    return Math.max(0, 4 - distanceFromCenter) * 0.1;
};

const normalizeHeatMap = (probabilityMap: number[]): HeatMapCell[] => {
    const maxProbability = Math.max(...probabilityMap);
    const minProbability = Math.min(...probabilityMap);
    const probabilityRange = maxProbability - minProbability;

    return Array(100).fill(null).map((_, idx) => {
        const cellNum = idx + 1;
        const normalizedHeat = probabilityRange > 0
            ? 1 + ((probabilityMap[idx] - minProbability) / probabilityRange) * 2
            : 2;

        return {
            cellNum,
            heatValue: Math.round(normalizedHeat * 10) / 10
        };
    });
};

export const updateComputerAI = (state: GameState, attemptedCell: BoardCell['cellNum'], wasHit: boolean, shipSunk?: boolean): ComputerAI => {
    const currentAI = state.computerAI;

    if (!wasHit) {
        return handleMissedShot(currentAI, attemptedCell, state.computerAttemptedCells);
    }

    const allHits = currentAI.currentTarget
        ? [...currentAI.currentTarget.hits, attemptedCell]
        : [attemptedCell];

    if (shipSunk) {
        return handleSunkShip(currentAI, attemptedCell, allHits, state);
    }

    return handleSuccessfulHit(currentAI, attemptedCell, allHits, state);
};

const handleMissedShot = (currentAI: ComputerAI, attemptedCell: number, computerAttemptedCells: number[]): ComputerAI => {
    const updatedHeatMap = updateHeatMapForMiss(currentAI.heatMapCells, attemptedCell);

    if (currentAI.currentTarget && currentAI.currentTarget.hits.length > 0) {
        const remainingTargets = currentAI.currentTarget.potentialTargets.filter(
            target => target !== attemptedCell && !computerAttemptedCells.includes(target)
        );

        return {
            ...currentAI,
            lastShot: { cellNum: attemptedCell, wasHit: false },
            currentTarget: { ...currentAI.currentTarget, potentialTargets: remainingTargets },
            targetStack: remainingTargets,
            heatMapCells: updatedHeatMap
        };
    }

    return {
        ...currentAI,
        lastShot: { cellNum: attemptedCell, wasHit: false },
        heatMapCells: updatedHeatMap
    };
};

const handleSunkShip = (currentAI: ComputerAI, attemptedCell: number, allHits: number[], state: GameState): ComputerAI => {
    const sunkShip = findSunkShip(state, attemptedCell);
    const updatedConstraints = updateShipConstraints(currentAI.shipConstraints, sunkShip);

    return {
        ...currentAI,
        lastShot: { cellNum: attemptedCell, wasHit: true },
        huntingMode: 'hunting' as const,
        currentTarget: null,
        targetStack: [],
        shipConstraints: updatedConstraints,
        heatMapCells: updateHeatMapAfterSink(currentAI.heatMapCells, allHits, attemptedCell)
    };
};

const handleSuccessfulHit = (currentAI: ComputerAI, attemptedCell: number, allHits: number[], state: GameState): ComputerAI => {
    const shipDirection = determineShipDirection(allHits);
    const nextTargets = generateSmartTargets(allHits, shipDirection, [...state.computerAttemptedCells, attemptedCell]);

    return {
        ...currentAI,
        lastShot: { cellNum: attemptedCell, wasHit: true },
        huntingMode: 'targeting' as const,
        currentTarget: {
            hits: allHits,
            direction: shipDirection,
            potentialTargets: nextTargets,
            possibleShipLengths: calculatePossibleShipLengths(allHits, state),
            suspectedMultipleShips: detectMultipleShips(allHits, shipDirection)
        },
        targetStack: nextTargets,
        heatMapCells: updateHeatMapForHit(currentAI.heatMapCells, attemptedCell)
    };
};

const findSunkShip = (state: GameState, attemptedCell: number) => {
    return state.playerShips.find(ship =>
        ship.isSunk && state.playerCells.some(cell =>
            cell.cellNum === attemptedCell && cell.shipImg?.label.startsWith(ship.id)
        )
    );
};

const updateShipConstraints = (constraints: ComputerAI['shipConstraints'], sunkShip: any) => {
    if (!sunkShip) return constraints;

    return {
        ...constraints,
        remainingShips: {
            ...constraints.remainingShips,
            [sunkShip.id]: Math.max(0, constraints.remainingShips[sunkShip.id] - 1)
        }
    };
};

const updateHeatMapForMiss = (heatMapCells: HeatMapCell[], attemptedCell: number) => {
    return heatMapCells.map(cell =>
        cell.cellNum === attemptedCell
            ? { ...cell, heatValue: IS_MISS_PROBABILITY }
            : cell
    );
};

const updateHeatMapForHit = (heatMapCells: HeatMapCell[], attemptedCell: number) => {
    return heatMapCells.map(cell =>
        cell.cellNum === attemptedCell
            ? { ...cell, heatValue: IS_HIT_PROBABILITY }
            : cell
    );
};

export const isSurroundingHitCell = (cellNum: BoardCell['cellNum'], attemptedCell: BoardCell['cellNum']) => {
    const attemptedRow = Math.ceil(attemptedCell / 10);
    const attemptedColumn = (attemptedCell - 1) % 10 + 1;

    const cellRow = Math.ceil(cellNum / 10);
    const cellColumn = (cellNum - 1) % 10 + 1;

    const isHorizontallyAdjacent = Math.abs(attemptedColumn - cellColumn) === 1 && attemptedRow === cellRow;
    const isVerticallyAdjacent = Math.abs(attemptedRow - cellRow) === 1 && attemptedColumn === cellColumn;
    const isWithinBounds = cellNum >= 1 && cellNum <= 100;

    return isWithinBounds && (isHorizontallyAdjacent || isVerticallyAdjacent);
};

export const findNextTargetedCell = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;


    // Check for advanced multi-ship targeting first
    const advancedTarget = findAdvancedTarget(state);
    if (advancedTarget) return advancedTarget;

    // Advanced difficulty uses constraint-based reasoning
    if (ai.difficulty === 'hard') {
        const constraintTarget = findConstraintBasedTarget(state);
        if (constraintTarget) {
            return constraintTarget;
        }
    }

    // Medium difficulty uses improved probability calculations
    if (ai.difficulty === 'medium') {
        const probabilityTarget = findProbabilityBasedTarget(state);
        if (probabilityTarget) {
            return probabilityTarget;
        }
    }

    if (ai.huntingMode === 'hunting' || !ai.currentTarget) {
        // Apply endgame optimization to heat map
        const gameProgress = state.computerAttemptedCells.length / 100;
        const optimizedHeatMap = adjustHeatMapForEndgame(
            ai.heatMapCells,
            ai.shipConstraints.remainingShips,
            gameProgress
        );
        return findBestHuntingTarget(optimizedHeatMap, state.computerAttemptedCells);
    }

    const { hits, direction, potentialTargets } = ai.currentTarget;
    const availableTargets = potentialTargets.filter(cell =>
        !state.computerAttemptedCells.includes(cell)
    );


    if (availableTargets.length === 0) {
        return findBestHuntingTarget(ai.heatMapCells, state.computerAttemptedCells);
    }

    if (direction === 'unknown' && hits.length === 1) {
        return availableTargets[0];
    }

    if (direction !== 'unknown') {
        return findBestDirectionalTarget(hits, direction, availableTargets);
    }

    return availableTargets[0];
};

const determineShipDirection = (hits: BoardCell['cellNum'][]): 'horizontal' | 'vertical' | 'unknown' => {
    if (hits.length < 2) return 'unknown';

    const rows = hits.map(cell => Math.ceil(cell / 10));
    const cols = hits.map(cell => ((cell - 1) % 10) + 1);

    const sameRow = rows.every(row => row === rows[0]);
    const sameCol = cols.every(col => col === cols[0]);

    if (sameRow) return 'horizontal';
    if (sameCol) return 'vertical';
    return 'unknown';
};

const generateSmartTargets = (
    hits: BoardCell['cellNum'][],
    direction: 'horizontal' | 'vertical' | 'unknown',
    attemptedCells: BoardCell['cellNum'][]
): BoardCell['cellNum'][] => {
    if (hits.length === 0) return [];

    if (direction === 'unknown') {
        const cell = hits[0];
        return getAdjacentCells(cell).filter(c =>
            isValidCell(c) && !attemptedCells.includes(c)
        );
    }

    const sortedHits = [...hits].sort((a, b) => a - b);
    const targets: BoardCell['cellNum'][] = [];

    if (direction === 'horizontal') {
        const minCell = sortedHits[0];
        const maxCell = sortedHits[sortedHits.length - 1];
        const row = Math.ceil(minCell / 10);

        const leftTarget = minCell - 1;
        const rightTarget = maxCell + 1;

        if (Math.ceil(leftTarget / 10) === row && isValidCell(leftTarget)) {
            targets.push(leftTarget);
        }
        if (Math.ceil(rightTarget / 10) === row && isValidCell(rightTarget)) {
            targets.push(rightTarget);
        }
    } else if (direction === 'vertical') {
        const minCell = sortedHits[0];
        const maxCell = sortedHits[sortedHits.length - 1];

        const topTarget = minCell - 10;
        const bottomTarget = maxCell + 10;

        if (isValidCell(topTarget)) targets.push(topTarget);
        if (isValidCell(bottomTarget)) targets.push(bottomTarget);
    }

    return targets.filter(c => !attemptedCells.includes(c));
};

const getAdjacentCells = (cellNum: BoardCell['cellNum']): BoardCell['cellNum'][] => {
    const row = Math.ceil(cellNum / 10);
    const col = ((cellNum - 1) % 10) + 1;

    const adjacent: BoardCell['cellNum'][] = [];

    if (col > 1) adjacent.push(cellNum - 1);
    if (col < 10) adjacent.push(cellNum + 1);
    if (row > 1) adjacent.push(cellNum - 10);
    if (row < 10) adjacent.push(cellNum + 10);

    return adjacent;
};

const isValidCell = (cellNum: number): boolean => {
    return cellNum >= 1 && cellNum <= 100;
};

const findBestHuntingTarget = (
    heatMapCells: HeatMapCell[],
    attemptedCells: BoardCell['cellNum'][]
): BoardCell['cellNum'] | null => {
    const availableCells = heatMapCells.filter(cell =>
        !attemptedCells.includes(cell.cellNum) && cell.heatValue > IS_MISS_PROBABILITY
    );

    if (availableCells.length === 0) {
        // Fallback to any remaining cell if no good targets
        const fallbackCells = heatMapCells.filter(cell =>
            !attemptedCells.includes(cell.cellNum)
        );
        if (fallbackCells.length === 0) return null;
        return fallbackCells[Math.floor(Math.random() * fallbackCells.length)].cellNum;
    }

    // Apply parity pattern for pure hunting (no hits yet)
    const hasAnyHits = heatMapCells.some(cell => cell.heatValue === IS_HIT_PROBABILITY);
    if (!hasAnyHits) {
        const parityFiltered = availableCells.filter(cell => {
            const row = Math.ceil(cell.cellNum / 10);
            const col = ((cell.cellNum - 1) % 10) + 1;
            // Checkerboard pattern for optimal coverage of ships length 2+
            return (row + col) % 2 === 0;
        });

        if (parityFiltered.length > 0) {
            // Use parity cells weighted by heat
            const totalWeight = parityFiltered.reduce((sum, cell) => sum + Math.max(cell.heatValue, 0.1), 0);
            let randomWeight = Math.random() * totalWeight;

            for (const cell of parityFiltered) {
                randomWeight -= Math.max(cell.heatValue, 0.1);
                if (randomWeight <= 0) {
                    return cell.cellNum;
                }
            }
            return parityFiltered[0].cellNum;
        }
    }

    // Weight selection by probability
    const totalWeight = availableCells.reduce((sum, cell) => sum + Math.max(cell.heatValue, 0.1), 0);
    let randomWeight = Math.random() * totalWeight;

    for (const cell of availableCells) {
        randomWeight -= Math.max(cell.heatValue, 0.1);
        if (randomWeight <= 0) {
            return cell.cellNum;
        }
    }

    // Fallback
    return availableCells[0].cellNum;
};

const findBestDirectionalTarget = (
    hits: BoardCell['cellNum'][],
    direction: 'horizontal' | 'vertical',
    availableTargets: BoardCell['cellNum'][]
): BoardCell['cellNum'] => {
    const sortedHits = [...hits].sort((a, b) => a - b);

    if (direction === 'horizontal') {
        const leftmost = sortedHits[0] - 1;
        const rightmost = sortedHits[sortedHits.length - 1] + 1;

        if (availableTargets.includes(leftmost)) return leftmost;
        if (availableTargets.includes(rightmost)) return rightmost;
    } else if (direction === 'vertical') {
        const topmost = sortedHits[0] - 10;
        const bottommost = sortedHits[sortedHits.length - 1] + 10;

        if (availableTargets.includes(topmost)) return topmost;
        if (availableTargets.includes(bottommost)) return bottommost;
    }

    return availableTargets[0];
};

const updateHeatMapAfterSink = (
    heatMapCells: HeatMapCell[],
    sunkShipCells: BoardCell['cellNum'][],
    lastHit: BoardCell['cellNum']
): HeatMapCell[] => {
    return heatMapCells.map(cell => {
        if (cell.cellNum === lastHit) {
            return { ...cell, heatValue: IS_SUNK_PROBABILITY };
        }

        if (sunkShipCells.includes(cell.cellNum)) {
            return { ...cell, heatValue: IS_SUNK_PROBABILITY };
        }

        const isAdjacentToSunkShip = sunkShipCells.some(sunkCell =>
            isSurroundingHitCell(cell.cellNum, sunkCell)
        );

        if (isAdjacentToSunkShip) {
            return { ...cell, heatValue: Math.max(0, cell.heatValue - 2) };
        }

        return cell;
    });
};

// MEDIUM DIFFICULTY: Probability-based targeting with ship fitting analysis
const findProbabilityBasedTarget = (state: GameState): BoardCell['cellNum'] | null => {
    if (state.computerAI.huntingMode === 'targeting' && state.computerAI.currentTarget) {
        return null; // Let regular targeting handle this
    }

    const ai = state.computerAI;
    const remainingShips = Object.entries(ai.shipConstraints.remainingShips)
        .filter(([_, count]) => count > 0)
        .map(([ship, _]) => ship);

    if (remainingShips.length === 0) return null;

    const shipLengths = remainingShips.map(ship => getShipLength(ship));
    const probabilityMap = calculateShipFitProbabilities(
        state.computerAttemptedCells,
        state.playerCells.filter(c => c.status === 'hit').map(c => c.cellNum),
        shipLengths
    );

    // Find best probability cell
    const availableCells = probabilityMap.filter(cell =>
        !state.computerAttemptedCells.includes(cell.cellNum) &&
        cell.probability > 0
    );

    if (availableCells.length === 0) return null;

    const maxProb = Math.max(...availableCells.map(c => c.probability));
    const bestCells = availableCells.filter(c => c.probability === maxProb);

    return bestCells[Math.floor(Math.random() * bestCells.length)].cellNum;
};

// HARD DIFFICULTY: Constraint-based reasoning with logical deduction
const findConstraintBasedTarget = (state: GameState): BoardCell['cellNum'] | null => {
    if (state.computerAI.huntingMode === 'targeting' && state.computerAI.currentTarget) {
        return null; // Let regular targeting handle this
    }

    // Use logical deduction to find certain cells
    const certainTarget = findCertainCellByElimination(state);
    if (certainTarget) return certainTarget;

    // Use overlapping square analysis
    const overlapTarget = findOverlappingSquareTarget(state);
    if (overlapTarget) return overlapTarget;

    // Fallback to probability-based
    return findProbabilityBasedTarget(state);
};

const getShipLength = (shipType: string): number => {
    const lengths: { [key: string]: number } = {
        destroyer: 2,
        submarine: 3,
        cruiser: 3,
        battleship: 4,
        carrier: 5
    };
    return lengths[shipType] || 2;
};

const calculateShipFitProbabilities = (
    attemptedCells: BoardCell['cellNum'][],
    hitCells: BoardCell['cellNum'][],
    shipLengths: number[]
): Array<{cellNum: BoardCell['cellNum'], probability: number}> => {
    const probabilities = Array(100).fill(0).map((_, idx) => ({
        cellNum: idx + 1,
        probability: 0
    }));

    for (const length of shipLengths) {
        // Try all horizontal placements
        for (let row = 1; row <= 10; row++) {
            for (let col = 1; col <= 10 - length + 1; col++) {
                const startCell = (row - 1) * 10 + col;
                const shipCells = Array.from({length}, (_, i) => startCell + i);

                if (isValidShipPlacement(shipCells, attemptedCells, hitCells)) {
                    // This placement is valid, increase probability for all cells in it
                    for (const cellNum of shipCells) {
                        if (!attemptedCells.includes(cellNum)) {
                            probabilities[cellNum - 1].probability += 1;
                        }
                    }
                }
            }
        }

        // Try all vertical placements
        for (let row = 1; row <= 10 - length + 1; row++) {
            for (let col = 1; col <= 10; col++) {
                const startCell = (row - 1) * 10 + col;
                const shipCells = Array.from({length}, (_, i) => startCell + (i * 10));

                if (isValidShipPlacement(shipCells, attemptedCells, hitCells)) {
                    // This placement is valid, increase probability for all cells in it
                    for (const cellNum of shipCells) {
                        if (!attemptedCells.includes(cellNum)) {
                            probabilities[cellNum - 1].probability += 1;
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
    // Ship can't overlap with missed cells
    const hasOverlapWithMisses = shipCells.some(cell =>
        attemptedCells.includes(cell) && !hitCells.includes(cell)
    );

    return !hasOverlapWithMisses;
};

const findCertainCellByElimination = (state: GameState): BoardCell['cellNum'] | null => {
    // Implement constraint-based elimination logic
    const ai = state.computerAI;
    const remainingShips = Object.entries(ai.shipConstraints.remainingShips)
        .filter(([_, count]) => count > 0);

    // For each remaining ship, check if there's only one possible placement
    for (const [shipType, count] of remainingShips) {
        if (count !== 1) continue;

        const length = getShipLength(shipType);
        const possiblePlacements = findAllPossiblePlacements(length, state);

        if (possiblePlacements.length === 1) {
            // Only one way to place this ship - mark cells as certain
            const placement = possiblePlacements[0];
            for (const cellNum of placement) {
                if (!state.computerAttemptedCells.includes(cellNum)) {
                    return cellNum;
                }
            }
        }
    }

    return null;
};

const findOverlappingSquareTarget = (state: GameState): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;
    const remainingShips = Object.entries(ai.shipConstraints.remainingShips)
        .filter(([_, count]) => count > 0)
        .map(([ship, _]) => ship);

    if (remainingShips.length === 0) return null;

    // Only use this technique when we have few remaining ships to avoid complexity
    if (remainingShips.length > 3) return null;

    const cellProbabilities = Array(100).fill(0);

    // For each remaining ship type, calculate how likely each cell is to contain that ship
    for (const shipType of remainingShips) {
        const length = getShipLength(shipType);
        const possiblePlacements = findAllPossiblePlacements(length, state);

        if (possiblePlacements.length === 0) continue;

        // Add weighted probability for each cell
        for (const placement of possiblePlacements) {
            for (const cellNum of placement) {
                cellProbabilities[cellNum - 1] += 1 / possiblePlacements.length;
            }
        }
    }

    // Find the cell with highest combined probability
    let bestCell = null;
    let bestProbability = 0;

    for (let cellNum = 1; cellNum <= 100; cellNum++) {
        if (state.computerAttemptedCells.includes(cellNum)) continue;

        const probability = cellProbabilities[cellNum - 1];
        if (probability > bestProbability && probability > 0.8) { // High confidence threshold
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
    const hitCells = state.playerCells.filter(c => c.status === 'hit').map(c => c.cellNum);

    // Try all horizontal placements
    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10 - length + 1; col++) {
            const startCell = (row - 1) * 10 + col;
            const shipCells = Array.from({length}, (_, i) => startCell + i);

            if (isValidShipPlacement(shipCells, attemptedCells, hitCells)) {
                placements.push(shipCells);
            }
        }
    }

    // Try all vertical placements
    for (let row = 1; row <= 10 - length + 1; row++) {
        for (let col = 1; col <= 10; col++) {
            const startCell = (row - 1) * 10 + col;
            const shipCells = Array.from({length}, (_, i) => startCell + (i * 10));

            if (isValidShipPlacement(shipCells, attemptedCells, hitCells)) {
                placements.push(shipCells);
            }
        }
    }

    return placements;
};

// Advanced multi-ship detection based on the article's insights
const detectMultipleShips = (hits: BoardCell['cellNum'][], direction: 'horizontal' | 'vertical' | 'unknown'): boolean => {
    if (hits.length < 3) return false;

    if (direction === 'horizontal') {
        const sortedHits = [...hits].sort((a, b) => a - b);
        // Check for gaps in horizontal sequence that might indicate multiple ships
        for (let i = 1; i < sortedHits.length; i++) {
            if (sortedHits[i] - sortedHits[i-1] > 1) {
                return true; // Gap detected, likely multiple ships
            }
        }
    } else if (direction === 'vertical') {
        const sortedHits = [...hits].sort((a, b) => a - b);
        // Check for gaps in vertical sequence
        for (let i = 1; i < sortedHits.length; i++) {
            if (sortedHits[i] - sortedHits[i-1] > 10) {
                return true; // Gap detected, likely multiple ships
            }
        }
    }

    return false;
};

const calculatePossibleShipLengths = (hits: BoardCell['cellNum'][], state: GameState): number[] => {
    const remainingShips = Object.entries(state.computerAI.shipConstraints.remainingShips)
        .filter(([_, count]) => count > 0)
        .map(([ship, _]) => getShipLength(ship));

    // Filter ship lengths that could accommodate the current hit pattern
    return remainingShips.filter(length => length >= hits.length);
};

// Enhanced targeting with multi-ship awareness
const findAdvancedTarget = (state: GameState): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;

    // Handle multiple ship scenarios like in the article
    if (ai.currentTarget?.suspectedMultipleShips && ai.multipleTargets.length > 0) {
        // Prioritize finishing current target first
        const currentTargets = ai.currentTarget.potentialTargets.filter(cell =>
            !state.computerAttemptedCells.includes(cell)
        );

        if (currentTargets.length > 0) {
            return currentTargets[0];
        }

        // Switch to next queued target
        for (const target of ai.multipleTargets) {
            const availableTargets = target.potentialTargets.filter(cell =>
                !state.computerAttemptedCells.includes(cell)
            );
            if (availableTargets.length > 0) {
                return availableTargets[0];
            }
        }
    }

    return null;
};

// Endgame optimization: prioritize smaller ships based on article insights
const adjustHeatMapForEndgame = (
    heatMapCells: HeatMapCell[],
    remainingShips: { [key: string]: number },
    gameProgress: number
): HeatMapCell[] => {
    if (gameProgress < 0.7) return heatMapCells; // Not endgame yet

    return heatMapCells.map(cell => {
        let adjustedHeat = cell.heatValue;

        // In endgame, prioritize areas where smaller ships are likely
        const smallShipsRemaining = (remainingShips.destroyer || 0);
        if (smallShipsRemaining > 0 && adjustedHeat > 0) {
            // Small ships are harder to find, increase their priority
            adjustedHeat *= 1.3;
        }

        return { ...cell, heatValue: adjustedHeat };
    });
};

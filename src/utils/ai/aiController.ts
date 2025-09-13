import {
    BoardCell
    , GameState
} from '../../types/types';
import {
    findBestHuntingTarget
    , findBestDirectionalTarget
} from './generalAIUtils';
import { findProbabilityBasedTarget } from './mediumAIUtils';
import {
    findConstraintBasedTarget
    , findAdvancedTarget
    , adjustHeatMapForEndgame
} from './hardAIUtils';

export const findNextTargetedCell = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;

    const advancedTarget = findAdvancedTarget( state );
    if ( advancedTarget ) return advancedTarget;

    if ( ai.difficulty === 'hard' ) {
        const constraintTarget = findConstraintBasedTarget( state );
        if ( constraintTarget ) return constraintTarget;
    }

    if ( ai.difficulty === 'medium' ) {
        const probabilityTarget = findProbabilityBasedTarget( state );
        if ( probabilityTarget ) return probabilityTarget;
    }

    if ( ai.huntingMode === 'hunting' || !ai.currentTarget ) {
        const gameProgress = state.computerAttemptedCells.length / 100;
        const optimizedHeatMap = adjustHeatMapForEndgame(
            ai.heatMapCells,
            ai.shipConstraints.remainingShips,
            gameProgress
        );

        return findBestHuntingTarget( optimizedHeatMap, state.computerAttemptedCells );
    }

    const {
        hits
        , direction
        , potentialTargets
    } = ai.currentTarget;
    const availableTargets = potentialTargets.filter( cell =>
        !state.computerAttemptedCells.includes( cell )
    );

    if ( availableTargets.length === 0 ) {
        return findBestHuntingTarget( ai.heatMapCells, state.computerAttemptedCells );
    }

    if ( direction === 'unknown' && hits.length === 1 ) {
        return availableTargets[ 0 ];
    }

    if ( direction !== 'unknown' ) {
        return findBestDirectionalTarget( hits, direction, availableTargets );
    }

    return availableTargets[ 0 ];
};

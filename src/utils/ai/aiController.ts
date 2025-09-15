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

const findBestHeatTarget = ( ai: GameState['computerAI'], availableTargets: BoardCell['cellNum'][] ): BoardCell['cellNum'] => {
    const targetHeatValues = availableTargets.map( target => {
        const heatCell = ai.heatMapCells.find( cell => cell.cellNum === target );
        return {
            cellNum: target
            , heatValue: heatCell ? heatCell.heatValue : 0
        };
    } );
    const maxHeat = Math.max( ...targetHeatValues.map( t => t.heatValue ) );
    const bestTargets = targetHeatValues.filter( t => t.heatValue === maxHeat );
    return bestTargets[ Math.floor( Math.random() * bestTargets.length ) ].cellNum;
};

export const findNextTargetedCell = ( state: GameState ): BoardCell['cellNum'] | null => {
    const ai = state.computerAI;

    if ( ai.currentTarget && ai.currentTarget.direction !== 'unknown' && ai.currentTarget.hits.length >= 2 ) {
        const availableTargets = ai.currentTarget.potentialTargets.filter( cell =>
            !state.computerAttemptedCells.includes( cell )
        );

        if ( availableTargets.length > 0 ) {
            return findBestDirectionalTarget( ai.currentTarget.hits, ai.currentTarget.direction, availableTargets );
        }
    }

    const advancedTarget = findAdvancedTarget( state );
    if ( advancedTarget ) return advancedTarget;

    if ( ai.currentTarget && ai.huntingMode === 'targeting' ) {
        const availableTargets = ai.currentTarget.potentialTargets.filter( cell =>
            !state.computerAttemptedCells.includes( cell )
        );

        if ( availableTargets.length > 0 ) {
            if ( ai.difficulty === 'hard' && availableTargets.length > 1 ) {
                return findBestHeatTarget( ai, availableTargets );
            }
            return availableTargets[ 0 ];
        }
    }

    if ( ai.difficulty === 'hard' ) {
        const constraintTarget = findConstraintBasedTarget( state );
        if ( constraintTarget ) return constraintTarget;
    }

    if ( ai.difficulty === 'medium' ) {
        const probabilityTarget = findProbabilityBasedTarget( state );
        if ( probabilityTarget ) return probabilityTarget;
    }

    const gameProgress = state.computerAttemptedCells.length / 100;
    const optimizedHeatMap = adjustHeatMapForEndgame(
        ai.heatMapCells,
        ai.shipConstraints.remainingShips,
        gameProgress
    );

    return findBestHuntingTarget( optimizedHeatMap, state.computerAttemptedCells );
};

// Jotai
import { atom } from 'jotai';
import { useReducerAtom } from 'jotai/utils';

// State
import { reducer } from './reducer';

// Types
import {
    ReducerAction
    , GameState
} from '../types/types';

// Utils
import { buildEmptyCells } from '../utils/buildBoardCells';
import { defaultShips } from '../utils/ships';
import { buildStartingHeatMap } from '../utils/computerAIUtils';

export const initState: GameState = {
    playerCells: buildEmptyCells()
    , computerCells: buildEmptyCells()
    , computerShips: defaultShips
    , playerShips: defaultShips
    , playerShipPlacement: 'random'
    , playerAttemptedCells: []
    , computerAttemptedCells: []
    , alertText: ''
    , currentTurn: 'player'
    , currentScreen: 'start'
    , gameMode: 'easy'
    , isModalOpen: false
    , isGameOver: false
    , winner: ''
    , computerAI: {
        lastShot: {
            cellNum: null
            , wasHit: false
        }
        , heatMapCells: buildStartingHeatMap()
        , targetStack: []
        , huntingMode: 'hunting'
        , currentTarget: null
        , multipleTargets: []
        , shipConstraints: {
            remainingShips: { destroyer: 1, submarine: 1, cruiser: 1, battleship: 1, carrier: 1 }
            , impossibleCells: []
            , certainCells: []
        }
        , difficulty: 'easy'
    }
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<GameState, ReducerAction>( stateAtom, reducer );
};

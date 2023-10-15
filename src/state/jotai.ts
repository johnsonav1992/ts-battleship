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
    }
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<GameState, ReducerAction>( stateAtom, reducer );
};

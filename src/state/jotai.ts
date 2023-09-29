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

export const initState: GameState = {
    playerCells: buildEmptyCells()
    , computerCells: buildEmptyCells()
    , computerShips: defaultShips
    , playerShips: defaultShips
    , playerAttemptedCells: []
    , computerAttemptedCells: []
    , alertText: ''
    , currentTurn: 'player'
    , currentScreen: 'start'
    , gameMode: 'medium'
    , isModalOpen: false
    , isGameOver: false
    , winner: ''
    , computerAI: {
        lastShot: {
            cellNum: null
            , wasHit: false
        }
        , attemptedCells: []
    }
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<GameState, ReducerAction>( stateAtom, reducer );
};

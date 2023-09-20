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
import {
    buildBoardCells
    , buildEmptyCells
} from '../utils/buildBoardCells';
import { defaultShips } from '../utils/ships';

const initState: GameState = {
    playerCells: buildEmptyCells()
    , computerCells: buildBoardCells()
    , computerShips: defaultShips
    , playerShips: defaultShips
    , playerAttemptedCells: []
    , computerAttemptedCells: []
    , alertText: ''
    , currentTurn: 'player'
    , currentScreen: 'start'
    , isModalOpen: false
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<GameState, ReducerAction>( stateAtom, reducer );
};

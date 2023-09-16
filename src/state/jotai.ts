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
import { buildBoardCells } from '../utils/buildBoardCells';
import { defaultShips } from '../utils/ships';

const initState: GameState = {
    playerCells: buildBoardCells()
    , computerCells: buildBoardCells()
    , computerShips: defaultShips
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<GameState, ReducerAction>( stateAtom, reducer );
};
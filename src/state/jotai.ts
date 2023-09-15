// Jotai
import { atom } from 'jotai';
import { useReducerAtom } from 'jotai/utils';

// State
import { reducer } from './reducer';

// Types
import {
    ReducerAction
    , ReducerState
} from '../types/types';

const initState: ReducerState = {
    playerCells: []
    , enemyCells: []
};

const stateAtom = atom( initState );

export const useBattleShipState = () => {
    return useReducerAtom<ReducerState, ReducerAction>( stateAtom, reducer );
};

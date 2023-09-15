// Types
import { ReducerFn } from '../types/types';

export const reducer: ReducerFn = ( state, action ) => {
    const { payload } = action;
    const { computerCells } = state;

    switch ( action.type ) {
        case 'PLAYER_SHOT': {
            return {
                ...state
                , computerCells: computerCells.map( ( cell ) => {
                    if ( cell.cellNum === payload ) {
                        if ( cell.shipImg ) {
                            return { ...cell, status: 'hit' };
                        }
                        return { ...cell, status: 'miss' };
                    }
                    return cell;
                } )
            };
        }
        default: return state;
    }
};

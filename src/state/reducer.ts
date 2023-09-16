// Types
import { ReducerFn, Ship } from '../types/types';

export const reducer: ReducerFn = ( state, action ) => {
    const { payload } = action;
    const {
        computerCells
        , computerShips
    } = state;

    switch ( action.type ) {
        case 'PLAYER_SHOT': {
            let updatedComputerShips = state.computerShips;

            const updatedComputerCells = computerCells.map( ( cell ) => {
                if ( cell.cellNum === payload ) {
                    if ( cell.shipImg ) {
                        const [ shipId ] = cell.shipImg.label.split( '-' );

                        updatedComputerShips = computerShips.map( ( ship ) => {
                            if ( ship.id === shipId && ship.hits !== ship.length ) {
                                const updatedShip = { ...ship, hits: ( ship.hits + 1 ) as Ship['hits'] };

                                if ( updatedShip.hits === updatedShip.length ) {
                                    return { ...updatedShip, isSunk: true };
                                }
                                return updatedShip;
                            }
                            return ship;
                        } );

                        return { ...cell, status: 'hit' };
                    }
                    return { ...cell, status: 'miss' };
                }
                return cell;
            } );

            return {
                ...state
                , computerCells: updatedComputerCells
                , computerShips: updatedComputerShips
            };
        }
        default: return state;
    }
};

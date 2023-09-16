// Types
import { BoardCell, ReducerFn, Ship } from '../types/types';

export const reducer: ReducerFn = ( state, action ) => {
    const { payload } = action;
    const {
        computerCells
        , computerShips
    } = state;

    switch ( action.type ) {
        case 'PLAYER_SHOT': {
            const [ shotCell ] = computerCells.filter( compCell => compCell?.cellNum === payload && compCell.shipImg );
            const shipLabel = shotCell?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ] as Ship['id'] | undefined;

            const updatedComputerCells: BoardCell[] = computerCells.map( ( cell ) => {
                if ( cell.cellNum === payload ) {
                    if ( cell.shipImg ) {
                        return { ...cell, status: 'hit' };
                    }
                    return { ...cell, status: 'miss' };
                }
                return cell;
            } );

            const updatedComputerShips: Ship[] = computerShips.map( ship => {
                if ( ship.id === shipId ) {
                    const updatedShip = { ...ship, hits: ( ship.hits + 1 ) as Ship['hits'] };

                    if ( updatedShip.hits === updatedShip.length ) {
                        return { ...updatedShip as Ship, isSunk: true };
                    }
                    return updatedShip as Ship;
                }
                return ship;
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

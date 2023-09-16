// Types
import {
    BoardCell
    , ReducerFn
    , Ship
} from '../types/types';

export const reducer: ReducerFn = ( state, action ) => {
    const {
        computerCells
        , computerShips
    } = state;

    switch ( action.type ) {
        case 'PLAYER_SHOT': {
            const [ shotCell ] = computerCells.filter( compCell => compCell?.cellNum === action.payload && compCell.shipImg );
            const shipLabel = shotCell?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ];

            const updatedComputerCells: BoardCell[] = computerCells.map( ( cell ) => {
                if ( cell.cellNum === action.payload ) {
                    if ( cell.shipImg ) {
                        return { ...cell, status: 'hit' };
                    }
                    return { ...cell, status: 'miss' };
                }
                return cell;
            } );

            const updatedComputerShips = computerShips.map( ship => {
                if ( ship.id === shipId ) {
                    const updatedShip = { ...ship, hits: ship.hits + 1 };

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
                , playerAttemptedCells: [ ...state.playerAttemptedCells, action.payload ]
            };
        }
        default: return state;
    }
};

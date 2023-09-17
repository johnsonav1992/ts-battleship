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
            const shipHit = computerCells.find( compCell => compCell?.cellNum === action.payload && compCell.shipImg );

            if ( !shipHit ) {
                return {
                    ...state
                    , computerCells: computerCells.map( ( cell ) => {
                        if ( cell.cellNum === action.payload ) {
                            return { ...cell, status: 'miss' };
                        }
                        return cell;
                    } )
                    , playerAttemptedCells: [ ...state.playerAttemptedCells, action.payload ]
                    , alertText: ''
                };
            }

            const shipLabel = shipHit?.shipImg?.label.split( '-' );
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
                    const updatedShip = { ...ship, hits: ship.hits + 1 } as Ship;

                    if ( updatedShip.hits === updatedShip.length ) {
                        return { ...updatedShip, isSunk: true };
                    }
                    return updatedShip;
                }
                return ship;
            } );

            const newSunkShip = updatedComputerShips.find( ship => ship.isSunk && ship.id === shipId );

            return {
                ...state
                , computerCells: updatedComputerCells
                , computerShips: updatedComputerShips
                , playerAttemptedCells: [ ...state.playerAttemptedCells, action.payload ]
                , alertText: newSunkShip ? `You sunk the computer's ${ newSunkShip.id }!` : ''
            };
        }
        default: return state;
    }
};

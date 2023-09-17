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
            const attemptedCell = action.payload;
            const shipHit = computerCells.find( compCell => compCell?.cellNum === attemptedCell && compCell.shipImg );

            if ( !shipHit ) {
                return {
                    ...state
                    , computerCells: computerCells.map( cell =>
                        cell.cellNum === attemptedCell
                            ? { ...cell, status: 'miss' }
                            : cell
                    )
                    , playerAttemptedCells: [ ...state.playerAttemptedCells, attemptedCell ]
                    , alertText: ''
                    , currentTurn: 'computer'
                };
            }

            const shipLabel = shipHit?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ];

            const updatedComputerCells = computerCells.map( cell => ( {
                ...cell
                , status: cell.cellNum === attemptedCell ? ( shipId ? 'hit' : 'miss' ) : cell.status
            } ) );

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
                , playerAttemptedCells: [ ...state.playerAttemptedCells, attemptedCell ]
                , alertText: newSunkShip ? `You sunk the computer's ${ newSunkShip.id }!` : ''
                , currentTurn: 'computer'
            };
        }
        case 'COMPUTER_SHOT': {
            const attemptedCell = action.payload;
            console.log( `computer shot! Cell: ${ attemptedCell }` );
            return state;
        }
        default: return state;
    }
};

// Types
import {
    BoardCell
    , ReducerFn
    , Ship
} from '../types/types';
import { findHit, updateCells, updateCellsWithMissOnly, updateShipsWithHit } from '../utils/gameUtils';

export const reducer: ReducerFn = ( state, action ) => {
    const {
        computerCells
        , computerShips
    } = state;

    switch ( action.type ) {
        case 'PLAYER_SHOT': {
            const attemptedCell = action.payload;
            const shipHit = findHit( computerCells, attemptedCell );

            if ( !shipHit ) {
                return {
                    ...state
                    , computerCells: updateCellsWithMissOnly( computerCells, attemptedCell )
                    , playerAttemptedCells: [ ...state.playerAttemptedCells, attemptedCell ]
                    , alertText: ''
                    , currentTurn: 'computer'
                };
            }

            const shipLabel = shipHit?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ];

            const updatedComputerCells = updateCells( computerCells, attemptedCell, shipId );
            const updatedComputerShips = updateShipsWithHit( computerShips, shipId );

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
            return { ...state, currentTurn: 'player' };
        }
        default: return state;
    }
};

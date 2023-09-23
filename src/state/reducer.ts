// Types
import { ReducerFn } from '../types/types';

// Utils
import {
    findHit
    , updateCells
    , updateCellsWithMissOnly
    , updateShipsWithHit
} from '../utils/gameUtils';
import { initState } from './jotai';

export const reducer: ReducerFn = ( state, action ) => {
    const {
        computerCells
        , playerCells
        , computerShips
        , playerShips
    } = state;

    switch ( action.type ) {
        case 'SET_SCREEN': return {
            ...state
            , currentScreen: action.payload
        };
        case 'SET_MODAL_OPEN': return {
            ...state
            , isModalOpen: action.payload
        };
        case 'SET_PLAYER_CELLS': return {
            ...state
            , playerCells: action.payload
        };
        case 'SET_COMPUTER_CELLS': return {
            ...state
            , computerCells: action.payload
        };
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
            const isGameOver = updatedComputerShips.every( ship => ship.isSunk );

            return {
                ...state
                , computerCells: updatedComputerCells
                , computerShips: updatedComputerShips
                , playerAttemptedCells: [ ...state.playerAttemptedCells, attemptedCell ]
                , alertText: newSunkShip ? `You sunk the computer's ${ newSunkShip.id }!` : ''
                , currentTurn: 'computer'
                , isGameOver
                , winner: isGameOver ? 'player' : ''
            };
        }
        case 'COMPUTER_SHOT': {
            const attemptedCell = action.payload;
            const shipHit = findHit( playerCells, attemptedCell );

            if ( !shipHit ) {
                return {
                    ...state
                    , playerCells: updateCellsWithMissOnly( playerCells, attemptedCell )
                    , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                    , alertText: ''
                    , currentTurn: 'player'
                };
            }

            const shipLabel = shipHit?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ];

            const updatedPlayerCells = updateCells( playerCells, attemptedCell, shipId );
            const updatedPlayerShips = updateShipsWithHit( playerShips, shipId );

            const newSunkShip = updatedPlayerShips.find( ship => ship.isSunk && ship.id === shipId );
            const isGameOver = updatedPlayerShips.every( ship => ship.isSunk );

            return {
                ...state
                , playerCells: updatedPlayerCells
                , playerShips: updatedPlayerShips
                , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                , alertText: newSunkShip ? `The computer sunk your ${ newSunkShip.id }!` : ''
                , currentTurn: 'player'
                , isGameOver
                , winner: isGameOver ? 'computer' : ''
            };
        }
        case 'SET_GAME_OVER': return {
            ...state
            , isGameOver: action.payload
        };
        case 'RESET_GAME': return {
            ...initState
        };
        default: return state;
    }
};

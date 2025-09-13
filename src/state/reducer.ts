// Types
import { ReducerFn } from '../types/types';
import { findNextTargetedCell } from '../utils/ai/aiController';
import { updateComputerAI } from '../utils/ai/generalAIUtils';

// Utils
import {
    findHit
    , processTurn
    , updateCells
    , updateCellsWithMissOnly
    , updateShipsWithHit
    , updateCellsWithNewSunkenExplosions
} from '../utils/gameUtils';
import { initState } from './jotai';

export const reducer: ReducerFn = ( state, action ) => {
    const {
        playerCells
        , playerShips
    } = state;

    switch ( action.type ) {
        case 'SET_SCREEN': return {
            ...state
            , currentScreen: action.payload
        };
        case 'SET_GAME_MODE': return {
            ...state
            , gameMode: action.payload
            , computerAI: {
                ...state.computerAI
                , difficulty: action.payload
            }
        };
        case 'SET_MODAL_OPEN': return {
            ...state
            , isModalOpen: action.payload
        };
        case 'SET_CELLS': return {
            ...state
            , playerCells: action.payload.playerCells || state.playerCells
            , computerCells: action.payload.computerCells
        };
        case 'SET_PLAYER_SHIP_PLACEMENT': return {
            ...state
            , playerShipPlacement: action.payload
        };
        case 'PLAYER_SHOT': {
            const attemptedCell = action.payload;
            return processTurn(
                state
                , attemptedCell
                , 'player'
            );
        }
        case 'COMPUTER_SHOT': {
            const attemptedCell = action.payload;
            return processTurn(
                state
                , attemptedCell
                , 'computer'
            );
        }
        case 'COMPUTER_AI_SHOT': {
            const attemptedCell = findNextTargetedCell( state );

            if (!attemptedCell) {
                return state;
            }

            const shipHit = findHit( playerCells, attemptedCell );

            if ( !shipHit ) {
                return {
                    ...state
                    , playerCells: updateCellsWithMissOnly( playerCells, attemptedCell )
                    , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                    , alertText: ''
                    , currentTurn: 'player'
                    , computerAI: updateComputerAI( state, attemptedCell, false )
                };
            }

            const shipLabel = shipHit?.shipImg?.label.split( '-' );
            const shipId = shipLabel?.[ 0 ];

            const updatedPlayerCells = updateCells( playerCells, attemptedCell, shipId );
            const updatedPlayerShips = updateShipsWithHit( playerShips, shipId );

            const newSunkShip = updatedPlayerShips.find( ship => ship.isSunk && ship.id === shipId );
            const updatedPlayerCellsWithSunkShip = updateCellsWithNewSunkenExplosions( updatedPlayerCells, newSunkShip );
            const isGameOver = updatedPlayerShips.every( ship => ship.isSunk );

            return {
                ...state
                , playerCells: updatedPlayerCellsWithSunkShip || updatedPlayerCells
                , playerShips: updatedPlayerShips
                , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                , currentTurn: 'player'
                , alertText: newSunkShip ? `The computer sunk your ${ newSunkShip.id }!` : ''
                , computerAI: updateComputerAI( state, attemptedCell, true, !!newSunkShip )
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

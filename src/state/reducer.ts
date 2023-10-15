// Types
import { ReducerFn } from '../types/types';
import {
    findNextTargetedCell
    , updateComputerAI
} from '../utils/computerAIUtils';

// Utils
import {
    findHit
    , processTurn
    , updateCells
    , updateCellsWithMissOnly
    , updateShipsWithHit
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
            const heatMap = state.computerAI.heatMapCells;
            const allUnattemptedCells = heatMap.filter( cell => !state.computerAttemptedCells.includes( cell.cellNum ) );
            const maxHeatValueOfRemainingCells = Math.max( ...allUnattemptedCells.map( obj => obj.heatValue ) );
            const allCellsWithHighestHeatValue = heatMap.filter( cell => cell.heatValue === maxHeatValueOfRemainingCells );
            const randomIndex = Math.floor( Math.random() * allCellsWithHighestHeatValue.length );
            const selectedCell = allCellsWithHighestHeatValue[ randomIndex ].cellNum;

            // Very first shot
            if ( state.computerAttemptedCells.length === 0 ) {
                const attemptedCell = selectedCell;
                const shipHit = findHit( playerCells, attemptedCell );

                if ( !shipHit ) {
                    return {
                        ...state
                        , playerCells: updateCellsWithMissOnly( playerCells, attemptedCell )
                        , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                        , alertText: ''
                        , currentTurn: 'player'
                        , computerAI: updateComputerAI( state, attemptedCell, !!shipHit )
                    };
                }

                const shipLabel = shipHit?.shipImg?.label.split( '-' );
                const shipId = shipLabel?.[ 0 ];

                const updatedPlayerCells = updateCells( playerCells, attemptedCell, shipId );
                const updatedPlayerShips = updateShipsWithHit( playerShips, shipId );

                return {
                    ...state
                    , playerCells: updatedPlayerCells
                    , playerShips: updatedPlayerShips
                    , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                    , currentTurn: 'player'
                    , computerAI: updateComputerAI( state, attemptedCell, !!shipHit )
                };
            }

            const isTargeting = state.computerAI.targetStack.length > 0;
            const attemptedCell = isTargeting ? findNextTargetedCell( state ) : selectedCell;
            const shipHit = findHit( playerCells, attemptedCell );

            if ( !shipHit ) {
                return {
                    ...state
                    , playerCells: updateCellsWithMissOnly( playerCells, attemptedCell )
                    , computerAttemptedCells: [ ...state.computerAttemptedCells, attemptedCell ]
                    , alertText: ''
                    , currentTurn: 'player'
                    , computerAI: updateComputerAI( state, attemptedCell, !!shipHit )
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
                , currentTurn: 'player'
                , alertText: newSunkShip ? `The computer sunk your ${ newSunkShip.id }!` : ''
                , computerAI: updateComputerAI( state, attemptedCell, !!shipHit )
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

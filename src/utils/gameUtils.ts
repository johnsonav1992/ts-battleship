// Types
import {
    BoardCell
    , GameState
    , ReducerAction
    , Ship
} from '../types/types';

export const findHit = ( cells: BoardCell[], attemptedCell: number ): BoardCell | undefined => {
    return cells.find( compCell => compCell?.cellNum === attemptedCell && compCell.shipImg );
};

export const updateCells = ( cells: BoardCell[], attemptedCell: number, shipId: string | undefined ): BoardCell[] => {
    return cells.map( cell => ( {
        ...cell
        , status: cell.cellNum === attemptedCell ? ( shipId ? 'hit' : 'miss' ) : cell.status
    } ) );
};

export const updateCellsWithMissOnly = ( cells: BoardCell[], attemptedCell: number ): BoardCell[] => {
    return cells.map( cell =>
        cell.cellNum === attemptedCell
            ? {
                ...cell
                , status: 'miss'
            }
            : cell
    );
};

export const updateShipsWithHit = ( ships: Ship[], shipId: string | undefined ): Ship[] => {
    return ships.map( ship => {
        if ( ship.id === shipId ) {
            const updatedShip = {
                ...ship
                , hits: ship.hits + 1
            } as Ship;

            if ( updatedShip.hits === updatedShip.length ) {
                return {
                    ...updatedShip
                    , isSunk: true
                };
            }
            return updatedShip;
        }
        return ship;
    } );
};

export const takeComputerShot = ( dispatch: ( action: ReducerAction ) => void, type: GameState['gameMode'], computerAttemptedCells?: number[] ) => {
    const randomCell = Math.floor( Math.random() * 100 ) + 1;

    if ( type === 'easy' ) {
        if ( computerAttemptedCells?.includes( randomCell ) ) {
            takeComputerShot( dispatch, 'easy', computerAttemptedCells );
        } else {
            setTimeout( () => dispatch( {
                type: 'COMPUTER_SHOT'
                , payload: randomCell
            } ), 2000 );
        }
    } else {
        setTimeout( () => dispatch( { type: 'COMPUTER_AI_SHOT' } ), 1500 );
    }
};

export const processTurn = (
    state: GameState
    , attemptedCell: BoardCell['cellNum']
    , player: GameState['currentTurn']
): GameState => {
    const oppositePlayer = player === 'player' ? 'computer' : 'player';

    const boardToTarget = state[ `${ player }Cells` ];
    const shipsToTarget = state[ `${ player }Ships` ];

    const shipHit = findHit( boardToTarget, attemptedCell );

    if ( !shipHit ) {
        return {
            ...state
            , [ `${ oppositePlayer }Cells` ]: updateCellsWithMissOnly( boardToTarget, attemptedCell )
            , [ `${ player }AttemptedCells` ]: [ ...state[ `${ player }AttemptedCells` ], attemptedCell ]
            , alertText: ''
            , currentTurn: oppositePlayer
        };
    }

    const shipLabel = shipHit?.shipImg?.label.split( '-' );
    const shipId = shipLabel?.[ 0 ];

    const updatedOppositePlayerCells = updateCells( boardToTarget, attemptedCell, shipId );
    const updatedOppositePlayerShips = updateShipsWithHit( shipsToTarget, shipId );

    const newSunkShip = updatedOppositePlayerShips.find( ship => ship.isSunk && ship.id === shipId );
    const isGameOver = updatedOppositePlayerShips.every( ship => ship.isSunk );

    return {
        ...state
        , [ `${ oppositePlayer }Cells` ]: updatedOppositePlayerCells
        , [ `${ oppositePlayer }Ships` ]: updatedOppositePlayerShips
        , [ `${ player }AttemptedCells` ]: [ ...state.playerAttemptedCells, attemptedCell ]
        , alertText: newSunkShip
            ? player === 'player'
                ? `You sunk the ${ oppositePlayer }'s ${ newSunkShip.id }`
                : `The ${ oppositePlayer } sunk your ${ newSunkShip.id }`
            : ''
        , currentTurn: oppositePlayer
        , isGameOver
        , winner: isGameOver ? player : ''
    };
};

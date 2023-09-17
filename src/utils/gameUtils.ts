// Types
import {
    BoardCell
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
            ? { ...cell, status: 'miss' }
            : cell
    );
};

export const updateShipsWithHit = ( ships: Ship[], shipId: string | undefined ): Ship[] => {
    return ships.map( ship => {
        if ( ship.id === shipId ) {
            const updatedShip = { ...ship, hits: ship.hits + 1 } as Ship;

            if ( updatedShip.hits === updatedShip.length ) {
                return { ...updatedShip, isSunk: true };
            }
            return updatedShip;
        }
        return ship;
    } );
};

export const takeComputerShot = ( dispatch: ( action: ReducerAction ) => void, computerAttemptedCells: number[] ) => {
    const randomCell = Math.floor( Math.random() * 100 ) + 1;

    if ( computerAttemptedCells.includes( randomCell ) ) {
        takeComputerShot( dispatch, computerAttemptedCells );
    } else {
        setTimeout( () => dispatch( {
            type: 'COMPUTER_SHOT'
            , payload: randomCell
        } ), 2000 );
    }
};

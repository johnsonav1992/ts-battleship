import { BoardCell, ShipConfig } from '../types/types';
import { ship1, ship2, ship3, ship4, ship5 } from './ships';

export const buildBoardCells = (): BoardCell[] => {
    const emptyCells: BoardCell[] = Array( 100 ).fill( null ).map( ( _cell, idx ) => {
        const cellNum = idx + 1;

        return {
            shipImg: null
            , cellNum
            , status: 'none'
            , orientation: 'horizontal'
            , direction: 'right' // Default to 'right' for horizontal orientation
        };
    } );

    const ships: ShipConfig[] = [
        { ship: ship1, horizontal: true, forward: true }
        , { ship: ship2, horizontal: false, forward: true }
        , { ship: ship3, horizontal: true, forward: true }
        , { ship: ship4, horizontal: false, forward: true }
        , { ship: ship5, horizontal: true, forward: true }
    ];

    const updatedCells = [ ...emptyCells ];

    const canPlaceShip = (
        cellIndex: number,
        shipLength: number,
        cellsInRow: number,
        horizontal: boolean,
        forward: boolean
    ): boolean => {
        if ( horizontal ) {
            const rowStartIndex = Math.floor( cellIndex / cellsInRow ) * cellsInRow;
            const rowEndIndex = rowStartIndex + cellsInRow - 1;
            const shipEndIndex = cellIndex + shipLength - 1;

            return shipEndIndex <= rowEndIndex;
        } else {
            if ( forward ) {
                return cellIndex >= ( shipLength - 1 ) * cellsInRow;
            } else {
                return cellIndex % cellsInRow >= shipLength - 1;
            }
        }
    };

    const checkForOverlap = (
        cellIndex: number,
        shipLength: number,
        horizontal: boolean,
        forward: boolean
    ): boolean => {
        for ( let i = 0; i < shipLength; i++ ) {
            const currentIndex = horizontal
                ? forward
                    ? cellIndex + i
                    : cellIndex - i
                : forward
                    ? cellIndex - i * 10
                    : cellIndex + i * 10;

            if ( currentIndex < 0 || currentIndex >= 100 || updatedCells[ currentIndex ]?.shipImg !== null ) {
                return true; // Overlap detected or out of bounds
            }
        }
        return false; // No overlap
    };

    const MAX_ATTEMPTS = 100; // Maximum attempts to place a ship

    for ( const { ship, horizontal, forward } of ships ) {
        let placed = false;
        let attemptCount = 0; // Counter to limit attempts
        while ( !placed && attemptCount < MAX_ATTEMPTS ) {
            let startingCellIndex: number;
            if ( horizontal && !forward ) {
                // When a horizontal ship moves backward, start from the right edge
                startingCellIndex = Math.floor( Math.random() * 10 ) * 10 + ( ship.length - 1 );
            } else {
                // Otherwise, start from a random cell
                startingCellIndex = Math.floor( Math.random() * 100 );
            }

            if ( canPlaceShip( startingCellIndex, ship.length, 10, horizontal, forward ) ) {
                if ( !checkForOverlap( startingCellIndex, ship.length, horizontal, forward ) ) {
                    for ( let i = 0; i < ship.length; i++ ) {
                        const cellIndex = horizontal
                            ? forward
                                ? startingCellIndex + i
                                : startingCellIndex - i
                            : forward
                                ? startingCellIndex - i * 10
                                : startingCellIndex + i * 10;

                        const newCell = {
                            ...updatedCells[ cellIndex ]
                            , shipImg: ship[ i ]
                            , orientation: horizontal ? 'horizontal' : 'vertical'
                            , direction: horizontal
                                ? forward
                                    ? 'right'
                                    : 'left'
                                : forward
                                    ? 'up'
                                    : 'down'
                        } as BoardCell;
                        updatedCells[ cellIndex ] = newCell;
                    }
                    placed = true;
                }
            }
            attemptCount++; // Increment the attempt counter
        }
        if ( !placed ) {
            // Handle the case where placement was not successful
            console.error( `Failed to place ship: ${ ship[ 0 ].label }` );
        }
    }

    return updatedCells;
};

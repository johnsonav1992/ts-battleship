// Types
import { BoardCell } from '../types/types';

// Utils
import {
    canPlaceShip
    , checkForShipOverlap
    , shipConfig
} from './shipUtils';

export const buildBoardCells = (): BoardCell[] => {
    const emptyCells: BoardCell[] = Array( 100 ).fill( null ).map( ( _cell, idx ) => {
        const cellNum = idx + 1;

        return {
            shipImg: null
            , cellNum
            , status: 'none'
            , orientation: 'horizontal'
            , direction: 'right'
        };
    } );

    const updatedCells = [ ...emptyCells ];

    const MAX_ATTEMPTS = 100;

    for ( const { ship, horizontal, forward } of shipConfig ) {
        let placed = false;
        let attemptCount = 0;

        while ( !placed && attemptCount < MAX_ATTEMPTS ) {
            let startingCellIndex: number;
            if ( horizontal && !forward ) {
                startingCellIndex = Math.floor( Math.random() * 10 ) * 10 + ( ship.length - 1 );
            } else {
                startingCellIndex = Math.floor( Math.random() * 100 );
            }

            if (
                canPlaceShip( startingCellIndex, ship.length, 10, horizontal, forward )
                && !checkForShipOverlap( startingCellIndex, ship.length, horizontal, forward, updatedCells )
            ) {
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
                    };
                    updatedCells[ cellIndex ] = newCell as BoardCell;
                }
                placed = true;
            }
            attemptCount++;
        }
        if ( !placed ) {
            console.error( `Failed to place ship: ${ ship[ 0 ].label }` );
        }
    }

    return updatedCells;
};
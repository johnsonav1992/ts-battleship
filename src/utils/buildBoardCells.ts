// Types
import {
    BoardCell
    , ShipCellConfig
} from '../types/types';

// Utils
import {
    canPlaceShip
    , shipOverlapping
    , pickRandomBoolean
} from './shipUtils';
import { shipImgSets } from './ships';

export const buildBoardCells = (): BoardCell[] => {
    const emptyCells: BoardCell[] = Array( 100 ).fill( null ).map( ( _cell, idx ) => {
        const cellNum = idx + 1;

        return {
            shipImg: null
            , cellNum
            , status: 'none'
            , orientation: 'none'
            , direction: 'none'
        };
    } );

    const shipConfig: ShipCellConfig[] = shipImgSets.map( shipImgSet => ( {
        shipImgSet
        , horizontal: pickRandomBoolean()
        , forward: pickRandomBoolean()
    } ) );

    const updatedCells = [ ...emptyCells ];

    const MAX_ATTEMPTS = 100;

    for ( const {
        shipImgSet
        , horizontal
        , forward
    } of shipConfig ) {
        let placed = false;
        let attemptCount = 0;

        while ( !placed && attemptCount < MAX_ATTEMPTS ) {
            let startingCellIndex: number;

            if ( horizontal && !forward ) {
                startingCellIndex = Math.floor( Math.random() * 10 ) * 10 + ( shipImgSet.length - 1 );
            } else {
                startingCellIndex = Math.floor( Math.random() * 100 );
            }

            const sharedCheckingParams = {
                cellIndex: startingCellIndex
                , shipLength: shipImgSet.length
                , horizontal
                , forward
            };

            if (
                canPlaceShip( {
                    ...sharedCheckingParams
                    , cellsInRow: 10
                } )
                && !shipOverlapping( {
                    ...sharedCheckingParams
                    , updatedCells
                } )
            ) {
                for ( let i = 0; i < shipImgSet.length; i++ ) {
                    const cellIndex = horizontal
                        ? forward
                            ? startingCellIndex + i
                            : startingCellIndex - i
                        : forward
                            ? startingCellIndex - i * 10
                            : startingCellIndex + i * 10;

                    const newCell = {
                        ...updatedCells[ cellIndex ]
                        , shipImg: shipImgSet[ i ]
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
            console.error( `Failed to place ship: ${ shipImgSet[ 0 ].label }` );
        }
    }

    return updatedCells;
};

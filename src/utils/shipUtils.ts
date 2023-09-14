// Types
import {
    CanPlaceParams
    , CheckOverlapParams
} from '../types/types';

// Assets
import {
    ship1
    , ship2
    , ship3
    , ship4
    , ship5
} from './ships';

export const pickRandomBoolean = () => Math.random() > 0.5;

export const ships = [ ship1, ship2, ship3, ship4, ship5 ];

export const canPlaceShip = ( {
    horizontal
    , cellIndex
    , cellsInRow
    , shipLength
    , forward
}: CanPlaceParams ): boolean => {
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

export const checkForShipOverlap = ( {
    cellIndex
    , shipLength
    , horizontal
    , forward
    , updatedCells
}: CheckOverlapParams ): boolean => {
    for ( let i = 0; i < shipLength; i++ ) {
        const currentIndex = horizontal
            ? forward
                ? cellIndex + i
                : cellIndex - i
            : forward
                ? cellIndex - i * 10
                : cellIndex + i * 10;

        if (
            currentIndex < 0
            || currentIndex >= 100
            || updatedCells[ currentIndex ]?.shipImg !== null
        ) {
            return true;
        }
    }
    return false; // No overlap
};

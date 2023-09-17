// Ship 1
import ship1Front from '../assets/ship1/front.png';
import ship1Back from '../assets/ship1/back.png';

// Ship 2
import ship2Front from '../assets/ship2/front.png';
import ship2Middle from '../assets/ship2/middle.png';
import ship2Back from '../assets/ship2/back.png';

// Ship 3
import ship3Front from '../assets/ship3/front.png';
import ship3Middle from '../assets/ship3/middle.png';
import ship3Back from '../assets/ship3/back.png';

// Ship 4
import ship4Front from '../assets/ship4/front.png';
import ship4MiddleBack from '../assets/ship4/middle-back.png';
import ship4MiddleFront from '../assets/ship4/middle-front.png';
import ship4Back from '../assets/ship4/back.png';

// Ship 5
import ship5Front from '../assets/ship5/front.png';
import ship5MiddleBack from '../assets/ship5/middle-back.png';
import ship5Middle from '../assets/ship5/middle.png';
import ship5MiddleFront from '../assets/ship5/middle-front.png';
import ship5Back from '../assets/ship5/back.png';

// Types
import {
    Ship
    , ShipImg
} from '../types/types';

export const ship1Imgs: ShipImg[] = [
    {
        img: ship1Back
        , label: 'destroyer-back'
    }
    , {
        img: ship1Front
        , label: 'destroyer-front'
    }
];

export const ship2Imgs: ShipImg[] = [
    {
        img: ship2Back
        , label: 'submarine-back'
    }
    , {
        img: ship2Middle
        , label: 'submarine-middle'
    }
    , {
        img: ship2Front
        , label: 'submarine-front'
    }
];

export const ship3Imgs: ShipImg[] = [
    {
        img: ship3Back
        , label: 'cruiser-back'
    }
    , {
        img: ship3Middle
        , label: 'cruiser-middle'
    }
    , {
        img: ship3Front
        , label: 'cruiser-front'
    }
];

export const ship4Imgs: ShipImg[] = [
    {
        img: ship4Back
        , label: 'battleship-back'
    }
    , {
        img: ship4MiddleBack
        , label: 'battleship-middle-back'
    }
    , {
        img: ship4MiddleFront
        , label: 'battleship-middle-front'
    }
    , {
        img: ship4Front
        , label: 'battleship-front'
    }
];

export const ship5Imgs: ShipImg[] = [
    {
        img: ship5Back
        , label: 'carrier-back'
    }
    , {
        img: ship5MiddleBack
        , label: 'carrier-middle-back'
    }
    , {
        img: ship5Middle
        , label: 'carrier-middle'
    }
    , {
        img: ship5MiddleFront
        , label: 'carrier-middle-front'
    }
    , {
        img: ship5Front
        , label: 'carrier-front'
    }
];

export const shipImgSets = [ ship1Imgs, ship2Imgs, ship3Imgs, ship4Imgs, ship5Imgs ];

export const defaultShips: Ship[] = [
    {
        id: 'destroyer'
        , length: 2
        , hits: 0
        , isSunk: false
    }
    , {
        id: 'submarine'
        , length: 3
        , hits: 0
        , isSunk: false
    }
    , {
        id: 'cruiser'
        , length: 3
        , hits: 0
        , isSunk: false
    }
    , {
        id: 'battleship'
        , length: 4
        , hits: 0
        , isSunk: false
    }
    , {
        id: 'carrier'
        , length: 5
        , hits: 0
        , isSunk: false
    }
];

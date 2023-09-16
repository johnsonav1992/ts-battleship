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
import { Ship, ShipImg } from '../types/types';

export const ship1: ShipImg[] = [
    {
        img: ship1Back
        , label: 'ship1Back'
    }
    , {
        img: ship1Front
        , label: 'ship1Front'
    }
];

export const ship2: ShipImg[] = [
    {
        img: ship2Back
        , label: 'ship2Back'
    }
    , {
        img: ship2Middle
        , label: 'ship2Middle'
    }
    , {
        img: ship2Front
        , label: 'ship2Front'
    }
];

export const ship3: ShipImg[] = [
    {
        img: ship3Back
        , label: 'ship3Back'
    }
    , {
        img: ship3Middle
        , label: 'ship3Middle'
    }
    , {
        img: ship3Front
        , label: 'ship3Front'
    }
];

export const ship4: ShipImg[] = [
    {
        img: ship4Back
        , label: 'ship4Back'
    }
    , {
        img: ship4MiddleBack
        , label: 'ship4MiddleBack'
    }
    , {
        img: ship4MiddleFront
        , label: 'ship4MiddleFront'
    }
    , {
        img: ship4Front
        , label: 'ship4Front'
    }
];

export const ship5: ShipImg[] = [
    {
        img: ship5Back
        , label: 'ship5Back'
    }
    , {
        img: ship5MiddleBack
        , label: 'ship5MiddleBack'
    }
    , {
        img: ship5Middle
        , label: 'ship5Middle'
    }
    , {
        img: ship5MiddleFront
        , label: 'ship5MiddleFront'
    }
    , {
        img: ship5Front
        , label: 'ship5Front'
    }
];

export const shipImgSets = [ ship1, ship2, ship3, ship4, ship5 ];

export const defaultShips: Ship[] = [
    {
        id: 'destroyer'
        , length: 2
        , hits: 0
    }
    , {
        id: 'submarine'
        , length: 3
        , hits: 0
    }
    , {
        id: 'battleship'
        , length: 3
        , hits: 0
    }
    , {
        id: 'cruiser'
        , length: 4
        , hits: 0
    }
    , {
        id: 'carrier'
        , length: 5
        , hits: 0
    }
];

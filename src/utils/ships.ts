// Ship 1
import ship1Front from '../assets/ship1/front.png';
import ship1Back from '../assets/ship1/back.png';

// Ship 2
import ship2Front from '../assets/ship2/front.png';
import ship2Middle from '../assets/ship2/middle.png';
import ship2Back from '../assets/ship2/back.png';

// Types
import { ShipImg } from '../types/types';

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

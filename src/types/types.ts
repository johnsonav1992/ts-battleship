export type ShipImg = {
    img: string;
    label: `ship${ number }${ 'Front' | 'MiddleFront' | 'Middle' | 'MiddleBack' | 'Back' }`;
}

export type ShipConfig = {
    ship: ShipImg[];
    horizontal: boolean;
    forward: boolean;
}

export type BoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'vertical';
    direction: 'up' | 'down';
    status: 'none' | 'hit' | 'miss';
} | {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'horizontal';
    direction: 'left' | 'right';
    status: 'none' | 'hit' | 'miss';
}

export type CanPlaceShipsParams = {
    cellIndex: number,
    shipLength: number,
    cellsInRow: number,
    horizontal: boolean,
    forward: boolean
}

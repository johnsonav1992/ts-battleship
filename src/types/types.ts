export type ShipImg = {
    img: string;
    label: `ship${ number }${ 'Front' | 'MiddleFront' | 'Middle' | 'MiddleBack' | 'Back' }`;
}

export type BoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'horizontal' | 'vertical';
    direction: 'up' | 'down';
    status: 'none' | 'hit' | 'miss';
}

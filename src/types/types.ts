export type ShipImg = {
    img: string;
    label: `ship${ number }${ 'Front' | 'MiddleFront' | 'Middle' | 'MiddleBack' | 'Back' }`;
}

export type BoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    status: 'none' | 'hit' | 'miss';
}

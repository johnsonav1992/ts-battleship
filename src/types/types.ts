export type ShipImg = {
    img: string;
    label: `ship${ number }${ ShipPortion }`;
}

export type ShipPortion = 'Front' | 'MiddleFront' | 'Middle' | 'MiddleBack' | 'Back'

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

export type CanPlaceParams = {
    cellIndex: number
    , shipLength: number
    , cellsInRow: number
    , horizontal: boolean
    , forward: boolean
}

export type CheckOverlapParams = Omit<CanPlaceParams, 'cellsInRow'> & { updatedCells: BoardCell[] };

// STATE
export type GameState = {
    playerCells: BoardCell[];
    enemyCells: BoardCell[];
}

export type ReducerAction = { type: 'INCREMENT', payload: number };

export type ReducerFn = ( v: GameState, a?: ReducerAction | undefined ) => GameState

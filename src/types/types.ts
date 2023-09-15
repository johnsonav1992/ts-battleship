export type ShipImg = {
    img: string;
    label: `ship${ number }${ ShipPortion }`;
}

export type ShipPortion = 'Front' | 'MiddleFront' | 'Middle' | 'MiddleBack' | 'Back';

export type ShipConfig = {
    ship: ShipImg[];
    horizontal: boolean;
    forward: boolean;
}

export type DefaultBoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'none';
    direction: 'none';
    status: 'none';
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
} | DefaultBoardCell

export type CanPlaceParams = {
    cellIndex: number;
    shipLength: number;
    cellsInRow: number;
    horizontal: boolean;
    forward: boolean;
}

export type CheckOverlapParams = Omit<CanPlaceParams, 'cellsInRow'> & { updatedCells: BoardCell[] };

// STATE
export type GameState = {
    playerCells: BoardCell[];
    computerCells: BoardCell[];
}

export type ReducerAction =
    { type: 'SET_PLAYER_CELLS', payload: BoardCell[] }
    | { type: 'PLAYER_SHOT', payload: BoardCell['cellNum'] }

export type ReducerFn = ( v: GameState, a: ReducerAction ) => GameState;

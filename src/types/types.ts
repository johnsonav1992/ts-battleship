export type Ship = (
        { id: 'destroyer'; length: 2; hits: 0 | 1 | 2 }
        | { id: 'submarine'; length: 3; hits: 0 | 1 | 2 | 3 }
        | { id: 'cruiser'; length: 3; hits: 0 | 1 | 2 | 3 }
        | { id: 'battleship'; length: 4; hits: 0 | 1 | 2 | 3 | 4 }
        | { id: 'carrier'; length: 5; hits: 0 | 1 | 2 | 3 | 4 | 5 }
    ) & { isSunk: boolean };

export type ShipImg = {
    img: string;
    label: `${ Ship['id'] }-${ ShipPortion }`;
};

export type ShipPortion = 'front' | 'middle-front' | 'middle' | 'middle-back' | 'back';

export type ShipCellConfig = {
    shipImgSet: ShipImg[];
    horizontal: boolean;
    forward: boolean;
};

export type BoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'vertical' | 'none';
    direction: 'up' | 'down' | 'none';
    status: 'none' | 'hit' | 'miss';
} | {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'horizontal' | 'none';
    direction: 'left' | 'right' | 'none';
    status: 'none' | 'hit' | 'miss';
};

export type CanPlaceParams = {
    cellIndex: number;
    shipLength: number;
    cellsInRow: number;
    horizontal: boolean;
    forward: boolean;
};

export type CheckOverlapParams = Omit<CanPlaceParams, 'cellsInRow'> & { updatedCells: BoardCell[] };

// STATE
export type GameState = {
    playerCells: BoardCell[];
    computerCells: BoardCell[];
    computerShips: Ship[];
    playerShips: Ship[];
    playerAttemptedCells: BoardCell['cellNum'][];
    computerAttemptedCells: BoardCell['cellNum'][];
    alertText: string;
    currentTurn: 'player' | 'computer';
    currentScreen: 'start' | 'game';
    gameMode: 'easy' | 'medium' | 'hard';
    isModalOpen: boolean;
    isGameOver: boolean;
    winner: 'player' | 'computer' | '';
    computerAI: ComputerAI;
};

export type ComputerAI = {
    lastShot: {
        cellNum: BoardCell['cellNum'] | null;
        wasHit: boolean;
    };
    sunkShip: boolean;
    heatMapCells: HeatMapCell[];
};

export type HeatMapCell = {
    cellNum: BoardCell['cellNum'];
    heatValue: number;
};

export type ReducerAction =
    { type: 'SET_PLAYER_CELLS'; payload: BoardCell[] }
    | { type: 'SET_COMPUTER_CELLS'; payload: BoardCell[] }
    | { type: 'PLAYER_SHOT'; payload: BoardCell['cellNum'] }
    | { type: 'COMPUTER_SHOT'; payload: BoardCell['cellNum'] }
    | { type: 'COMPUTER_AI_SHOT' }
    | { type: 'SET_SCREEN'; payload: GameState['currentScreen'] }
    | { type: 'SET_MODAL_OPEN'; payload: GameState['isModalOpen'] }
    | { type: 'SET_GAME_OVER'; payload: GameState['isGameOver'] }
    | { type: 'RESET_GAME' };

export type ReducerFn = ( v: GameState, a: ReducerAction ) => GameState;

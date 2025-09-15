////// SHIPS //////
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

////// BOARD //////
export type BoardCell = {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'vertical' | 'none';
    direction: 'up' | 'down' | 'none';
    status: 'none' | 'hit' | 'miss' | 'sunk';
} | {
    shipImg: ShipImg | null;
    cellNum: number;
    orientation: 'horizontal' | 'none';
    direction: 'left' | 'right' | 'none';
    status: 'none' | 'hit' | 'miss' | 'sunk';
};

export type CanPlaceParams = {
    cellIndex: number;
    shipLength: number;
    cellsInRow: number;
    horizontal: boolean;
    forward: boolean;
};

export type CheckOverlapParams = Omit<CanPlaceParams, 'cellsInRow'> & { updatedCells: BoardCell[] };

////// STATE //////
export type GameState = {
    playerCells: BoardCell[];
    computerCells: BoardCell[];
    computerShips: Ship[];
    playerShips: Ship[];
    playerShipPlacement: 'random' | 'drag-n-drop' | null;
    playerAttemptedCells: BoardCell['cellNum'][];
    computerAttemptedCells: BoardCell['cellNum'][];
    alertText: string;
    currentTurn: 'player' | 'computer';
    currentScreen: 'start' | 'game';
    gameMode: 'easy' | 'medium' | 'hard';
    isModalOpen: boolean;
    showHeatMap: boolean;
    isGameOver: boolean;
    winner: 'player' | 'computer' | '';
    computerAI: ComputerAI;
};

export type ComputerAI = {
    lastShot: {
        cellNum: BoardCell['cellNum'] | null;
        wasHit: boolean;
    };
    heatMapCells: HeatMapCell[];
    targetStack: BoardCell['cellNum'][];
    huntingMode: 'hunting' | 'targeting';
    currentTarget: {
        hits: BoardCell['cellNum'][];
        direction: 'horizontal' | 'vertical' | 'unknown';
        potentialTargets: BoardCell['cellNum'][];
        possibleShipLengths: number[];
        suspectedMultipleShips: boolean;
    } | null;
    multipleTargets: Array<{
        hits: BoardCell['cellNum'][];
        direction: 'horizontal' | 'vertical' | 'unknown';
        potentialTargets: BoardCell['cellNum'][];
        possibleShipLengths: number[];
    }>;
    shipConstraints: {
        remainingShips: { [key: string]: number };
        impossibleCells: BoardCell['cellNum'][];
        certainCells: BoardCell['cellNum'][];
    };
    difficulty: 'easy' | 'medium' | 'hard';
};

export type HeatMapCell = {
    cellNum: BoardCell['cellNum'];
    heatValue: number;
};

export type ReducerAction =
    { type: 'SET_CELLS'; payload: { playerCells?: BoardCell[]; computerCells: BoardCell[] } }
    | { type: 'SET_PLAYER_SHIP_PLACEMENT'; payload: GameState['playerShipPlacement'] }
    | { type: 'PLAYER_SHOT'; payload: BoardCell['cellNum'] }
    | { type: 'COMPUTER_SHOT'; payload: BoardCell['cellNum'] }
    | { type: 'COMPUTER_AI_SHOT' }
    | { type: 'SET_SCREEN'; payload: GameState['currentScreen'] }
    | { type: 'SET_GAME_MODE'; payload: GameState['gameMode'] }
    | { type: 'SET_MODAL_OPEN'; payload: GameState['isModalOpen'] }
    | { type: 'TOGGLE_HEAT_MAP' }
    | { type: 'SET_GAME_OVER'; payload: GameState['isGameOver'] }
    | { type: 'RESET_GAME' };

export type ReducerFn = ( v: GameState, a: ReducerAction ) => GameState;

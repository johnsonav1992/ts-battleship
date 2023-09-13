import { Card, Grid, Sheet, Stack } from '@mui/joy';
import { pxrem } from './utils/pxrem';
import { SxProps } from '@mui/joy/styles/types';
import Cell from './Components/Cell/Cell';
import { BoardCell, ShipImg } from './types/types';
import { ship1, ship2 } from './utils/ships';

function App () {

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

    const dummyCells: BoardCell[] = Array( 100 ).fill( null ).map( ( _cell, idx ) => {
        const cellNum = idx + 1;

        return {
            shipImg: null
            , cellNum
            , status: 'none'
            , orientation: 'horizontal'
            , direction: 'up'
        };
    } );

    // Define your ships, including ship length, orientation (horizontal: true, vertical: false), and direction (up: true, down: false)
    const ships: { ship: ShipImg[], horizontal: boolean, up: boolean }[] = [
        { ship: ship1, horizontal: true, up: false } // Horizontal ship
        , { ship: ship2, horizontal: false, up: true } // Vertical ship going up
    // Add more ships as needed with their orientations and directions
    ];

    // Create a copy of dummyCells to maintain immutability
    const updatedCells = [ ...dummyCells ];

    // Function to check if a ship can fit in a given cell without wrapping around (horizontal or vertical)
    function canPlaceShip ( cellIndex: number, shipLength: number, cellsInRow: number, horizontal: boolean, up: boolean ): boolean {
        if ( horizontal ) {
            const rowStartIndex = Math.floor( cellIndex / cellsInRow ) * cellsInRow;
            const rowEndIndex = rowStartIndex + cellsInRow - 1;
            const shipEndIndex = cellIndex + shipLength - 1;

            return shipEndIndex <= rowEndIndex;
        } else {
            if ( up ) {
                return cellIndex >= ( shipLength - 1 ) * cellsInRow;
            } else {
                return cellIndex + ( shipLength - 1 ) * cellsInRow < 100;
            }
        }
    }

    // Iterate through ships and assign images to cells in an immutable way
    for ( const { ship, horizontal, up } of ships ) {
        const shuffledCells = [ ...updatedCells ].sort( () => Math.random() - 0.5 );
        for ( const cell of shuffledCells ) {
            if ( cell.shipImg === null && canPlaceShip( cell.cellNum - 1, ship.length, 10, horizontal, up ) ) {
                for ( let i = 0; i < ship.length; i++ ) {
                    const cellIndex = horizontal ? cell.cellNum - 1 + i : ( up ? cell.cellNum - 1 - i * 10 : cell.cellNum - 1 + i * 10 );
                    const newCell: BoardCell = {
                        ...updatedCells[ cellIndex ]
                        , shipImg: ship[ i ]
                        , orientation: horizontal ? 'horizontal' : 'vertical'
                        , direction: up ? 'up' : 'down'
                    };
                    updatedCells[ cellIndex ] = newCell;
                }
                break; // Move on to the next ship
            }
        }
    }

    // Now, updatedCells should contain your game board with ships placed randomly, including both horizontal and vertical ships with orientation and direction properties from dummyCells, without wrapping around the board edges in an immutable way.

    console.log( updatedCells );

    return (
        <Sheet
            sx={ {
                width: '100%'
                , height: '100vh'
                , bgcolor: theme => theme.palette.background.level3
                , p: '1rem'
            } }
        >
            <Stack
                direction='row'
                alignItems='center'
                justifyContent='center'
                height='100%'
                gap='1rem'
            >
                <Card sx={ sharedCardStyles }>
                    <Grid container>
                        {
                            updatedCells.map( cell => (
                                <Cell
                                    key={ cell.cellNum }
                                    cell={ cell }
                                />
                            ) )
                        }
                    </Grid>
                </Card>
                <Card sx={ sharedCardStyles }>
                    <Grid container>
                        {
                            dummyCells.map( cell => (
                                <Cell
                                    key={ cell.cellNum }
                                    cell={ cell }
                                />
                            ) )
                        }
                    </Grid>
                </Card>
            </Stack>
        </Sheet>
    );
}

export default App;

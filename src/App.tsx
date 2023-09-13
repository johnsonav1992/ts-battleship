import { Card, Grid, Sheet, Stack } from '@mui/joy';
import { pxrem } from './utils/pxrem';
import { SxProps } from '@mui/joy/styles/types';
import Cell from './Components/Cell/Cell';
import { BoardCell, ShipImg } from './types/types';
import { ship1, ship2 } from './utils/ships';
import { buildBoardCells } from './utils/buildBoardCells';

function App () {

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

    const emptyCells: BoardCell[] = Array( 100 ).fill( null ).map( ( _cell, idx ) => {
        const cellNum = idx + 1;

        return {
            shipImg: null
            , cellNum
            , status: 'none'
            , orientation: 'horizontal'
            , direction: 'right'
        };
    } );

    const cells = buildBoardCells();

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
                            cells.map( cell => (
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
                            emptyCells.map( cell => (
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

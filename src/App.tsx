import { Card, Grid, Sheet, Stack } from '@mui/joy';
import { pxrem } from './utils/pxrem';
import { SxProps } from '@mui/joy/styles/types';
import Cell from './Components/Cell/Cell';
import { BoardCell } from './types/types';
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

        const ship1Placement = cellNum === 1 || cellNum === 2;
        const ship2Placement = cellNum === 7 || cellNum === 8 || cellNum === 9;

        return {
            ship: ship1Placement
                ? ship1
                : ship2Placement
                    ? ship2
                    : null
            , cellNum
            , status: 'none'
        };
    } );

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
                            dummyCells.map( cell => (
                                <Cell
                                    key={ cell.cellNum }
                                    cellNum={ cell.cellNum }
                                    ship={ cell.ship }
                                    cellStatus={ cell.status }
                                />
                            ) )
                        }
                    </Grid>
                </Card>
                <Card sx={ sharedCardStyles }>
                    <Grid container>
                        { /* {
                            dummyCells.map( cell => (
                                <Cell
                                    key={ cell.cellNum }
                                    cellNum={ cell.cellNum }
                                    ship={ cell.ship }
                                    cellStatus={ cell.status }
                                />
                            ) )
                        } */ }
                    </Grid>
                </Card>
            </Stack>
        </Sheet>
    );
}

export default App;

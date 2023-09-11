import { Card, Grid, Sheet, Stack } from '@mui/joy';
import { pxrem } from './utils/pxrem';
import { SxProps } from '@mui/joy/styles/types';
import Cell from './Components/Cell/Cell';
import { ship1, ship5 } from './utils/ships';

function App () {

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

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
                            Array( 100 ).fill( null ).map( ( _, idx ) => (
                                <Cell
                                    key={ idx }
                                    cellNum={ idx + 1 }
                                    ship={ ( idx + 1 ) <= 2 ? ship1 : undefined }
                                    cellStatus={ ( idx + 1 ) <= 2 ? 'hit' : 'none' }
                                />
                            ) )
                        }
                    </Grid>
                </Card>
                <Card sx={ sharedCardStyles }>
                    <Grid container>
                        {
                            Array( 100 ).fill( null ).map( ( _, idx ) => (
                                <Cell
                                    key={ idx }
                                    cellNum={ idx + 1 }
                                    ship={ ( idx + 1 ) <= 5 ? ship5 : undefined }
                                    cellStatus={ ( idx + 1 ) <= 5 ? 'hit' : 'none' }
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

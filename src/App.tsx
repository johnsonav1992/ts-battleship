// MUI
import {
    Card
    , Grid
    , Sheet
    , Stack
} from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

// Components
import Cell from './Components/Cell/Cell';

// Utils
import { pxrem } from './utils/pxrem';
import { buildBoardCells } from './utils/buildBoardCells';

function App () {

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

    const playerCells = buildBoardCells();
    const computerCells = buildBoardCells();

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
                            playerCells.map( cell => (
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
                            computerCells.map( cell => (
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

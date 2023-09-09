import { Card, Sheet, Stack } from '@mui/joy';
import { pxrem } from './utils/pxrem';
import { SxProps } from '@mui/joy/styles/types';

function App () {

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , height: pxrem( 500 )
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
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
                <Card
                    sx={ sharedCardStyles }
                >
                    hey
                </Card>
                <Card
                    sx={ sharedCardStyles }
                >
                    hey
                </Card>
            </Stack>
        </Sheet>
    );
}

export default App;

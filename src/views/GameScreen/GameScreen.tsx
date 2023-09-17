// MUI
import {
    Card
    , Grid
    , Stack
} from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

// Components
import Cell from '../../components/Cell/Cell';

// State
import { useBattleShipState } from '../../state/jotai';

// Utils
import { pxrem } from '../../utils/pxrem';
import SnackAlert from '../../components/SnackAlert/SnackAlert';
import { useEffect } from 'react';
import { takeComputerShot } from '../../utils/gameUtils';

interface Props {

}

const GameScreen = ( {}: Props ) => {
    const [ {
        playerCells
        , computerCells
        , alertText
        , currentTurn
        , computerAttemptedCells
    }, dispatch ] = useBattleShipState();

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

    useEffect( () => {
        if ( currentTurn === 'computer' ) {
            takeComputerShot( dispatch, computerAttemptedCells );
        }
    }, [ currentTurn ] );

    return (
        <Stack
            direction='row'
            alignItems='center'
            justifyContent='center'
            height='100%'
            width='100%'
            gap='1rem'
        >
            <Card sx={ sharedCardStyles }>
                <Grid container>
                    {
                        playerCells.map( cell => (
                            <Cell
                                key={ cell.cellNum }
                                cell={ cell }
                                isPlayer
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
            {
                alertText
                && ( <SnackAlert text={ alertText }/> )
            }
        </Stack>
    );
};

export default GameScreen;

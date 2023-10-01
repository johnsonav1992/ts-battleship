import { useEffect } from 'react';

// MUI
import {
    Card
    , Grid
    , Stack
    , Typography
} from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

// Components
import Cell from '../../Components/Cell/Cell';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import GameTitle from '../../Components/GameTitle/GameTitle';
import GameModal from '../../Components/GameModal/GameModal';

// State
import { useBattleShipState } from '../../state/jotai';

// Utils
import { pxrem } from '../../utils/pxrem';
import { takeComputerShot } from '../../utils/gameUtils';

const GameScreen = () => {
    const [ {
        playerCells
        , computerCells
        , alertText
        , currentTurn
        , computerAttemptedCells
        , isGameOver
        , gameMode
        , computerAI: {
            targetStack
        }
    }, dispatch ] = useBattleShipState();

    console.log( { targetStack } );

    const sharedCardStyles: SxProps = {
        width: pxrem( 500 )
        , aspectRatio: 1
        , border: theme => `${ pxrem( 8 ) } solid ${ theme.palette.neutral[ 400 ] }`
        , bgcolor: theme => theme.palette.primary[ 200 ]
        , p: pxrem( 8 )
    };

    useEffect( () => {
        if ( currentTurn === 'computer' && gameMode === 'easy' ) {
            takeComputerShot( dispatch, 'easy', computerAttemptedCells );
        } else if ( currentTurn === 'computer' && gameMode === 'medium' ) {
            takeComputerShot( dispatch, 'medium' );
        }
    }, [ currentTurn, gameMode ] );

    useEffect( () => {
        if ( isGameOver ) {
            setTimeout( () => {
                dispatch( {
                    type: 'SET_MODAL_OPEN'
                    , payload: true
                } );
            }, 1500 );
        }
    }, [ isGameOver ] );

    return (
        <>
            <GameTitle />
            <Stack>
                <Typography
                    level='body-xs'
                    sx={ { color: theme => theme.palette.common.black } }
                >
                    { currentTurn === 'computer' ? 'Computer Thinking...' : 'Your turn!' }
                </Typography>
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
                && ( <SnackAlert text={ alertText } /> )
                    }
                </Stack>
            </Stack>
            <GameModal />
        </>
    );
};

export default GameScreen;

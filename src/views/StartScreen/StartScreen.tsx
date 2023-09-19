// MUI
import {
    Box
    , Button
    , Card
    , Stack
} from '@mui/joy';

// Assets
import battleshipHeroImage from '../../assets/battleship-hero.png';

// Components
import GameTitle from '../../components/GameTitle/GameTitle';

// Utils
import { pxrem } from '../../utils/pxrem';

// State
import { useBattleShipState } from '../../state/jotai';

const StartScreen = () => {
    const [ state, dispatch ] = useBattleShipState();

    const handleStartGame = () => {
        dispatch( {
            type: 'SET_SCREEN'
            , payload: 'game'
        } );
    };
    return (
        <Card
            variant='soft'
            sx={ {
                width: '60%'
                , height: '70vh'
                , boxShadow: theme => `${ pxrem( 0, 5, 20 ) } ${ theme.palette.neutral[ 800 ] }`
            } }
        >
            <Stack
                justifyContent='space-between'
                sx={ {
                    height: '100%'
                    , width: '100%'
                    , zIndex: 1
                    , '::after': {
                        content: '""'
                        , backgroundImage: `url(${ battleshipHeroImage })`
                        , backgroundPosition: `bottom ${ pxrem( -30 ) } right ${ pxrem( -10 ) }`
                        , backgroundSize: '50%'
                        , backgroundRepeat: 'no-repeat'
                        , position: 'absolute'
                        , top: 0
                        , right: 0
                        , bottom: 0
                        , left: 0
                        , opacity: 0.85
                        , zIndex: -1
                    }
                } }
            >
                <Box
                    sx={ {
                        p: pxrem( 32 )
                        , width: '100%'
                    } }
                >
                    <GameTitle isTitleScreen />
                </Box>
                <Button
                    sx={ {
                        width: '30%'
                        , height: '15%'
                        , ml: pxrem( 16 )
                        , mb: pxrem( 16 )
                        , fontSize: pxrem( 32 )
                    } }
                    onClick={ handleStartGame }
                >
                    Play Game
                </Button>
            </Stack>
        </Card>
    );
};

export default StartScreen;

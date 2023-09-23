// MUI
import {
    Box
    , Button
    , Card
    , Stack
} from '@mui/joy';

// Assets
import battleshipHeroImage from '../../assets/battleship-hero.png';
import explosion from '../../assets/explosion.png';

// Components
import GameTitle from '../../Components/GameTitle/GameTitle';

// Utils
import { pxrem } from '../../utils/pxrem';

// State
import { useBattleShipState } from '../../state/jotai';

const StartScreen = () => {
    const [ , dispatch ] = useBattleShipState();

    const handleStartGame = () => {
        dispatch( {
            type: 'SET_SCREEN'
            , payload: 'game'
        } );

        dispatch( {
            type: 'SET_MODAL_OPEN'
            , payload: true
        } );
    };

    return (
        <Card
            sx={ {
                width: '80%'
                , height: '80vh'
                , boxShadow: theme => `${ pxrem( 0, 5, 20 ) } ${ theme.palette.neutral[ 800 ] }`
                , backgroundColor: theme => theme.palette.neutral[ 400 ]
                , borderColor: theme => theme.palette.neutral[ 800 ]
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
                        , backgroundImage:
                            `url(${ battleshipHeroImage })
                            , url(${ explosion })`
                        , backgroundPosition:
                            `bottom ${ pxrem( -30 ) } right ${ pxrem( -10 ) }
                            , bottom ${ pxrem( -100 ) } left ${ pxrem( -280 ) }`
                        , backgroundSize: '50%, 100%'
                        , backgroundRepeat: 'no-repeat'
                        , position: 'absolute'
                        , top: 0
                        , right: 0
                        , bottom: 0
                        , left: 0
                        , opacity: 0.85
                        , zIndex: -1
                        , borderBottomRightRadius: pxrem( 8 )
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

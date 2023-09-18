import {
    Box
    , Button
    , Card
    , Stack
} from '@mui/joy';
import battleshipHeroImage from '../../assets/battleship-hero.png';
import { pxrem } from '../../utils/pxrem';

const StartScreen = () => {
    return (
        <Card
            variant='soft'
            sx={ {
                width: '50%'
                , height: '400px'
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
                        width: '50%'
                        , height: '50%'
                    } }
                />
                <Button
                    sx={ {
                        width: '30%'
                        , height: '15%'
                        , ml: pxrem( 16 )
                        , mb: pxrem( 16 )
                        , fontSize: pxrem( 28 )
                    } }
                >
                    Play Game
                </Button>
            </Stack>
        </Card>
    );
};

export default StartScreen;

// MUI
import {
    Sheet
    , Stack
} from '@mui/joy';

// Components
import GameScreen from './views/GameScreen/GameScreen';
import StartScreen from './views/StartScreen/StartScreen';

// State
import { useBattleShipState } from './state/jotai';

const App = () => {
    const [ { currentScreen } ] = useBattleShipState();

    return (
        <Sheet
            sx={ {
                width: '100%'
                , height: '100vh'
                , bgcolor: theme => theme.palette.background.tooltip
                , p: '1rem'
            } }
        >
            <Stack
                alignItems='center'
                justifyContent='center'
                height='100%'
                gap='1rem'
            >
                {
                    currentScreen === 'start'
                        ? <StartScreen />
                        : <GameScreen />
                }
            </Stack>
        </Sheet>
    );
};

export default App;

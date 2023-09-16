// MUI
import { Sheet, Stack } from '@mui/joy';

// Components
import GameScreen from './views/GameScreen/GameScreen';
import GameTitle from './components/GameTitle/GameTitle';

function App () {

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
                alignItems='center'
                gap='1rem'
            >
                <GameTitle />
                <GameScreen />
            </Stack>
        </Sheet>
    );
}

export default App;

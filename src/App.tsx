// MUI
import { Sheet } from '@mui/joy';

// Components
import GameScreen from './views/GameScreen/GameScreen';

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
            <GameScreen />
        </Sheet>
    );
}

export default App;

// MUI
import {
    Button
    , Stack
    , Typography
} from '@mui/joy';

// Components
import Image from '../Image/Image';

// Assets
import explosion from '../../assets/explosion.png';

// State
import { useBattleShipState } from '../../state/jotai';

const EndGameModalContent = () => {
    const [ { winner }, dispatch ] = useBattleShipState();

    const handleResetGame = () => {
        dispatch( { type: 'RESET_GAME' } );
    };

    return (
        <Stack alignItems='center'>
            <Typography level='h1'>
                Game Over!
            </Typography>
            <Typography level='h3'>
                { winner === 'computer' ? 'The Computer won!' : 'You won!' }
            </Typography>
            <Image
                src={ explosion }
                width='100%'
            />
            <Button onClick={ handleResetGame }>
                Play Again!
            </Button>
        </Stack>
    );
};

export default EndGameModalContent;

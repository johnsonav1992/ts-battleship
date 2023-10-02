// MUI
import {
    Box
    , Button
    , Stack
    , Tooltip
    , Typography
} from '@mui/joy';

// State
import { useBattleShipState } from '../../state/jotai';

// Utils
import { pxrem } from '../../utils/pxrem';
import { buildBoardCells } from '../../utils/buildBoardCells';

const PlaceShipsModalContent = () => {

    const [ , dispatch ] = useBattleShipState();

    const handleSetPlayerCells = () => {
        dispatch( {
            type: 'SET_PLAYER_CELLS'
            , payload: buildBoardCells()
        } );

        dispatch( {
            type: 'SET_COMPUTER_CELLS'
            , payload: buildBoardCells()
        } );

        dispatch( {
            type: 'SET_MODAL_OPEN'
            , payload: false
        } );
    };

    return (
        <Stack
            justifyContent='space-between'
            alignItems='center'
            flexGrow={ .5 }
        >
            <Typography level='h3'>
                How do you want to place your ships?
            </Typography>
            <Stack
                direction='row'
                gap={ pxrem( 16 ) }
            >
                <Button
                    sx={ { minHeight: pxrem( 60 ) } }
                    onClick={ handleSetPlayerCells }
                >
                    Place For me! (Random)
                </Button>
                <Tooltip
                    title='This feature is not ready yet. Stay tuned!'
                    arrow
                >
                    <Box>
                        <Button
                            disabled
                            sx={ { minHeight: pxrem( 60 ) } }
                        >
                            { 'I\'ll place them!' }
                        </Button>
                    </Box>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

export default PlaceShipsModalContent;

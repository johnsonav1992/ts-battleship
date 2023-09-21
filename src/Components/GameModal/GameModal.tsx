// MUI
import {
    Box
    , Button
    , Modal
    , ModalDialog
    , Stack
    , Tooltip
    , Typography
} from '@mui/joy';

// Utils
import { pxrem } from '../../utils/pxrem';
import { buildBoardCells } from '../../utils/buildBoardCells';

// State
import { useBattleShipState } from '../../state/jotai';

const GameModal = () => {
    const [ {
        isModalOpen
        , isGameOver
    }, dispatch ] = useBattleShipState();

    const handleSetPlayerCells = () => {
        dispatch( {
            type: 'SET_PLAYER_CELLS'
            , payload: buildBoardCells()
        } );

        dispatch( {
            type: 'SET_MODAL_OPEN'
            , payload: false
        } );
    };

    return (
        <Modal open={ isModalOpen }>
            <ModalDialog
                sx={ {
                    minHeight: pxrem( 300 )
                    , maxWidth: pxrem( 400 )
                    , p: pxrem( 32 )
                    , backgroundColor: theme => theme.palette.neutral[ 300 ]
                    , borderColor: theme => theme.palette.neutral[ 300 ]
                } }
            >
                {
                    isGameOver
                        ? (
                            <Typography>
                                Game over!
                            </Typography>
                        )
                        : (
                            <Stack
                                justifyContent='space-between'
                                alignItems='center'
                                flexGrow={ .5 }
                            >
                                <Typography level='h3'>How do you want to place your ships?</Typography>
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
                        )
                }
            </ModalDialog>
        </Modal>
    );
};

export default GameModal;

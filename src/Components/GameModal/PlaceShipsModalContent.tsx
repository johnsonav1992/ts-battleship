// MUI
import {
    Box
    , Button
    , Divider
    , FormLabel
    , Radio
    , RadioGroup
    , Sheet
    , Stack
    , Tooltip
    , Typography
    , radioClasses
} from '@mui/joy';

// State
import { useBattleShipState } from '../../state/jotai';

// Utils
import { pxrem } from '../../utils/pxrem';
import { buildBoardCells } from '../../utils/buildBoardCells';

const PlaceShipsModalContent = () => {

    const [ , dispatch ] = useBattleShipState();

    const difficulties = [ 'Easy', 'Medium', 'Hard' ];

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
            gap={ pxrem( 20 ) }
        >
            <Stack gap={ pxrem( 8 ) }>
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
            <Divider />
            <Stack
                gap={ pxrem( 8 ) }
                width='100%'
            >
                <Typography level='h4'>
                    Select Game Difficulty
                </Typography>
                <Stack
                    direction='row'
                    gap={ pxrem( 16 ) }
                    width='100%'
                    justifyContent='space-between'
                >
                    <RadioGroup
                        defaultValue='Medium'
                        overlay
                        name='difficulty'
                        sx={ {
                            flexDirection: 'row'
                            , gap: 2
                            , width: '100%'
                            , [ `& .${ radioClasses.checked }` ]: {
                                [ `& .${ radioClasses.action }` ]: {
                                    inset: -3
                                    , border: `${ pxrem( 3 ) } solid`
                                    , borderColor: 'common.white'
                                }
                            }
                            , [ `& .${ radioClasses.icon }` ]: {
                                display: 'none'
                            }
                            , [ `& .${ radioClasses.radio }` ]: {
                                display: 'contents'
                            }
                        } }
                    >
                        {
                            difficulties.map( value => (
                                <Sheet
                                    key={ value }
                                    variant='outlined'
                                    sx={ {
                                        borderRadius: 'md'
                                        , boxShadow: 'sm'
                                        , display: 'flex'
                                        , flexDirection: 'column'
                                        , alignItems: 'center'
                                        , width: '100%'
                                        , gap: 1.5
                                        , p: 2
                                        , bgcolor: 'primary.500'
                                    } }
                                >
                                    <Radio
                                        id={ value }
                                        value={ value }
                                    />
                                    <FormLabel
                                        htmlFor={ value }
                                        sx={ {
                                            color: 'common.white'
                                            , fontWeight: 'bold'
                                        } }
                                    >
                                        { value }
                                    </FormLabel>
                                </Sheet>
                            ) )
                        }
                    </RadioGroup>
                    { /* <Stack
                        direction='row'
                        justifyContent='center'
                        alignItems='center'
                        sx={ {
                            border: '1px solid red'
                            , p: pxrem( 16 )
                        } }
                    >
                        <Radio />
                        <Typography>
                            Easy
                        </Typography>
                    </Stack>
                    <Button
                        sx={ { minHeight: pxrem( 60 ) } }
                    >
                        Medium
                    </Button>
                    <Tooltip
                        title='This difficulty is not ready yet. Stay tuned!'
                        arrow
                    >
                        <Box>
                            <Button
                                disabled
                                sx={ { minHeight: pxrem( 60 ) } }
                            >
                                Hard
                            </Button>
                        </Box>
                    </Tooltip> */ }
                </Stack>
            </Stack>
            <Divider />
            <Button fullWidth>
                PLAY GAME!
            </Button>
        </Stack>
    );
};

export default PlaceShipsModalContent;

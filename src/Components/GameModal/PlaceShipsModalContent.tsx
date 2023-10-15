// Libraries
import { capitalize } from 'string-ts';

// MUI
import {
    Button
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

// Types
import { GameState } from '../../types/types';

const PlaceShipsModalContent = () => {

    const [ {
        gameMode
        , playerShipPlacement
    }, dispatch ] = useBattleShipState();

    const difficulties = [ 'easy', 'medium', 'hard' ] as const;
    const shipPlacementOptions = [ 'Place for me! (Random)', 'I\'ll place them!' ] as const;

    const handleStartGame = () => {
        dispatch( {
            type: 'SET_CELLS'
            , payload: {
                playerCells: buildBoardCells()
                , computerCells: buildBoardCells()
            }
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
                    <RadioGroup
                        overlay
                        name='difficulty'
                        value={ playerShipPlacement }
                        onChange={ e => dispatch( {
                            type: 'SET_PLAYER_SHIP_PLACEMENT'
                            , payload: e.target.value.includes( 'Drag' ) ? 'drag-n-drop' : 'random'
                        } )
                        }
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
                            shipPlacementOptions.map( value => (
                                <Tooltip
                                    key={ value }
                                    title={ value.includes( 'I' ) ? 'This feature is not ready yet. Stay tuned!' : '' }
                                >
                                    <Sheet
                                        variant='outlined'
                                        sx={ {
                                            borderRadius: 'md'
                                            , boxShadow: 'sm'
                                            , display: 'flex'
                                            , flexDirection: 'column'
                                            , alignItems: 'center'
                                            , justifyContent: 'center'
                                            , width: '100%'
                                            , p: pxrem( 8 )
                                            , bgcolor: value.includes( 'I' ) ? 'neutral.400' : 'primary.500'
                                        } }
                                    >
                                        <Radio
                                            id={ value }
                                            value={ value.includes( 'Place' ) ? 'random' : 'drag-n-drop' }
                                            disabled={ value.includes( 'I' ) }
                                        />
                                        <FormLabel
                                            htmlFor={ value }
                                            sx={ {
                                                color: 'common.white'
                                                , fontWeight: 'bold'
                                                , textAlign: 'center'
                                            } }
                                        >
                                            { value }
                                        </FormLabel>
                                    </Sheet>
                                </Tooltip>
                            ) )
                        }
                    </RadioGroup>
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
                        overlay
                        name='difficulty'
                        value={ gameMode }
                        onChange={ e => dispatch( {
                            type: 'SET_GAME_MODE'
                            , payload: e.target.value as GameState['gameMode']
                        } ) }
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
                                <Tooltip
                                    key={ value }
                                    title={ value === 'hard' ? 'This difficulty is not ready yet. Stay tuned!' : '' }
                                >
                                    <Sheet
                                        variant='outlined'
                                        sx={ {
                                            borderRadius: 'md'
                                            , boxShadow: 'sm'
                                            , display: 'flex'
                                            , flexDirection: 'column'
                                            , alignItems: 'center'
                                            , width: '100%'
                                            , p: pxrem( 16 )
                                            , bgcolor: value === 'hard' ? 'neutral.400' : 'primary.500'

                                        } }
                                    >
                                        <Radio
                                            id={ value }
                                            value={ value }
                                            disabled={ value === 'hard' }
                                        />
                                        <FormLabel
                                            htmlFor={ value }
                                            sx={ {
                                                color: 'common.white'
                                                , fontWeight: 'bold'
                                            } }
                                        >
                                            { capitalize( value ) }
                                        </FormLabel>
                                    </Sheet>
                                </Tooltip>
                            ) )
                        }
                    </RadioGroup>
                </Stack>
            </Stack>
            <Divider />
            <Button
                fullWidth
                onClick={ handleStartGame }
            >
                PLAY GAME!
            </Button>
        </Stack>
    );
};

export default PlaceShipsModalContent;

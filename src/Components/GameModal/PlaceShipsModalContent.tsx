import { useState } from 'react';

// Libraries
import { capitalize } from 'string-ts';

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
    , ToggleButtonGroup
    , Tooltip
    , Typography
    , radioClasses
} from '@mui/joy';

// State
import { useBattleShipState } from '../../state/jotai';

// Utils
import { pxrem } from '../../utils/pxrem';
import { buildBoardCells } from '../../utils/buildBoardCells';
import { GameState } from '../../types/types';

const PlaceShipsModalContent = () => {

    const [ { gameMode }, dispatch ] = useBattleShipState();
    const [ playerCellMode, setPlayerCellMode ] = useState<'random' | 'pick' | null>( null );

    const difficulties = [ 'easy', 'medium', 'hard' ] as const;

    const setPlayerCells = () => {
        dispatch( {
            type: 'SET_PLAYER_CELLS'
            , payload: buildBoardCells()
        } );
    };

    const handleStartGame = () => {
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
                    <ToggleButtonGroup
                        variant='solid'
                        color='primary'
                        spacing='1rem'
                        value={ playerCellMode }
                        onChange={ ( _e, value ) => {
                            setPlayerCellMode( value );
                            if ( value === 'random' ) setPlayerCells();
                        } }

                    >
                        <Button
                            sx={ { minHeight: pxrem( 60 ) } }
                            value='random'
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
                                    value='pick'
                                >
                                    { 'I\'ll place them!' }
                                </Button>
                            </Box>
                        </Tooltip>
                    </ToggleButtonGroup>
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
                                            , gap: 1.5
                                            , p: 2
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

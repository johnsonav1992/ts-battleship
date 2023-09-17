// MUI
import { Box } from '@mui/joy';

// Components
import Image from '../Image/Image';
import ShotMarker from '../ShotMarker/ShotMarker';

// Types
import { BoardCell } from '../../types/types';

// Utils
import { pxrem } from '../../utils/pxrem';

// Assets
import crosshair from '../../assets/crosshair.png';

// State
import { useBattleShipState } from '../../state/jotai';

interface Props {
    cell: BoardCell;
    isPlayer?: boolean;
}

const Cell = (
    { cell: {
        cellNum
        , status
        , shipImg
        , direction
        , orientation
    }
    , isPlayer
    }: Props ) => {
    const [ {
        playerAttemptedCells
        , currentTurn
    }, dispatch ] = useBattleShipState();

    const cellHasBeenAttempted = playerAttemptedCells.includes( cellNum );

    const calcBorderRadius = ( cellNum: number ) => {
        switch ( cellNum ) {
            case 1:
                return { borderTopLeftRadius: pxrem( 8 ) };
            case 10:
                return { borderTopRightRadius: pxrem( 8 ) };
            case 91:
                return { borderBottomLeftRadius: pxrem( 8 ) };
            case 100:
                return { borderBottomRightRadius: pxrem( 8 ) };
            default:
                return {};
        }
    };

    const handleCellClick = () => {
        dispatch( { type: 'PLAYER_SHOT', payload: cellNum } );
    };

    return (
        <Box
            width='10%'
            bgcolor={ theme => theme.palette.primary[ 300 ] }
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={ {
                border: theme => `${ pxrem( 1 ) } solid ${ theme.palette.primary[ 400 ] }`
                , position: 'relative'
                , aspectRatio: 1
                , ...calcBorderRadius( cellNum )
                , '&:hover': {
                    cursor: `url(${ crosshair }), auto`
                    , backgroundColor: theme => theme.palette.primary[ 200 ]
                }
                , pointerEvents: isPlayer
                    ? 'none'
                    : cellHasBeenAttempted || currentTurn === 'computer'
                        ? 'none'
                        : 'auto'
            } }
            onClick={ handleCellClick }
        >
            {
                shipImg
                && isPlayer
                && (
                    <Image
                        src={ shipImg.img }
                        width='100%'
                        height='auto'
                        style={ {
                            transform: orientation === 'vertical'
                                ? `rotate(${ direction === 'up' ? -90 : 90 }deg)`
                                : orientation === 'horizontal'
                                    ? `rotate(${ direction === 'left' ? -180 : 0 }deg)`
                                    : 'none'
                        } }
                    />
                )
            }
            { status !== 'none' && <ShotMarker type={ status }/> }
        </Box>
    );
};

export default Cell;

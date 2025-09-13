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
import sunkExplosion from '../../assets/sunk-explosion.png';

// State
import { useBattleShipState } from '../../state/jotai';

interface Props {
    cell: BoardCell;
    isPlayer?: boolean;
}

const Cell = (
    {
        cell: {
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
        dispatch( {
            type: 'PLAYER_SHOT'
            , payload: cellNum
        } );
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
                    cursor: `url(${ crosshair }) 10 10, auto`
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
                && ( isPlayer || status === 'sunk' )
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
            { ( status === 'hit' || status === 'miss' ) && <ShotMarker type={ status } /> }
            {
                status === 'sunk'
                    && (
                        <Image
                            src={ sunkExplosion }
                            width='60%'
                            height='60%'
                            style={ {
                                position: 'absolute'
                                , top: '50%'
                                , left: '50%'
                                , transform: 'translate(-50%, -50%)'
                                , zIndex: 10
                                , filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 1px white) drop-shadow(0 0 2px white)'
                            } }
                        />
                    )
            }
        </Box>
    );
};

export default Cell;

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
import { buildPlayerHeatMap } from '../../utils/ai/playerHeatMap';
import { Theme } from '@mui/system';

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
        , showHeatMap
        , computerCells
        , computerShips
    }, dispatch ] = useBattleShipState();

    const cellHasBeenAttempted = playerAttemptedCells.includes( cellNum );

    const getPlayerHeatMapStyle = ( cellNum: number ) => {
        if ( !showHeatMap || isPlayer ) return {};

        const playerHeatMap = buildPlayerHeatMap( computerCells, computerShips, playerAttemptedCells );
        const heatCell = playerHeatMap.find( cell => cell.cellNum === cellNum );
        const heatValue = heatCell ? heatCell.heatValue : 0;

        const maxHeat = Math.max( ...playerHeatMap.map( c => c.heatValue ) );
        const normalizedHeat = maxHeat > 0 ? heatValue / maxHeat : 0;

        const intensity = Math.min( normalizedHeat * 0.7, 0.7 );
        const hue = 120 - ( normalizedHeat * 120 );

        return {
            backgroundColor: `hsla(${ hue }, 100%, 50%, ${ intensity })`
        };
    };

    const getHoverStyle = ( cellNum: number ) => {
        if ( !showHeatMap || isPlayer ) {
            // Normal hover when heatmap is off
            return {
                '&:hover': {
                    cursor: `url(${ crosshair }) 10 10, auto`
                    , backgroundColor: ( theme: Theme ) => theme.palette.primary[ 200 ]
                }
            };
        }

        const playerHeatMap = buildPlayerHeatMap( computerCells, computerShips, playerAttemptedCells );
        const heatCell = playerHeatMap.find( cell => cell.cellNum === cellNum );
        const heatValue = heatCell ? heatCell.heatValue : 0;

        const maxHeat = Math.max( ...playerHeatMap.map( c => c.heatValue ) );
        const normalizedHeat = maxHeat > 0 ? heatValue / maxHeat : 0;

        const intensity = Math.min( normalizedHeat * 0.7, 0.7 );
        const hue = 120 - ( normalizedHeat * 120 );

        const hoverIntensity = Math.min( intensity + 0.35, 1.0 );

        return {
            '&:hover': {
                cursor: `url(${ crosshair }) 10 10, auto`
                , backgroundColor: `hsla(${ hue }, 100%, 70%, ${ hoverIntensity })`
            }
        };
    };

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
                , ...getPlayerHeatMapStyle( cellNum )
                , ...getHoverStyle( cellNum )
                , pointerEvents: isPlayer
                    ? 'none'
                    : cellHasBeenAttempted || currentTurn === 'computer'
                        ? 'none'
                        : 'auto'
                , overflow: 'hidden'
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
                            , position: 'relative'
                            , zIndex: 5
                            , filter: 'drop-shadow(0 0 0 rgba(0,0,0,0.8)) drop-shadow(0 1px 3px rgba(0,0,0,0.4))'
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

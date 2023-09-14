// MUI
import { Box } from '@mui/joy';

// Components
import Image from '../Image/Image';
import ShotMarker from '../ShotMarker/ShotMarker';

// Types
import { BoardCell } from '../../types/types';

// Utils
import { pxrem } from '../../utils/pxrem';

interface Props {
    cell: BoardCell
}

const Cell = ( { cell: {
    cellNum
    , status
    , shipImg
    , direction
    , orientation
} }: Props ) => {
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
                    cursor: 'pointer'
                    , backgroundColor: theme => theme.palette.primary[ 200 ]
                }
            } }
        >
            {
                shipImg
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

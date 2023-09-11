import { Box } from '@mui/joy';
import { pxrem } from '../../utils/pxrem';
import Image from '../Image/Image';
import { ShipImg } from '../../types/types';
import ShotMarker from '../ShotMarker/ShotMarker';

interface Props {
    cellNum: number;
    cellStatus: 'hit' | 'miss' | 'none';
    ship?: ShipImg[];
}

const Cell = ( {
    cellNum
    , cellStatus
    , ship
}: Props ) => {

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
                ship
                && (
                    <Image
                        src={ ship[ cellNum - 1 ].img }
                        width='100%'
                        height='auto'
                    />
                ) }
            { cellStatus !== 'none' && <ShotMarker type={ cellStatus }/> }
        </Box>
    );
};

export default Cell;

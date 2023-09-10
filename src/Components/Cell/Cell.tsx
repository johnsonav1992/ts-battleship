import { Box } from '@mui/joy';
import { pxrem } from '../../utils/pxrem';

interface Props {
    cellNum: number;
}

const Cell = ( { cellNum }: Props ) => {

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
            sx={ {
                border: theme => `${ pxrem( 1 ) } solid ${ theme.palette.primary[ 400 ] }`
                , aspectRatio: 1
                , ...calcBorderRadius( cellNum )
            } }
        />
    );
};

export default Cell;

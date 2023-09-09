import { Box } from '@mui/joy';
import { pxrem } from '../../utils/pxrem';

const Cell = () => {
    return (
        <Box
            width={ pxrem( 50 ) }
            height={ pxrem( 50 ) }
            bgcolor={ theme => theme.palette.primary[ 200 ] }
            borderColor='red'
        />
    );
};

export default Cell;

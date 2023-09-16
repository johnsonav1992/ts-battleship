import { Box, useTheme } from '@mui/joy';
import Image from '../Image/Image';
import battleshipTitle from '../../assets/battleship-logo.png';
import { pxrem } from '../../utils/pxrem';

const GameTitle = () => {
    const theme = useTheme();

    return (
        <Box
            sx={ {
                width: '40%'
                , m: 'none'
            } }
        >
            <Image
                src={ battleshipTitle }
                width='100%'
                style={ {
                    filter: `drop-shadow(${ pxrem( 5, 5, 5 ) } 
                            ${ theme.palette.background.tooltip })`
                } }
            />
        </Box>
    );
};

export default GameTitle;

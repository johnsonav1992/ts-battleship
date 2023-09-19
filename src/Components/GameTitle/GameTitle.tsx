// MUI
import {
    Box
    , useTheme
} from '@mui/joy';

// Components
import Image from '../Image/Image';

// Assets
import battleshipTitle from '../../assets/battleship-logo.png';

// Utils
import { pxrem } from '../../utils/pxrem';

interface Props {
    isTitleScreen?: boolean;
}

const GameTitle = ( { isTitleScreen }: Props ) => {
    const theme = useTheme();

    return (
        <Box
            sx={ {
                width: isTitleScreen ? '70%' : '40%'
                , m: 'none'
            } }
        >
            <Image
                src={ battleshipTitle }
                width='100%'
                style={ {
                    filter: `drop-shadow(${ pxrem( 5, 5, 5 ) } 
                            ${ isTitleScreen ? theme.palette.background.tooltip : theme.palette.neutral[ 700 ] })`
                } }
            />
        </Box>
    );
};

export default GameTitle;

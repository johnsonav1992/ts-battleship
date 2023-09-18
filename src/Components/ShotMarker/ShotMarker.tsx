// MUI
import {
    Box
    , useTheme
} from '@mui/joy';
import { pxrem } from '../../utils/pxrem';

interface Props {
    type: 'hit' | 'miss';
}

const ShotMarker = ( { type }: Props ) => {
    const theme = useTheme();

    const pegColor = type === 'hit'
        ? theme.palette.danger[ 500 ]
        : theme.palette.common.white;

    return (
        <Box
            sx={ {
                borderRadius: '50%'
                , position: 'absolute'
                , width: '25%'
                , height: '25%'
                , backgroundColor: pegColor
                , '&::before': {
                    content: '""'
                    , position: 'absolute'
                    , animation: 'flash .3s ease-out forwards'
                    , border: `${ pxrem( 2 ) } solid ${ pegColor }`
                    , borderRadius: '100%'
                    , width: pxrem( 32 )
                    , height: pxrem( 32 )
                    , top: '-90%'
                    , left: '-90%'
                    , zIndex: 10
                }
                , '@keyframes flash': {
                    '0%': {
                        opacity: 1
                        , transform: 'scale(1)'
                    }
                    , '100%': {
                        opacity: 0
                        , transform: 'scale(2)'
                    }
                }
            } }
        />
    );
};

export default ShotMarker;

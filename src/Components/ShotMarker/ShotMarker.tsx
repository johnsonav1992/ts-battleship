// MUI
import {
    Box
    , useTheme
} from '@mui/joy';

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
                    , animation: 'flash .2s ease-out forwards'
                    , border: `.1rem solid ${ pegColor }`
                    , borderRadius: '100%'
                    , width: '2rem'
                    , height: '2rem'
                    , top: '-80%'
                    , left: '-80%'
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

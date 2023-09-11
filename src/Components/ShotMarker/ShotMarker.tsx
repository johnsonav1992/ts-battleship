// MUI
import { Box } from '@mui/joy';

interface Props {
    type: 'hit' | 'miss';
}

const ShotMarker = ( { type }: Props ) => {
    return (
        <Box
            sx={ {
                borderRadius: '50%'
                , position: 'absolute'
                , width: '25%'
                , height: '25%'
                , backgroundColor: theme => type === 'hit'
                    ? theme.palette.danger[ 500 ]
                    : 'common.white'
            } }
        />
    );
};

export default ShotMarker;

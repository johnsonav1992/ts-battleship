// MUI
import { Alert } from '@mui/joy';

// Utils
import { pxrem } from '../../utils/pxrem';

interface Props {
    text: string;
}

const SnackAlert = ( { text }: Props ) => {
    return (
        <Alert
            color='neutral'
            size='md'
            variant='soft'
            sx={ {
                position: 'absolute'
                , top: pxrem( 10 )
                , right: pxrem( 10 )
            } }
        >
            { text }
        </Alert>
    );
};

export default SnackAlert;

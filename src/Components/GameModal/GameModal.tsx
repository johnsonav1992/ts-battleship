// MUI
import {
    Modal
    , ModalDialog
} from '@mui/joy';

// Utils
import { pxrem } from '../../utils/pxrem';

// State
import { useBattleShipState } from '../../state/jotai';

// Components
import PlaceShipsModalContent from './PlaceShipsModalContent';
import EndGameModalContent from './EndGameModalContent';

const GameModal = () => {
    const [ {
        isModalOpen
        , isGameOver
    } ] = useBattleShipState();

    return (
        <Modal open={ isModalOpen }>
            <ModalDialog
                sx={ {
                    minHeight: pxrem( 300 )
                    , maxWidth: pxrem( 400 )
                    , p: pxrem( 32 )
                    , backgroundColor: theme => theme.palette.neutral[ 300 ]
                    , borderColor: theme => theme.palette.neutral[ 300 ]
                } }
            >
                {
                    isGameOver
                        ? <EndGameModalContent />
                        : <PlaceShipsModalContent />
                }
            </ModalDialog>
        </Modal>
    );
};

export default GameModal;

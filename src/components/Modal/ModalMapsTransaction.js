import { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useQuery } from 'react-query';

import { APIURL } from '../../api/integration';

import { locToObj } from '../../util/locationStringToObj';

import { ModalContext } from '../../contexts/modalContext';

import MapTransaction from '../micro/MapTransaction';

function ModalMapsTransaction(props) {
    const [state, dispatch] = useContext(ModalContext);

    const {
        data: detailTransaction,
        isFetching: load,
        refetch
    } = useQuery('getDetailTransactionCache', async () => {
        const res = await APIURL.get(`/transaction/${props.index}`);
        return res.data.data.transaction
    });

    return (
        <Modal
        key={props.index}
        show={state.showedMaps}
            onHide={() => {
                dispatch({ type: "CLOSE_MAP" })
                props.setClick(false)
            }}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
        >
            <Modal.Body id={'content-' + props.index} style={{ height: "100%" }}>
                {load ? "loading..." : <MapTransaction loc={locToObj(detailTransaction.customerLoc)} transactionId={props.index} statusTransaction={detailTransaction.status} refetch={props.refetch} setClick={ props.setClick }/>}
            </Modal.Body>
        </Modal>
    )
}

export default ModalMapsTransaction;

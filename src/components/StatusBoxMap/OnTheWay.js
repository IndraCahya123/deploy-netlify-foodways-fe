import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { ModalContext } from '../../contexts/modalContext';
import { UserContext } from '../../contexts/userContext';

import locationIcon from '../../images/location.png';
import { APIURL } from '../../api/integration';
import { useMutation } from 'react-query';
import swal from 'sweetalert';

const OnTheWay = (props) => {
    const [stateModalMap, dispatchModalMap] = useContext(ModalContext);
    const [user] = useContext(UserContext);

    const userRole = user.user.role;

    const closeMap = () => {
        dispatchModalMap({ type: "CLOSE_MAP" });
        props.setClick(false)
    }

        const updateTransaction = useMutation(async () => {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            let statusChange = "Finished";

            const body = JSON.stringify({
                status: statusChange
            })

            await APIURL.patch(`/transaction/${props.transactionId}`, body, config);

            successUpdate();
        });

    const successUpdate = () => {
        if (updateTransaction.isError) {
            swal("Something Wrong", "Maaf transaksi belum bisa diproses", "warning");
        } else {
            swal("Order Delivered", "Terima kasih telah menggunakan jasa kami, selamat menikmati pesanan anda!", "success").then(() => {
                props.refetch()
                closeMap();
            });
        }
    }
    

    return (
        <div style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#fff",
            width: 350,
            minHeight: 150,
            zIndex: 10,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            display: "flex",
            flexDirection: "column",
            padding: 15
        }}>
            <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 24, fontWeight: "bolder" }}>Your Order is On the way</p>
            <div className="d-flex align-items-center mb-3">
                <img
                    src={locationIcon}
                    alt="location pin"
                />
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>{props.load ? "load..." : props.locationName}</span>
            </div>
            {userRole === "partner" ?
                <button type="button" className="btn-sm btn-dark w-100" onClick={() => {
                    closeMap();
            }}> Close </button>
                :
                <button type="button" className="btn-sm btn-dark w-100" onClick={() => {
                updateTransaction.mutate();
            }}> Delivered ? </button>}
        </div>
    )
}


export default OnTheWay;
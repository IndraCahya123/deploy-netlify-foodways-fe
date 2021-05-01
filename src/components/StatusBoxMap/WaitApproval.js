import { useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { ModalContext } from '../../contexts/modalContext';

import locationIcon from '../../images/location.png';

const WaitApproval = (props) => {
    const [stateModalMap, dispatchModalMap] = useContext(ModalContext);

    const closeMap = () => {
        dispatchModalMap({ type: "CLOSE_MAP" });
        props.setClick(false);
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
            <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 24, fontWeight: "bolder" }}>Waiting for your order</p>
            <div className="d-flex align-items-center mb-3">
                <img
                    src={locationIcon}
                    alt="location pin"
                />
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>{props.load ? "load.." : props.locationName}</span>
            </div>
            <button type="button" className="btn-sm btn-dark w-100" onClick={() => closeMap()}> Close Map </button>
        </div>
    )
}


export default WaitApproval;
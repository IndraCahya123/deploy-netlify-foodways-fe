import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';

import WaitApproval from '../StatusBoxMap/WaitApproval';
import OnTheWay from '../StatusBoxMap/OnTheWay';

import LocationPin from '../../images/location_pin.png';

function MapTransaction(props) {

    const [address, setAddress] = useState("");
    const [loadMap, setLoadMap] = useState(true);
    
    const myAdress = async (lat, long) => {
        await axios.get(`https://api.positionstack.com/v1/reverse?access_key=cfb5b411b150ee888fe2dcd72d3676a9&query=${lat},${long}`)
        .then(response => {
            setAddress(response.data.data[0].label);
            setLoadMap(false);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        myAdress(props.loc.latitude, props.loc.longitude)
    }, []);

    const mapBoxToken = 'pk.eyJ1IjoiaW5kcmFjYiIsImEiOiJja20xazUzb3AwOHZrMnB1bDZxM2JqbmJqIn0.u18YM0U2ByjsLEDKjdnfLQ';

    if (props.statusTransaction == "waiting Approval") {
        return (
            <ReactMapGL
                key={props.index}
                latitude={props.loc.latitude}
                longitude={props.loc.longitude}
                width= "100%"
                height= "70vh"
                zoom= {15}
                mapboxApiAccessToken={mapBoxToken}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <WaitApproval locationName={address} load={loadMap} setClick={props.setClick} />
                    <Marker latitude={props.loc.latitude} longitude={props.loc.longitude} >
                        <img
                            src={LocationPin}
                            alt="https://www.freepik.com"
                            width="24px"
                            height="24px"
                        />
                    </Marker>
            </ReactMapGL>
        );
    } else {
        return (
            <ReactMapGL
                key={props.index}
                latitude={props.loc.latitude}
                longitude={props.loc.longitude}
                width= "100%"
                height= "70vh"
                zoom= {15}
                mapboxApiAccessToken={mapBoxToken}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <OnTheWay locationName={address} load={loadMap} transactionId={props.transactionId} refetch={props.refetch} setClick={props.setClick} />
                    <Marker latitude={props.loc.latitude} longitude={props.loc.longitude} >
                        <img
                            src={LocationPin}
                            alt="https://www.freepik.com"
                            width="24px"
                            height="24px"
                        />
                    </Marker>
            </ReactMapGL>
        );
    }
}

export default MapTransaction

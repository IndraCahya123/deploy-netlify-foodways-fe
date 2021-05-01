import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Table } from 'react-bootstrap';
import swal from 'sweetalert';
import toRupiah from '@develoka/angka-rupiah-js';

import { APIURL } from '../../api/integration';

import { UserContext } from '../../contexts/userContext';
import { CurrentLocationContext } from '../../contexts/currentLocationContext';

import OkStat from '../../images/ok.png';
import Waiting from '../../images/chronometer.png';
import CancelStat from '../../images/cancel.png';
import Phone from '../../images/phone.png';
import Email from '../../images/email.png';
import NoTransactions from '../../images/no_data.png';

function PartnerLogged() {
    const history = useHistory();
    
    const [stateUser, dispatch] = useContext(UserContext);

    const [getUser, setUser] = useState({
        user: {},
        load: true,
    })

    const fetchDataUser = async () => {
        const res = await APIURL.get("/user");
        setUser({
            user: res.data.data.user,
            load: false,
        });
    }
    
    if (stateUser.loading) {
        dispatch({
            type: "SUCCESS_EDIT"
        });
        fetchDataUser();
    }
    
    useEffect(() => {
        fetchDataUser();
    }, []);

    const partnerId = stateUser?.user?.id;

    //get user location
    const [locationContext, dispatchLocation] = useContext(CurrentLocationContext);
    useEffect(async () => {
        await navigator.geolocation.getCurrentPosition(pos => {
            dispatchLocation({
                type: "SET_MY_LOCATION",
                payload: {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }
            })
        }, err => {
            console.log(err);
        }, { enableHighAccuracy: true });
    }, []);

    if (!stateUser.loginStatus) {
        dispatch({ type: "AUTH_ERROR" })
        history.push("/")
    }
    console.log(stateUser);
    const {
        data: transactions,
        isFetching: load,
        refetch,
    } = useQuery("getMyTransactionCache", async () => {
        const res = await APIURL.get(`/transactions/${partnerId}`);
        return res.data.data
    });

    console.log(transactions == undefined);

    return (
        <div className="d-flex landing-container w-100" style={{ height: "100vh", paddingTop: 70 }}>
            {getUser.load ? "load..." : <div id="flag" className="restaurant-profile bg-danger ml-3 w-25">
                <img
                    src={getUser?.user?.image}
                    alt="Restaurant Image"
                    width="150px"
                    height="150px"
                    style={{ borderRadius: "50%", backgroundColor: "#fff" }}
                />
                <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 34, marginTop: 30 }}>{getUser?.user?.fullname}</p>
                <div className="d-flex w-100 justify-content-around">
                    <div>
                        <img
                            src={Phone}
                            alt="restaurant phone"
                            width= "30px"
                            height="30px"
                            style={{ marginBottom: 10 }}
                        />
                        <p>{ getUser?.user?.phone }</p>
                    </div>
                    <div>
                        <img
                            src={Email}
                            alt="restaurant email"
                            width= "30px"
                            height= "30px"
                            style={{ marginBottom: 10 }}
                        />
                        <p>{ getUser?.user?.email }</p>
                    </div>
                </div>
            </div>}
            <div className="table-wrapper" style={{
                width: "80%",
                margin: "0 auto",
                padding: 20
            }}>
                <p style={{ fontFamily: "'Abhaya Libre'", fontSize: 34, marginBottom: 30 }}>{transactions == undefined ? "There's No Transaction" : "Order Transaction"}</p>
                {
                    transactions == undefined ? 
                        <>
                            <div className="d-flex flex-column align-items-center" style={{ width: "100%" }}>
                                <img
                                    src={NoTransactions}
                                    alt="No transactions"
                                    width="400px"
                                    height="400px"
                                    style={{ backgroundColor: "#E5E5E5" }}
                                />
                            </div>
                        </>
                    :
                        <Table variant="dark" striped bordered hover className="w-100">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Product</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.transactions.map((transaction, index) => {
                                return (
                                    <tr>
                                        <td>{ index + 1 }</td>
                                        <td>{ transaction.customer.fullname }</td>
                                        <td>{ toRupiah(transaction.total,{formal: false}) }</td>
                                        <td style={{ width: 300 }}>{
                                            transaction.orders.map(order => {
                                                return (
                                                    <ul style={{ marginLeft: 15 }}>
                                                        <li>
                                                            {order.title}
                                                            <br />
                                                            Qty: {order.qty}
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }</td>
                                        <td><Action transactionId={transaction.id} status={transaction.status} loading={load} refetch={refetch} /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                }
            </div>
        </div>
    )
}

const Action = (props) => {
    const updateTransaction = useMutation(async (statusBtn) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let statusChange = "";

        if (statusBtn == "accept") {
            statusChange += "On The Way"
        } else if (statusBtn == "decline") {
            statusChange += "Cancelled"
        } else {
            return null;
        }

        const body = JSON.stringify({
            status: statusChange
        })

        await APIURL.patch(`/transaction/${props.transactionId}`, body, config);

        successUpdate(statusBtn);
    });

    const successUpdate = (status) => {
        if (updateTransaction.isError) {
            swal("Something Wrong", "Maaf transaksi belum bisa diproses", "warning");
        } else {
            if (status == "accept") {
                swal("Transaction Accepted", "Silahkan untuk menyiapkan pesanan yang sudah di pesan", "success").then(() => props.refetch());
            } else {
                swal("Transaction Declined", "Transaksi telah dibatalkan", "success").then(() => props.refetch());
            }
        }
    }

    switch (props.status) {
        case "waiting Approval":
            return (
                <>
                    <button type="button" onClick={async () => updateTransaction.mutate("decline")} className="btn-sm btn-danger">decline</button>
                    <button type="button" onClick={async () => updateTransaction.mutate("accept")} className="btn-sm btn-success">accept</button>
                </>
            );
        case "On The Way":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={Waiting}
                            alt="on the way"
                            title="On The Way"
                        />
                    }
                </>
            )
        case "Finished":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={OkStat}
                            alt="Finished"
                            title="Finished Order"
                        />
                    }
                </>
            )
        case "Cancelled":
            return (
                <>
                    {props.loading ? "Load.." :
                        <img
                            width="20px"
                            height="20px"
                            src={CancelStat}
                            alt="Canceled"
                            title="Canceled Order"
                        />
                    }
                </>
            )
    
        default:
            return null;
    }
}

export default PartnerLogged

import React from 'react'
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { APIURL } from '../../api/integration';

import ProductCard from '../../components/Card/ProductCard';

import NoData from '../../images/no_data.png';

function RestaurantProductDetail() {
    const {id} = useParams()

    //get products by partner id

    const {
        data: products,
        isFetching: fetch
    } = useQuery("productsByPartnerCache", async () => {
        const res = await APIURL.get(`/products/${id}`);
        return res.data.data.products
    });

    console.log(products);

    if (fetch) {
        return null;
    } else {
        if (products.length == 0) {
            return (
                <div style={{ padding: "164px 0", margin: "0 auto", width: "80%"}}>
                    <h1 style={{ fontFamily: "'Abhaya Libre'", marginBottom: 10 }}>Restaurant</h1>
                    <div className="products d-flex flex-column align-items-center">
                    <h3 style={{ fontFamily: "'Abhaya Libre'", marginBottom: "-20px" }}>There's no product in this restaurant</h3>
                        <img
                            src={NoData}
                            alt="No Data"
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ padding: "164px 0", margin: "0 auto", width: 1070 }}>
                    <h1 style={{ fontFamily: "'Abhaya Libre'" }}>{ fetch ? "load..." : products[0]?.user?.fullname }</h1>
                    <div className="products d-flex flex-wrap">
                        {products.map(product => <ProductCard product={product} />)}
                    </div>
                </div>
            );
        }
    }

}

export default RestaurantProductDetail

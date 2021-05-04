import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import swal from "sweetalert";
import { Form, Col } from "react-bootstrap";

import toRupiah from '@develoka/angka-rupiah-js';

import { APIURL } from "../../api/integration";

import { UserContext } from '../../contexts/userContext';

import FileButton from "../../components/micro/FileButton";

function AddProduct() {
    const [form, setForm] = useState({
        productName: "",
        imgFile: null,
        price: 0,
        productId: 0
    });

    const [partnerLogged] = useContext(UserContext);
    const partnerId = partnerLogged.user.id;

    const [isEdit, setIsEdit] = useState(false);

    const { productName, imgFile, price, productId } = form;

    const {
        data: dataProducts,
        isFetching: loading,
        refetch
    } = useQuery("getMyProductsCache", async () => {
        const res = await APIURL.get(`/products/${partnerId}`);
        return res.data.data.products
    });

    const onChange = (e) => {
        const tempForm = { ...form };
        tempForm[e.target.name] =
        e.target.type === "file" ? e.target.files[0] : e.target.value;
        setForm(tempForm);
    };
    

    const addProduct = useMutation(async () => {
        const body = new FormData();

        body.append("title", productName);
        body.append("price", price);
        body.append("image", imgFile);

        const config = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        };

        await APIURL.post("/product", body, config);

        onSubmit();

        setForm({
        productName: "",
        imgFile: null,
        price: 0,
        });
    });

    const onSubmit = () => {
        if (addProduct.isError) {
            swal("Failed", "There are some errors while add product", "error");
        } else {
            swal("Product added", "Your Product Successfully Added", "success").then(() => refetch());
        }
    };

    //edit section
    const cancelEdit = () => {
        setForm({
            productName: "",
            imgFile: null,
            price: 0,
            productId: 0
        });
    }

    const updateProduct = useMutation(async () => {
        const body = new FormData();

        body.append("title", productName);
        body.append("price", price);
        body.append("image", imgFile);

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        await APIURL.patch(`/product/${productId}`, body, config);

        updateSuccess();

        setForm({
            productName: "",
            imgFile: null,
            price: 0,
            productId: 0
        });
    });

    const updateSuccess = () => {
        if (updateProduct.isError) {
            swal("Failed", "There's Something Wrong While Updating Product", "warning");
        } else {
            swal("Success", "Success to Update Your Product", "success").then(() => {
                refetch();
                setIsEdit(false);
            });
        }
    }

    return (
        <div className="form-container" style={{ width: "100%", minHeight: "100vh" }}>
            <div
                className="form-wrapper d-flex flex-column"
                style={{ padding: "100px 0 0", margin: "0 auto", width: "80%" }}
            >
                <span
                style={{
                    fontFamily: "'Abhaya Libre'",
                    fontSize: 36,
                    fontWeight: "bold",
                    margin: "0 0 30px 10px",
                }}
                >
                {isEdit ? "Edit Product" : "Add Product"}
                </span>
                <Form>
                    <Form.Row className="mb-3">
                        <Col md="9">
                        <Form.Control
                            placeholder="Product Name"
                            name="productName"
                            value={productName}
                            onChange={(e) => onChange(e)}
                        />
                        </Col>
                        <Col>
                        <FileButton onChange={onChange} isEdit={false} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                        <Form.Control
                            placeholder="Product Price"
                            value={price}
                            name="price"
                            type="number"
                            onChange={(e) => onChange(e)}
                        />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mt-5">
                        {isEdit ?
                            <>
                                <Col className="d-flex" md={{ span: 4, offset: 8 }}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                        updateProduct.mutate();
                                        }}
                                        className="btn btn-dark"
                                        style={{ width: "50%", marginRight: 20, background: "none", border: "none", color: "#000", fontWeight: "bolder" }}
                                    >
                                        {updateProduct.isLoading ? "wait..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            cancelEdit();
                                            setIsEdit(false);
                                        }}
                                        className="btn btn-dark"
                                        style={{ width: "50%", background: "red", border: "none" }}
                                    >
                                        Cancel
                                    </button>
                                </Col>
                            </>
                            :
                            <>
                                <Col md={{ span: 3, offset: 9 }}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                        addProduct.mutate();
                                        }}
                                        className="btn btn-dark"
                                        style={{ width: "100%" }}
                                        {...(addProduct.isLoading ? "disabled" : null)}
                                    >
                                        {addProduct.isLoading ? "wait..." : "Add Product"}
                                    </button>
                                </Col>
                            </>
                        }
                    </Form.Row>
                </Form>
                {addProduct.isError && (
                <p variant="danger" className="mt-3">
                    {addProduct.error?.response?.data?.message}
                </p>
                )}
            </div>
            <hr />
            <div
                className="products-wrapper d-flex flex-column"
                style={{ paddingTop: 30, paddingBottom: 100, margin: "0 auto", width: "80%" }}
            >
                <span
                style={{
                    fontFamily: "'Abhaya Libre'",
                    fontSize: 36,
                    fontWeight: "bold",
                    marginBottom: 50,
                    textAlign: "center"
                }}
                >
                    Product List
                </span>
                <div className="d-flex flex-wrap w-100">
                {loading ? "load.." : dataProducts.map(product => {
                    return (
                        <ProductCard product={product} index={product.id} setForm={setForm} setEdit={setIsEdit} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const ProductCard = (props) => {
    const setEditForm = () => {
        props.setForm({
            productName: props.product.title,
            imgFile: props.product.image,
            price: props.product.price,
            productId: props.index
        });

        props.setEdit(true)
    }

    return (
        <>
            <div
                className="product-card d-flex flex-column p-3"
                style={{ width: "25%", backgroundColor: "#fff", height: 340, borderRadius: 5, marginRight: 20, marginBottom: 20 }}
            >
                <img
                    src={props.product.image}
                    alt="Product Image"
                    width="100%"
                    height="150px"
                />
                <span style={{ fontFamily: "'Abhaya Libre'", fontSize: 18, fontWeight: "bolder", textAlign: "center", marginTop: 15, marginBottom: 15, height: 50 }}>{ props.product.title }</span>
                <span style={{ color: "red", marginBottom: 20 }}>{ toRupiah(props.product.price, {formal: false}) }</span>
                <div className="action d-flex justify-content-end">
                    <button type="button" className="btn btn-dark" style={{ background: "none", border: "none", marginRight: 15, color: "#000", fontWeight: "bolder" }} onClick={() => setEditForm()} >Edit</button>
                    <button type="button" className="btn btn-dark" style={{ background: "red", border: "none" }} >Delete</button>
                </div>
            </div>
        </>
    );
}

export default AddProduct;

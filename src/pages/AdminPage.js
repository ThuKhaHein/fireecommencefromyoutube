import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import fireDB from '../fireConfig';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Tab, Tabs } from "react-bootstrap"
import { toast } from 'react-toastify';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    imageURL: "",
    category: "",
    description: "",
  })

  const [show, setShow] = useState(false);
  const [add, setAdd] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getdata()
  }, [])

  async function getdata() {

    try {
      setLoading(true)
      const users = await getDocs(collection(fireDB, "products"))
      const productsArray = []
      users.forEach((doc) => {

        const obj = {
          id: doc.id,
          ...doc.data()
        }
        productsArray.push(obj);
        setLoading(false)
      });

      setProducts(productsArray)

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  useEffect(() => {
    getorderdata()
  }, [])

  async function getorderdata() {

    try {
      setLoading(true)
      const result = await getDocs(collection(fireDB, "orders"))
      const ordersArray = []
      result.forEach((doc) => {


        ordersArray.push(doc.data());
        setLoading(false)
      });
      console.log(ordersArray)

      setOrders(ordersArray)

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  const editHandler = (item) => {
    setProduct(item);
    setShow(true);
  };

  const updateProduct = async () => {
    try {
      setLoading(true)
      await setDoc(doc(fireDB, "products", product.id), product)
      handleClose()
      toast.success('Product Updated successfully')
      window.location.reload()
    } catch (error) {
      toast.error('Product Updated failed')
      setLoading(false)
    }
  }

  const addProduct = async () => {
    try {
      setLoading(true)
      await addDoc(collection(fireDB, "products"), product)
      handleClose()
      toast.success('Product added successfully')
      window.location.reload()
    } catch (error) {
      toast.error('Product add failed')
      setLoading(false)
    }
  }

  const addHandler = () => {
    setAdd(true)
    handleShow()
  }

  const deleteProduct = async (item) => {
    try {
      setLoading(true)
      await deleteDoc(doc(fireDB, "products", item.id))
      toast.success('Product deleted successfully')
      getdata()
    } catch (error) {
      toast.failed('Product deleted failed')
      setLoading(false)
    }
  }

  return (
    <Layout loading={loading}>

      <Tabs defaultActiveKey="products" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="products" title="Products">
          <div className='d-flex justify-content-between'>
            <h3>Product List</h3>
            <button onClick={addHandler}>ADD PRODUCT</button>
          </div>
          <div className='table-responsive'>
          <table className='table mt-3' >
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => {
                return <tr>
                  <td><img src={item.imageURL} height="80" width='80' alt='' /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                  <td><FaTrash color='red' size={20} onClick={() => { deleteProduct(item) }} />
                    <FaEdit
                      onClick={() => editHandler(item)}
                      color='blue' size={20} /></td>

                </tr>
              })}
            </tbody>
          </table>
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{add === true ? 'Add a product' : 'Edit Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {""}
              <div className='register-form'>

                <hr />
                <input type="text" className='form-control' placeholder='name' value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                <input type="text" className='form-control' placeholder='image url' value={product.imageURL} onChange={(e) => setProduct({ ...product, imageURL: e.target.value })} />
                <input type="number" className='form-control' placeholder='price' value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                <input type="text" className='form-control' placeholder='category' value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
                <textarea type="text" className='form-control' placeholder='description' value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />


                <hr />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleClose}>
                Close
              </button>
              {add ? (<button onClick={addProduct}>
                SAVE
              </button>) : <button onClick={updateProduct}>
                SAVE
              </button>}
            </Modal.Footer>
          </Modal>
        </Tab>
        <Tab eventKey="orders" title="Orders">
          {orders.map((order) => {
            return (
              <table className='table mt-3 order'>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>

                  </tr>
                </thead>
                <tbody>
                  {order.cartItems.map(item => {
                    return <tr>
                      <td><img src={item.imageURL} height="80" width='80' alt='' /></td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>

                    </tr>
                  })}
                </tbody>
              </table>
            );
          })}
        </Tab>
        <Tab eventKey="contact" title="Users" disabled>

        </Tab>
      </Tabs>


    </Layout>
  )
}

export default AdminPage
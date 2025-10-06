import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getorder } from "../../store/slice/OrderSlice";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

const Getorders = () => {
  const dispatch = useDispatch();
  const { orderlist, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getorder());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center my-5">
        {error}
      </Alert>
    );
  }

  const totalOrders = orderlist?.count || 0;

  return (
    <div className="container my-4">
      <h5>Total Orders: {totalOrders}</h5>

      <Table striped bordered hover responsive className="text-center mt-3">
        <thead>
          <tr>
            <th>Sr.No</th>
            <th>Product Image</th>
            <th>Product Name </th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Customer Name</th>
            <th>Shipping Address</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orderlist?.orders?.length > 0 ? (
            orderlist.orders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{index + 1}</td>
                <td>
                  {order.items?.map((item, idx) => (
                    <Image
                      key={idx}
                      src={item.product?.images[0]?.filepath}
                      alt={item.productName}
                      rounded
                      width={50}
                      height={50}
                      className="mx-1"
                    />
                  ))}
                </td>
                <td>
                  {order.items?.map((item) => item.productName).join(", ")}
                </td>
                <td>
                  {order.items?.map((item) => item.sizeName).join(", ")}
                </td>
                <td>{order.items?.map((item) => item.quantity).join(", ")}</td>
                <td>{order.user?.username}</td>
                <td>
                  {order.shippingAddress?.houseno}, {order.shippingAddress?.street}, {order.shippingAddress?.landmark}, {order.shippingAddress?.city}, {order.shippingAddress?.state}, {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
                </td>
                <td>{order.totalPrice}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.status}</td>
                <td>{order.isPaid ? "Paid" : "Pending"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="text-center">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Getorders;

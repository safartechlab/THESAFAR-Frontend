import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus } from "../../store/slice/OrderSlice";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Baseurl } from "../../baseurl";
import { showToast } from "../../store/slice/toast_slice";

const Getorders = () => {
  const dispatch = useDispatch();
  const { orderlist, loading, error } = useSelector((state) => state.order);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState("");

  // Fetch all orders
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Order Status Categories
  const statusOrder = [
    "Received",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Rejected",
  ];

  const groupedOrders = useMemo(() => {
    return statusOrder.reduce((acc, status) => {
      acc[status] = orderlist?.filter((o) => o.status === status) || [];
      return acc;
    }, {});
  }, [orderlist]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus, reason = "") => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus, reason })
      ).unwrap();

      dispatch(
        showToast({
          type: "success",
          message: `Order updated to ${newStatus}`,
        })
      );

      if (newStatus === "Rejected") setShowRejectModal(false);
      setRejectReason("");
    } catch (err) {
      dispatch(showToast({ type: "error", message: "Failed to update order" }));
    }
  };

  // Open Reject Modal
  const openRejectModal = (orderId) => {
    setRejectOrderId(orderId);
    setShowRejectModal(true);
  };

  // Handle Invoice View/Download
  const handleInvoice = async (orderId, type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Admin login required.");

      const res = await fetch(`${Baseurl}order/invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (type === "view") window.open(url, "_blank");
      else {
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${orderId}.pdf`;
        link.click();
      }
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to open or download invoice");
    }
  };

  // Action Buttons by status
  const getActionButtons = (order) => {
    const { status, _id } = order;

    switch (status) {
      case "Received":
        return (
          <div className="d-flex gap-1 justify-content-center flex-wrap">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusChange(_id, "Confirmed")}
            >
              ✅ Confirm
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => openRejectModal(_id)}
            >
              ⚠ Reject
            </Button>
          </div>
        );

      case "Confirmed":
        return (
          <div className="d-flex gap-1 justify-content-center flex-wrap">
            <Button
              size="sm"
              variant="info"
              onClick={() => handleStatusChange(_id, "Shipped")}
            >
              🚚 Ship
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => openRejectModal(_id)}
            >
              ⚠ Reject
            </Button>
          </div>
        );

      case "Shipped":
        return (
          <div className="d-flex gap-1 justify-content-center flex-wrap">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusChange(_id, "Delivered")}
            >
              📦 Deliver
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => openRejectModal(_id)}
            >
              ⚠ Reject
            </Button>
          </div>
        );

      case "Delivered":
        return <span className="badge bg-success">Delivered</span>;

      case "Cancelled":
        return <span className="badge bg-danger">Cancelled</span>;

      case "Rejected":
        return <span className="badge bg-secondary">Rejected</span>;

      default:
        return null;
    }
  };

  // Format address
  const formatAddress = (addr) => {
    if (!addr) return "N/A";

    return [
      addr.houseno,
      addr.street,
      addr.landmark,
      addr.city,
      addr.state,
      addr.pincode,
      addr.country,
    ]
      .filter((x) => x && x.trim() !== "")
      .join(", ");
  };

  // Render Table
  const renderTable = (orders) => (
    <Table striped bordered hover responsive className="text-center align-middle">
      <thead className="table-dark">
        <tr>
          <th>SR.NO</th>
          <th>Product</th>
          <th>Size</th>
          <th>Qty</th>
          <th>Customer</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Total</th>
          <th>Status</th>
          <th>Invoice</th>
        </tr>
      </thead>

      <tbody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.items?.map((i) => i.productName).join(", ")}</td>
              <td>{order.items?.map((i) => i.sizeName).join(", ")}</td>
              <td>{order.items?.map((i) => i.quantity).join(", ")}</td>
              <td>{order.user?.username || "N/A"}</td>
              <td>{formatAddress(order.shippingAddress)}</td>
              <td>{order.shippingAddress?.phone || "N/A"}</td>
              <td>₹{order.totalPrice}</td>
              <td>{getActionButtons(order)}</td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleInvoice(order._id, "view")}
                  >
                    👁️
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleInvoice(order._id, "download")}
                  >
                    ⬇️
                  </Button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-muted py-4">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center my-5">
        {error}
      </Alert>
    );

  return (
    <div className="container my-4">
      <h4 className="fw-bold text-center mb-4">All Orders</h4>

      {statusOrder.map((status) => (
        <div key={status} className="mb-5">
          <h5 className="fw-bold mb-3">{status} Orders ({groupedOrders[status]?.length})</h5>
          {renderTable(groupedOrders[status])}
        </div>
      ))}

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Order</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            disabled={!rejectReason.trim()}
            onClick={() =>
              handleStatusChange(rejectOrderId, "Rejected", rejectReason)
            }
          >
            Reject Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Getorders;

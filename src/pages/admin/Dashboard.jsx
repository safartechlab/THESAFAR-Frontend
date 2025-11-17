import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../store/slice/OrderSlice";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orderlist, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // 💰 Calculate revenue
  const {
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    totalRevenue,
  } = useMemo(() => {
    if (!orderlist || orderlist.length === 0)
      return {
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        yearlyRevenue: 0,
        totalRevenue: 0,
      };

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let daily = 0,
      weekly = 0,
      monthly = 0,
      yearly = 0,
      total = 0;

    orderlist.forEach((order) => {
      // Only count paid orders
      if (order.paymentStatus !== "Paid") return;

      const date = new Date(order.createdAt);
      const revenue = order.totalPrice || 0;

      total += revenue;

      if (date >= startOfDay) daily += revenue;
      if (date >= startOfWeek) weekly += revenue;
      if (date >= startOfMonth) monthly += revenue;
      if (date >= startOfYear) yearly += revenue;
    });

    return {
      dailyRevenue: daily,
      weeklyRevenue: weekly,
      monthlyRevenue: monthly,
      yearlyRevenue: yearly,
      totalRevenue: total,
    };
  }, [orderlist]);

  // 📊 Order count by status
  const statusCounts = useMemo(() => {
    const statuses = [
      "Received",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Rejected",
    ];
    const counts = {};
    statuses.forEach((status) => {
      counts[status] =
        orderlist?.filter((o) => o.status === status).length || 0;
    });
    return counts;
  }, [orderlist]);

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading dashboard data...</p>
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
      <h2 className="fw-bold text-center mb-4">📊 Admin Dashboard</h2>

      {/* 💰 Revenue Summary */}
      <h4 className="fw-bold mb-3 text-center">Revenue Summary</h4>
      <Row xs={1} sm={2} md={4} className="g-3 mb-4 text-center">
        <Col>
          <Card className="shadow-sm border border-success">
            <Card.Body>
              <Card.Title className="text-success fw-bold">Today</Card.Title>
              <Card.Text>₹{dailyRevenue.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border border-primary">
            <Card.Body>
              <Card.Title className="text-primary fw-bold">
                This Week
              </Card.Title>
              <Card.Text>₹{weeklyRevenue.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border border-warning">
            <Card.Body>
              <Card.Title className="text-warning fw-bold">
                This Month
              </Card.Title>
              <Card.Text>₹{monthlyRevenue.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border border-danger">
            <Card.Body>
              <Card.Title className="text-danger fw-bold">This Year</Card.Title>
              <Card.Text>₹{yearlyRevenue.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="text-center fw-bold mb-5">
        Total Revenue: ₹{totalRevenue.toFixed(2)}
      </h5>

      {/* 📦 Orders by Status */}
      <h4 className="fw-bold mb-3 text-center">Orders by Status</h4>
      <Row xs={1} sm={2} md={3} className="g-3 text-center">
        <Col>
          <Card className="shadow-sm border-start border-5 border-warning">
            <Card.Body>
              <Card.Title className="text-warning fw-bold">Received</Card.Title>
              <Card.Text>{statusCounts.Received}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-start border-5 border-info">
            <Card.Body>
              <Card.Title className="text-info fw-bold">Confirmed</Card.Title>
              <Card.Text>{statusCounts.Confirmed}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-start border-5 border-primary">
            <Card.Body>
              <Card.Title className="text-primary fw-bold">Shipped</Card.Title>
              <Card.Text>{statusCounts.Shipped}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-start border-5 border-success">
            <Card.Body>
              <Card.Title className="text-success fw-bold">
                Delivered
              </Card.Title>
              <Card.Text>{statusCounts.Delivered}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-start border-5 border-danger">
            <Card.Body>
              <Card.Title className="text-danger fw-bold">Cancelled</Card.Title>
              <Card.Text>{statusCounts.Cancelled}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="shadow-sm border-start border-5 border-secondary">
            <Card.Body>
              <Card.Title className="text-secondary fw-bold">
                Rejected
              </Card.Title>
              <Card.Text>{statusCounts.Rejected}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

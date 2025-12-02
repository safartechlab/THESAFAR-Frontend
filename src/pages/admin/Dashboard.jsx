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

  // Revenue calculations
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
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

  // Status count
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
    statuses.forEach((s) => {
      counts[s] = orderlist?.filter((order) => order.status === s).length || 0;
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

      <h2 className="fw-bold text-center mb-4 dashboard-title">
        📊 Admin Analytics Dashboard
      </h2>

      {/* Revenue Section */}
      <h4 className="fw-bold mb-3 text-center section-heading">
        Revenue Summary
      </h4>

      <Row xs={1} sm={2} lg={4} className="g-4 mb-4">
        {[
          { title: "Today", value: dailyRevenue, color: "#22c55e" },
          { title: "This Week", value: weeklyRevenue, color: "#3b82f6" },
          { title: "This Month", value: monthlyRevenue, color: "#f59e0b" },
          { title: "This Year", value: yearlyRevenue, color: "#ef4444" },
        ].map((box, index) => (
          <Col key={index}>
            <Card className="shadow-lg analytics-card text-center">
              <Card.Body>
                <Card.Title
                  className="fw-bold"
                  style={{ color: box.color, fontSize: "20px" }}
                >
                  {box.title}
                </Card.Title>
                <Card.Text className="fw-bold fs-4">
                  ₹{box.value.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h4 className="text-center fw-bold mb-5 total-revenue-text">
        Total Revenue: <span>₹{totalRevenue.toFixed(2)}</span>
      </h4>

      {/* Orders by Status */}
      <h4 className="fw-bold mb-3 text-center section-heading">
        Orders Overview
      </h4>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {[
          { title: "Received", color: "#f59e0b" },
          { title: "Confirmed", color: "#0ea5e9" },
          { title: "Shipped", color: "#3b82f6" },
          { title: "Delivered", color: "#22c55e" },
          { title: "Cancelled", color: "#ef4444" },
          { title: "Rejected", color: "#6b7280" },
        ].map((box, index) => (
          <Col key={index}>
            <Card className="shadow-lg analytics-card text-center">
              <div
                className="status-bar"
                style={{ backgroundColor: box.color }}
              ></div>

              <Card.Body>
                <Card.Title
                  className="fw-bold"
                  style={{ color: box.color, fontSize: "20px" }}
                >
                  {box.title}
                </Card.Title>

                <Card.Text className="fw-bold fs-4">
                  {statusCounts[box.title]}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CSS Styling */}
      <style>{`
        .analytics-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.12);
          border-radius: 15px;
          transition: 0.3s;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .analytics-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        }
        .dashboard-title {
          color: #0ea5e9;
          text-shadow: 0px 0px 12px rgba(14,165,233,0.4);
        }
        .section-heading {
          color: #14b8a6;
          text-shadow: 0 0 10px rgba(20,184,166,0.3);
        }
        .total-revenue-text span {
          color: #f97316;
          font-size: 26px;
          text-shadow: 0 0 10px rgba(249,115,22,0.3);
        }
        .status-bar {
          height: 7px;
          width: 100%;
          border-radius: 10px 10px 0 0;
        }
      `}</style>

    </div>
  );
};

export default Dashboard;

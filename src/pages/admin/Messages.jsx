import { useEffect, useState } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import { Card, Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import "../../safar_css/safar.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${Baseurl}message/getmessage`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setStatus("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText("");
    setStatus("");
  };

  const sendReply = async () => {
    if (!replyText.trim()) return setStatus("Reply cannot be empty!");
    setSending(true);
    try {
      await axios.post(
        `${Baseurl}message/reply`,
        { messageId: selectedMessage._id, replyMessage: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => prev.filter(msg => msg._id !== selectedMessage._id));
      setStatus("Reply sent successfully!");
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`${Baseurl}message/deletmessage/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(prev => prev.filter(msg => msg._id !== msgId));
      setStatus("Message deleted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete message");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="messages-container">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h2 className="mb-3">User Messages</h2>
          {status && <p className="text-info">{status}</p>}

          {messages.length === 0 ? (
            <p>No messages found</p>
          ) : (
            <div className="table-responsive">
              <Table striped hover bordered className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Message</th>
                    <th>Received At</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg._id}>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.contact}</td>
                      <td>{msg.message}</td>
                      <td>{new Date(msg.createdAt).toLocaleString()}</td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => openReplyModal(msg)}
                        >
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => deleteMessage(msg._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Reply Modal */}
      <Modal
        show={!!selectedMessage}
        onHide={() => setSelectedMessage(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply to {selectedMessage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {status && <p className="text-info">{status}</p>}
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
            Cancel
          </Button>
          <Button variant="success" onClick={sendReply} disabled={sending}>
            {sending ? "Sending..." : "Send Reply"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Messages;

import { useEffect, useState } from "react";
import axios from "axios";
import { Baseurl } from "../../baseurl";
import "../../safar_css/safar.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all messages
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

  // Open modal for replying
  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText(""); // start with empty reply
    setStatus("");
  };

  // Send reply
  const sendReply = async () => {
    if (!replyText.trim()) return setStatus("Reply cannot be empty!");
    setSending(true);
    try {
      await axios.post(
        `${Baseurl}message/reply`,
        { messageId: selectedMessage._id, replyMessage: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove message from state after replying
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== selectedMessage._id)
      );

      setStatus("Reply sent successfully!");
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  // Delete message
  const deleteMessage = async (msgId) => {
    if (!msgId) {
      console.error("❌ No message ID received");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await axios.delete(`${Baseurl}message/deletmessage/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      setStatus("Message deleted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to delete message");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="messages-container">
      <h2>User Messages</h2>
      {status && <p className="form-status">{status}</p>}

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Message</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.contact}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => openReplyModal(msg)}
                    >
                      Reply
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Reply */}
      {selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Reply to {selectedMessage.name}</h4>
            <textarea
              rows="5"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="form-control"
            />
            <div className="modal-actions mt-2">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setSelectedMessage(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={sendReply}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;

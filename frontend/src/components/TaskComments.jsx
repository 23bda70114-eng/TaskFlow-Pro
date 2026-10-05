import { useEffect, useState } from "react";
import API from "../services/api";

function TaskComments({ taskId, showToast }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const getComments = async () => {
    try {
      const response = await API.get(`/comments/task/${taskId}`);
      setComments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (taskId) {
      getComments();
    }
  }, [taskId]);

  const addComment = async () => {
    if (text.trim() === "") {
      return;
    }

    try {
      await API.post("/comments", {
        taskId: taskId,
        text: text,
        author: "Javed"
      });

      setText("");
      await getComments();

      if (showToast) {
        showToast("Comment added!");
      }
    } catch (error) {
      console.log(error);

      if (showToast) {
        showToast("Error adding comment");
      }
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);

      await getComments();

      if (showToast) {
        showToast("Comment deleted!");
      }
    } catch (error) {
      console.log(error);

      if (showToast) {
        showToast("Error deleting comment");
      }
    }
  };

  return (
    <div className="comments-section">

      <h4>💬 Comments</h4>

      <div className="comment-input-area">

        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addComment();
            }
          }}
        />

        <button onClick={addComment}>
          Add
        </button>

      </div>

      <div className="comments-list">

        {comments.length === 0 ? (
          <p className="no-comments">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <div className="comment-item" key={comment.id}>

              <div className="comment-content">

                <strong>
                  👤 {comment.author || "User"}
                </strong>

                <p>{comment.text}</p>

              </div>

              <button
                className="delete-comment-btn"
                onClick={() => deleteComment(comment.id)}
              >
                🗑️
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default TaskComments;
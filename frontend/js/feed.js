// js/feed.js
import { apiRequest } from "./api.js";

const feedContainer = document.getElementById("feed");
const newPostForm = document.getElementById("new-post-form");

// Load feed
async function loadFeed() {
  feedContainer.innerHTML = "Loading...";
  const res = await apiRequest("/posts");
  if (!res.ok) {
    feedContainer.innerHTML = "Failed to load feed.";
    return;
  }
  const posts = await res.json();
  renderFeed(posts);
}

function renderFeed(posts) {
  if (!posts.length) {
    feedContainer.innerHTML = "<p>No posts yet.</p>";
    return;
  }

  feedContainer.innerHTML = "";
  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "card post";
    postEl.innerHTML = `
      <div class="post-header">
        <span class="post-title">${post.title || "(no title)"}</span>
        <span>by ${post.username}</span>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="post-meta">
        ${new Date(post.created_at).toLocaleString()} ·
        <span data-role="like-count">${post.likeCount ?? 0}</span> likes
      </div>
      <div class="post-actions">
        <button data-role="like-btn">Like / Unlike</button>
        <button data-role="toggle-comments">Comments</button>
      </div>
      <div class="comments hidden">
        <div data-role="comments-list">Loading comments...</div>
        <form data-role="comment-form">
          <input type="text" placeholder="Write a comment..." required />
          <button type="submit">Send</button>
        </form>
      </div>
    `;

    // Like button
    const likeBtn = postEl.querySelector('[data-role="like-btn"]');
    likeBtn.addEventListener("click", async () => {
      const res = await apiRequest(`/posts/${post.id}/like`, { method: "POST" });
      if (!res.ok) return;
      const result = await res.json();
      // reload feed to update like count (simple)
      await loadFeed();
    });

    // Comments toggle
    const commentsContainer = postEl.querySelector(".comments");
    const toggleCommentsBtn = postEl.querySelector('[data-role="toggle-comments"]');
    const commentsListEl = postEl.querySelector('[data-role="comments-list"]');
    toggleCommentsBtn.addEventListener("click", async () => {
      const isHidden = commentsContainer.classList.contains("hidden");
      if (isHidden) {
        commentsContainer.classList.remove("hidden");
        await loadComments(post.id, commentsListEl);
      } else {
        commentsContainer.classList.add("hidden");
      }
    });

    // Add comment
    const commentForm = postEl.querySelector('[data-role="comment-form"]');
    commentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = commentForm.querySelector("input");
      const content = input.value.trim();
      if (!content) return;

      const res = await apiRequest(`/posts/${post.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        alert("Failed to add comment");
        return;
      }
      input.value = "";
      await loadComments(post.id, commentsListEl);
    });

    feedContainer.appendChild(postEl);
  });
}

async function loadComments(postId, container) {
  container.textContent = "Loading...";
  const res = await apiRequest(`/posts/${postId}`);
  if (!res.ok) {
    container.textContent = "Failed to load comments";
    return;
  }
  const data = await res.json();
  const comments = data.comments || [];
  if (!comments.length) {
    container.innerHTML = "<p>No comments yet.</p>";
    return;
  }
  container.innerHTML = "";
  comments.forEach((c) => {
    const el = document.createElement("div");
    el.className = "comment";
    el.textContent = `${c.username}: ${c.content}`;
    container.appendChild(el);
  });
}

// New post form
newPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();
  if (!content) return;

  const res = await apiRequest("/posts", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert("Failed to create post: " + (err.message || res.status));
    return;
  }

  newPostForm.reset();
  await loadFeed();
});

export { loadFeed };

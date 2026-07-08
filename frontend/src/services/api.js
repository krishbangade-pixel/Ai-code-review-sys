
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function reviewCode(code, userId) {
  const response = await fetch(`${API_BASE_URL}/api/review/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to review code');
  }

  const data = await response.json();
  return data.review;
}

export async function reviewFiles(files, userId) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('user_id', userId);

  const response = await fetch(`${API_BASE_URL}/api/review/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to review files');
  }

  const data = await response.json();
  return data.review;
}

export async function reviewGithubRepo(repoUrl, userId) {
  const response = await fetch(`${API_BASE_URL}/api/review/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repo_url: repoUrl, user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to review repository');
  }

  const data = await response.json();
  return data.review;
}

export async function getReviews(userId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews?user_id=${encodeURIComponent(userId)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get reviews');
  }

  const data = await response.json();
  return data.reviews;
}

export async function getReviewById(reviewId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${encodeURIComponent(reviewId)}?user_id=${encodeURIComponent(userId)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get review');
  }

  const data = await response.json();
  return data; // Return the full object so we can access data.review in DetailedReport
}

export async function deleteReview(reviewId, userId) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete review');
  }

  const data = await response.json();
  return data;
}

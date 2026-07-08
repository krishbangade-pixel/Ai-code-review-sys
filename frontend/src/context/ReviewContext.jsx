
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import {
  reviewCode,
  reviewFiles,
  reviewGithubRepo,
  getReviews,
  deleteReview as deleteReviewApi,
} from '../services/api';

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!user?.id) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getReviews(user.id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReviewCode = async (code) => {
    if (!user?.id) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Analyzing your code...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewCode(code, user.id);
      setReviews((prev) => [newReview, ...prev]);
      toast.success('Code review complete!', { id: 'analyzing-toast' });
      return newReview.id;
    } catch (error) {
      console.error('Review failed:', error);
      toast.error(error.message || 'Analysis failed', { id: 'analyzing-toast' });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const addReviewFiles = async (files) => {
    if (!user?.id) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Analyzing your files...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewFiles(files, user.id);
      setReviews((prev) => [newReview, ...prev]);
      toast.success('Files reviewed!', { id: 'analyzing-toast' });
      return newReview.id;
    } catch (error) {
      console.error('Review failed:', error);
      toast.error(error.message || 'Analysis failed', { id: 'analyzing-toast' });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const addReviewGithub = async (repoUrl) => {
    if (!user?.id) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Cloning and analyzing repository...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewGithubRepo(repoUrl, user.id);
      setReviews((prev) => [newReview, ...prev]);
      toast.success('Repository reviewed!', { id: 'analyzing-toast' });
      return newReview.id;
    } catch (error) {
      console.error('Review failed:', error);
      toast.error(error.message || 'Analysis failed', { id: 'analyzing-toast' });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteReview = async (id) => {
    if (!user?.id) return;

    try {
      await deleteReviewApi(id, user.id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        analyzing,
        addReviewCode,
        addReviewFiles,
        addReviewGithub,
        deleteReview,
        refreshReviews: fetchReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);

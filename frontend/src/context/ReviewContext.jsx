
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import {
  reviewCode,
  reviewFiles,
  reviewGithubRepo,
  getReviews,
  deleteReview as deleteReviewApi,
} from '../services/api';

const ReviewContext = createContext(null);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ReviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const getAuthenticatedUserId = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.id || !UUID_REGEX.test(data.user.id)) {
      return null;
    }

    return data.user.id;
  }, []);

  const fetchReviews = useCallback(async () => {
    if (!user?.id) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const authenticatedUserId = await getAuthenticatedUserId();

      if (!authenticatedUserId) {
        setReviews([]);
        return;
      }

      const data = await getReviews(authenticatedUserId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthenticatedUserId, user?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReviewCode = async (code) => {
    const authenticatedUserId = await getAuthenticatedUserId();

    if (!authenticatedUserId) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Analyzing your code...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewCode(code, authenticatedUserId);
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
    const authenticatedUserId = await getAuthenticatedUserId();

    if (!authenticatedUserId) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Analyzing your files...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewFiles(files, authenticatedUserId);
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
    const authenticatedUserId = await getAuthenticatedUserId();

    if (!authenticatedUserId) {
      toast.error('You must be logged in to review code');
      return null;
    }

    setAnalyzing(true);
    toast.loading('Cloning and analyzing repository...', { id: 'analyzing-toast' });

    try {
      const newReview = await reviewGithubRepo(repoUrl, authenticatedUserId);
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
    const authenticatedUserId = await getAuthenticatedUserId();

    if (!authenticatedUserId) return;

    try {
      await deleteReviewApi(id, authenticatedUserId);
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

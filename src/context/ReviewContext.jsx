import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REVIEWS, mockCreateReview } from '../services/mockReviewService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('pulsar_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    localStorage.setItem('pulsar_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = async (reviewInput) => {
    if (!user) {
      toast.error('You must be logged in to review code');
      return null;
    }

    const creditCost = 10;
    if (user.credits < creditCost) {
      toast.error('Insufficient AI Credits! Please upgrade your tier or purchase credits.');
      return null;
    }

    setAnalyzing(true);
    toast.loading('PulsarAI is analyzing your code...', { id: 'analyzing-toast' });
    
    try {
      const newReview = await mockCreateReview(reviewInput);
      
      // Add the review
      setReviews(prev => [newReview, ...prev]);
      
      // Deduct credits
      updateProfile({
        credits: user.credits - creditCost
      });

      toast.success('Code analysis completed successfully!', { id: 'analyzing-toast' });
      return newReview.id;
    } catch (error) {
      toast.error('Analysis failed. Please try again.', { id: 'analyzing-toast' });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success(`Review ${id} deleted`);
  };

  const getReview = (id) => {
    return reviews.find(r => r.id === id);
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      analyzing,
      addReview,
      deleteReview,
      getReview
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);

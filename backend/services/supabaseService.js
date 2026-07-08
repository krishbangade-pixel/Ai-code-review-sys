
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

const transformReviewForFrontend = (review) => {
  return {
    ...review,
    id: review.id.toString(), // Convert bigint to string for frontend
    overallScore: review.overall_score,
    overall_score: review.overall_score,
    createdAt: review.created_at,
    created_at: review.created_at,
    aiReview: review.ai_review,
    ai_review: review.ai_review,
    staticAnalysis: review.static_analysis,
    static_analysis: review.static_analysis,
    metrics: review.metrics
  };
};

const supabaseService = {
  async saveReview(reviewData) {
    console.log('[supabaseService] Saving review to database...');
    console.log('[supabaseService] Payload:', JSON.stringify(reviewData, null, 2));
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();

    if (error) {
      console.error('[supabaseService] Error saving review:', error);
      throw new Error(`Error saving review: ${error.message}`);
    }

    console.log('[supabaseService] Review saved successfully:', data[0]);
    return transformReviewForFrontend(data[0]);
  },

  async getReviews(userId) {
    console.log('[supabaseService] Fetching reviews for user:', userId);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabaseService] Error fetching reviews:', error);
      throw new Error(`Error fetching reviews: ${error.message}`);
    }

    const transformed = data.map(transformReviewForFrontend);
    console.log('[supabaseService] Reviews fetched successfully:', transformed);
    return transformed;
  },

  async getReviewById(id, userId) {
    console.log('[supabaseService] Fetching review by ID:', id, 'for user:', userId);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[supabaseService] Error fetching review:', error);
      throw new Error(`Error fetching review: ${error.message}`);
    }

    const transformed = transformReviewForFrontend(data);
    console.log('[supabaseService] Review fetched successfully:', transformed);
    return transformed;
  },

  async deleteReview(id, userId) {
    console.log('[supabaseService] Deleting review with ID:', id, 'for user:', userId);
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('[supabaseService] Error deleting review:', error);
      throw new Error(`Error deleting review: ${error.message}`);
    }

    console.log('[supabaseService] Review deleted successfully');
    return { success: true };
  }
};

module.exports = supabaseService;

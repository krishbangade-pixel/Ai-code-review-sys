
const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

console.log('[supabaseService] SUPABASE_URL loaded:', Boolean(config.supabase.url));
console.log('[supabaseService] SUPABASE_SERVICE_ROLE_KEY loaded:', Boolean(config.supabase.serviceRoleKey));
console.log('[supabaseService] SUPABASE_SERVICE_ROLE_KEY length:', config.supabase.serviceRoleKey?.length || 0);

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
    console.log('User ID:', userId);
    console.log('[supabaseService] typeof userId:', typeof userId);
    console.log('[supabaseService] userId.length:', userId?.length);

    if (!UUID_REGEX.test(userId || '')) {
      const error = new Error(`Invalid user_id UUID: ${userId}`);
      error.statusCode = 400;
      throw error;
    }

    console.log('[supabaseService] Supabase query:', {
      table: 'reviews',
      select: '*',
      filter: { user_id: userId },
      order: { column: 'created_at', ascending: false }
    });

    const { data, error, status } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('Supabase response:', data);
    console.log('[supabaseService] Supabase status:', status);
    console.error('Supabase error:', error);

    if (error) {
      console.error('[supabaseService] Full Supabase error object:', error);
      const supabaseError = new Error(error.message);
      supabaseError.statusCode = status || 500;
      supabaseError.supabaseError = error;
      throw supabaseError;
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

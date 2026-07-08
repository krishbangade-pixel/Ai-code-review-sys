
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY
  },
  nodeEnv: process.env.NODE_ENV || 'development'
};

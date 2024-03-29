const {
  APP_URL,
  BASE_URL,
  DATABASE_URL,
  HASURA_KEY,
  HASURA_URL,
  HTTPS,
  PORT,
  NODE_ENV,
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_VERIFY_TOKEN,
} = (process.env as any) as { [key: string]: string };

const config = {
  APP_URL,
  BASE_URL,
  DATABASE_URL,
  DEV: NODE_ENV === 'development',
  HASURA_KEY,
  HASURA_URL,
  HTTPS: Boolean(HTTPS),
  NODE_ENV,
  PORT: Number(PORT),
  PROD: NODE_ENV === 'production',
  STRAVA_API_URL: 'https://api.strava.com/api/v3',
  STRAVA_CALLBACK_URL: `${BASE_URL}/strava/callback`,
  STRAVA_CLIENT_ID: Number(STRAVA_CLIENT_ID),
  STRAVA_CLIENT_SECRET,
  STRAVA_VERIFY_TOKEN,
};

export default config;

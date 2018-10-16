const {
  APP_URL,
  HTTPS,
  PORT,
  NODE_ENV,
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_VERIFY_TOKEN,
} = (process.env as any) as { [key: string]: string };

const options = {
  APP_URL,
  DEV: NODE_ENV === 'development',
  HTTPS: Boolean(HTTPS),
  NODE_ENV,
  PORT: Number(PORT),
  STRAVA_API_URL: 'https://api.strava.com/api/v3',
  STRAVA_CLIENT_ID: Number(STRAVA_CLIENT_ID),
  STRAVA_CLIENT_SECRET,
  STRAVA_VERIFY_TOKEN,
};

export default options;

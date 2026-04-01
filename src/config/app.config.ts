export default () => ({
  port: parseInt(process.env.PORT ?? '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'NestApp',
  env: process.env.APP_ENV || 'development',
  debug: process.env.APP_DEBUG === 'true',
  timezone: process.env.APP_TIMEZONE || 'UTC',
  locale: process.env.APP_LOCALE || 'en',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  redisUrl: process.env.REDIS_URL || 'localhost',
});

const config = {
  env: {
    apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    imageKit: {
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    },
    DatabaseUrl: process.env.NEXT_PUBLIC_DATABASE_URL!,
    upstach: {
      redisUrl: process.env.UPSTACH_REDIS_URL!,
      redisToken: process.env.UPSTACH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstachToken: process.env.NEXT_PUBLIC_QSTASH_TOKEN!,
      resendToken: process.env.RESEND_TOKEN!,
    },
  },
};
export default config;

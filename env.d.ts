declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_SECRET_KEY: string;
    NEXT_PUBLIC_DOMAIN: string;
    RESEND_API_KEY: string;
  }
}

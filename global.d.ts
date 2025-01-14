declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    API_KEY: string;
    DATABASE_URL: string;
    BLOB_READ_WRITE_TOKEN: string;
  }
}

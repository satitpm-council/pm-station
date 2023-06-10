/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Kiosk Service Account Client Email */
    KIOSK_CLIENT_EMAIL?: string;
    /** Kiosk Service Account Private Key */
    KIOSK_PRIVATE_KEY?: string;
    NEXT_PUBLIC_PUSHER_APP_ID: string;
    NEXT_PUBLIC_PUSHER_APP_KEY: string;
    NEXT_PUBLIC_PUSHER_APP_CLUSTER: string;
    PUSHER_APP_SECRET: string;
  }
}

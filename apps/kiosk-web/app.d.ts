/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Kiosk Service Account Client Email */
    KIOSK_CLIENT_EMAIL?: string;
    /** Kiosk Service Account Private Key */
    KIOSK_PRIVATE_KEY?: string;
  }
}

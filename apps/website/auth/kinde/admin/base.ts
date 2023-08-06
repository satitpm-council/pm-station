import ky from "ky";

export const kindeAdmin = ky.create({
  prefixUrl: `${process.env.KINDE_ISSUER}/api/v1`,
  headers: {
    Authorization: `Bearer ${process.env.KINDE_CLIENT_SECRET}`,
  },
});

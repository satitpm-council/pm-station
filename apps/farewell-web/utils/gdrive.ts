// We don't add the credentials in this project, instead we use the
// firebase-admin account with `Service Account Token Creator' role
// to impersonate and access on behalf of our kiosk account.
import { GoogleAuth, Impersonated } from "google-auth-library";
import { drive as gdrive } from "@googleapis/drive";
import type { JSONClient } from "google-auth-library/build/src/auth/googleauth";

const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: (process.env.FIREBASE_PRIVATE_KEY as string).replace(
      /\\n/g,
      "\n"
    ),
  },
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  scopes: [
    ...scopes,
    "https://www.googleapis.com/auth/iam",
    "https://www.googleapis.com/auth/cloud-platform",
  ],
});

let client: JSONClient;
let targetClient: Impersonated;

const drive = async () => {
  if (!client) {
    client = (await auth.getClient()) as JSONClient;
  }
  if (!targetClient) {
    targetClient = new Impersonated({
      sourceClient: client as JSONClient,
      targetPrincipal: process.env.IMAGES_SERVICE_ACCOUNT,
      lifetime: 10 * 60,
      delegates: [],
      targetScopes: scopes,
    });
  }
  await targetClient.getRequestHeaders();
  return gdrive({
    version: "v3",
    auth: targetClient,
  });
};

export default drive;

Cypress.Commands.add("requestToAuthEmulator", (method, url, body) => {
  const projectId = Cypress.env("FIREBASE_PROJECT_ID");
  return cy.request(
    method as string,
    `http://localhost:9099/emulator/v1/projects/${projectId}${url}`,
    body
  );
});

Cypress.Commands.add("clearFirestoreDb", () => {
  const projectId = Cypress.env("FIREBASE_PROJECT_ID");
  return cy.request(
    "DELETE",
    `http://localhost:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`
  );
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      requestToAuthEmulator<T = any>(
        method: HttpMethod,
        url: string,
        body?: RequestBody
      ): Chainable<Response<T>>;
      clearFirestoreDb(): Chainable<Response<any>>;
    }
  }
}

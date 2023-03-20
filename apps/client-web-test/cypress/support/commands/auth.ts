import type { User, UserRole } from "@station/shared/user";

type VerificationCodeResponse = {
  verificationCodes: Array<{
    code: string;
    phoneNumber: string;
    sessionInfo: string;
  }>;
};

type SendVerificationCodeResponse = {
  sessionInfo: string;
};

Cypress.Commands.add("login", (phoneNumber) => {
  // Intercept the OTP request, so we can retrieve the sessionInfo and find the verification code.
  cy.intercept({
    method: "POST",
    url: "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode*",
  }).as("sendCode");
  // Visit the login page.
  cy.visit("/pm-station");
  // Enter the phone number and submit.
  cy.get('input[type="tel"]').type(phoneNumber);
  cy.get('button[type="submit"]').click();
  // Wait for the OTP request to be intercepted.
  cy.wait("@sendCode").then((interception) => {
    // Retrieve the verification code from the auth emulator.
    cy.requestToAuthEmulator<VerificationCodeResponse>(
      "GET",
      "/verificationCodes"
    ).then((res) => {
      const { verificationCodes } = res.body;
      const { sessionInfo } = interception.response
        .body as SendVerificationCodeResponse;
      // Find the verification code that matches the sessionInfo.
      const code = verificationCodes.find(
        (code) => code.sessionInfo === sessionInfo
      )?.code;
      if (!code) {
        throw new Error(
          "Cannot find verification code from the current session."
        );
      }
      cy.get('input[type="text"]').type(code);
    });
  });
  // Submit the OTP.
  cy.get('button[type="submit"]').click();
  // Expected to be redirected to the application.
  cy.url().should("contain", "/pm-station/app");
});

Cypress.Commands.add("updateProfile", (phoneNumber, displayName, type) => {
  // Intercept the POST request to update the profile.
  cy.intercept("POST", "/pm-station/app/profile*").as("updateProfileReq");
  // Visit the profile page.
  cy.visit("/pm-station/app/profile");
  // Don't know why we need this line. React rerenders the component and Cypress can't find the input field.
  cy.wait(200);
  cy.get('input[name="displayName"]').clear().type(displayName);
  cy.get(`input[value="${type}"]`).check();
  cy.get(
    'form[action="/pm-station/app/profile"] > button[type="submit"]'
  ).click();
  // The update profile request should have a status code of 2XX (200 or 204)
  cy.wait("@updateProfileReq")
    .its("response.statusCode")
    .should("satisfy", (statusCode) => statusCode >= 200 && statusCode < 300);
  // Verify the user data that was set in the Firebase Auth Backend.
  cy.task("getUser", phoneNumber).then((user) => {
    expect(user.displayName).to.equal(displayName);
    expect(user.customClaims?.type).to.equal(type);
  });
});

Cypress.Commands.add("loginWithSession", () => {
  cy.session(
    "session",
    () => {
      cy.login("0812345678");
    },
    {
      validate: () => {
        cy.getCookie("__session").should("exist");
      },
    }
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logins the user to the PM Station Website using the given phone number.
       */
      login(phoneNumber: string): Chainable<void>;
      /**
       * Update the current user profile to the given display name and type.
       * @param phoneNumber {string} The phone number of the user
       * @param displayName {string} The display name of the user
       * @param type {User["type"]} The type of the user
       */
      updateProfile(
        phoneNumber: string,
        displayName: string,
        type: User["type"]
      ): Chainable<void>;
      /**
       * Logins the user to the PM Station Website,
       * assigned any roles and permissions, and persisted into the session.
       * @param role {UserRole} The role of the user to login as
       */
      loginWithSession(role?: UserRole): Chainable<void>;
    }
  }
}

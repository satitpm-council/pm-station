before(() => {
  cy.requestToAuthEmulator("DELETE", "/accounts");
});

describe("Authentication : Register and Login", () => {
  const mockPhoneNo = Cypress.env("MOCK_PHONE_NUMBER");

  beforeEach(() => {
    // in this spec file, we will use the mock user to login
    // don't save the session since we are testing the login flow
    cy.login(mockPhoneNo);
  });

  it("can register a newly signed-in user", () => {
    // The new user should already be redirected to the profile page
    cy.url().should("satisfy", (url) =>
      url.endsWith("/pm-station/app/profile")
    );
    // The phone number should be the same as the one we used to login
    cy.get('input[name="phoneNumber"]').should(
      "have.value",
      `+66${mockPhoneNo.replace(/^0/, "")}`
    );
    // Update the profile
    cy.updateProfile(mockPhoneNo, "Test User", "student");
    // Website should redirect to home page
    cy.url().should("satisfy", (url) => url.endsWith("/pm-station/app"));
  });

  it("can update the user profile", () => {
    // Update the profile
    cy.updateProfile(mockPhoneNo, "New Test User", "student");
    // Website should redirect to home page
    cy.url().should("satisfy", (url) =>
      url.endsWith("/pm-station/app/profile")
    );
  });
});

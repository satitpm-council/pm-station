describe("Authentication : Register and Login", () => {
  const mockPhoneNo = Cypress.env("MOCK_PHONE_NUMBER");

  beforeEach(() => {
    // in this spec file, we will use the mock user to login
    cy.login(mockPhoneNo);
  });

  it("matches the current login user", () => {
    cy.visit("/pm-station/app/profile");
    cy.get('input[name="phoneNumber"]').should(
      "have.value",
      `+66${mockPhoneNo.replace(/^0/, "")}`
    );
  });

  it("can register a newly signed-in user", () => {
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

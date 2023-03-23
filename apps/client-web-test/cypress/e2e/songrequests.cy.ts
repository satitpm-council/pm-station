import { User, UserRole } from "@station/shared/user";
import spotifySearch from "../fixtures/spotify.search.json";

before(() => {
  cy.clearFirestoreDb();
});

describe("Submit Songrequests", () => {
  const searchSong = "ไม่อยากฟัง";
  const firstResult = spotifySearch[0];

  const selectSong = () => {
    cy.visit("/pm-station/app/songrequests");
    cy.wait(200);

    cy.get('input[name="q"]')
      .type(searchSong)
      .then((elem) => {
        elem.parent("form").find("button[type='submit']").trigger("click");
      });
    cy.wait("@searchSongRequest").then(() => {
      // Expect the URL to be equal to the search query
      cy.url().should("include", `q=${encodeURIComponent(searchSong)}`);
      // Expect the ".songrequest-item" count to be equal to the number of items in the fixture
      cy.get(".songrequest-item").should("have.length", spotifySearch.length);
    });

    cy.get(".songrequest-item").first().click();
    cy.get('[role="dialog"]')
      .find("button[data-testid='select-track']")
      .click();
  };

  let user: User;

  beforeEach(() => {
    cy.loginWithSession(UserRole.USER);
    cy.interceptRemixHandler(
      "GET",
      {
        pathname: "/songrequests/search",
        query: {
          q: searchSong,
        },
        asRoute: "/songrequests/__user/search",
      },
      spotifySearch
    ).as("searchSongRequest");
  });

  it("can search and select a song from client", () => {
    selectSong();
    cy.url().should("include", "/pm-station/app/songrequests/select");
    cy.getUser().then((u) => {
      user = u;
    });
  });

  it("has a song submitted in the database", function () {
    cy.wait(2000);
    cy.task("getSongRequestSubmission", {
      trackId: firstResult.id,
      userId: user.uid,
    }).then((submission) => {
      expect(submission.submittedBy).to.equal(user.uid);
      expect(submission.trackId).to.equal(firstResult.id);
    });
    cy.task("getSongRequestRecord", firstResult.id).then((track) => {
      expect(track.id).to.equal(firstResult.id);
      expect(track.name).to.equal(firstResult.name);
    });
  });
});

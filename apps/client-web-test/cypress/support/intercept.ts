import { RouteHandler } from "cypress/types/net-stubbing";

export {};

Cypress.Commands.add("interceptRemixHandler", (method, route, routeHandler) => {
  const prefix = "/pm-station/app";
  route = typeof route === "string" ? { pathname: route } : route;
  return cy.intercept(
    {
      method: method as "GET" | "POST",
      pathname: route.pathname === "*" ? "*" : prefix + route.pathname,
      query: {
        ...(route.query ?? {}),
        _data: `routes${prefix + (route.asRoute ?? route.pathname)}`,
      },
    },
    routeHandler
  );
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Intercept Remix loaders and actions from the PM Station App.
       * Supports additional search parameters to be appended to the request URL.
       *
       * It use `cy.intercept()` under the hood to stub and intercept HTTP requests and responses.
       *
       * @see https://on.cypress.io/intercept
       * @example
       *    cy.interceptRemixHandler('GET', 'http://foo.com/fruits', ['apple', 'banana', 'cherry'])
       */
      interceptRemixHandler(
        method: "GET" | "POST",
        route:
          | string
          | {
              pathname: string;
              query?: Record<string, string>;
              /**
               * If the loader or action is not the same as the route, you can specify it here.
               */
              asRoute?: string;
            },
        routeHandler?: RouteHandler
      ): Chainable<null>;
    }
  }
}

/// <reference types="Cypress" />
/* global expect */

const homepage = "http://localhost:8081/-size-check-";

describe("brick size check", () => {
  it("should work", () => {
    cy.exec(`cat /dev/null > size-check.log`);

    cy.visit(`${homepage}/-`);

    cy.contains("This is size-check index!");

    cy.get("#main-mount-point > ul > li").then((elements) => {
      expect(elements.length).to.be.greaterThan(0);
      const bricks = elements.map((i, el) => el.textContent).get();
      for (const brick of bricks) {
        cy.visit(`${homepage}/${brick}`, {
          onBeforeLoad(win) {
            cy.spy(win.console, "error").as("console.error");
          },
        });
        cy.contains("This is size-check!");
        cy.get("@console.error").should("not.be.called");

        cy.window().then((win) => {
          const { performance } = win;
          const resources = performance.getEntriesByType("resource");
          let total = 0;
          resources.map((resource) => {
            if (
              resource.name.startsWith(
                "http://localhost:8081/sa-static/-/bricks/"
              )
            ) {
              total += resource.transferSize;
            }
          });
          cy.exec(
            `echo "${brick}: ${Math.ceil(
              total / 1024
            ).toLocaleString()} KB" >> size-check.log`
          );
        });
      }
    });
  });
});

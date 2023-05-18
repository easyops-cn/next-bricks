/// <reference types="Cypress" />
/* global expect */

const homepage = "http://localhost:8081/-size-check-";
const resourceUrlPrefix = "http://localhost:8081/sa-static/-/bricks/";

describe("brick size check", () => {
  it("all together", () => {
    cy.exec(`echo "# --- Load all bricks together --" > size-check.log.yml`);

    cy.visit(`${homepage}/all`, {
      onBeforeLoad(win) {
        cy.spy(win.console, "error").as("console.error");
      },
    });
    cy.contains("This is size-check!");
    cy.get("@console.error").should("not.be.called");

    cy.window().then((win) => {
      const { performance } = win;
      const resources = performance.getEntriesByType("resource");
      let others = 0;
      let total = 0;
      const deps = new Map();
      resources.map((resource) => {
        if (resource.name.startsWith(resourceUrlPrefix)) {
          total += resource.transferSize;
          const resourcePkg = resource.name
            .substring(resourceUrlPrefix.length)
            .split("/", 1)[0];
          deps.set(
            resourcePkg,
            (deps.get(resourcePkg) ?? 0) + resource.transferSize
          );
        } else {
          others += resource.transferSize;
        }
      });
      cy.exec(`echo "Core: ${getSizeInKB(others)}" >> size-check.log.yml`);
      cy.exec(`echo "All bricks: ${getSizeInKB(total)}" >> size-check.log.yml`);
      cy.exec(`echo "Packages:" >> size-check.log.yml`);
      if (deps.size > 0) {
        for (const [pkg, size] of deps.entries()) {
          cy.exec(
            `echo "  ${pkg}: ${getSizeInKB(size)}" >> size-check.log.yml`
          );
        }
      }
    });
  });

  it("by each package", () => {
    cy.exec(`echo "" >> size-check.log.yml`);
    cy.exec(
      `echo "# --- Load bricks by each package --" >> size-check.log.yml`
    );

    cy.visit(`${homepage}/packages/-`);

    cy.contains("This is size-check index!");

    cy.get("#main-mount-point > ul > li").then((elements) => {
      expect(elements.length).to.be.greaterThan(0);
      const pkgNames = elements.map((i, el) => el.textContent).get();
      for (const pkgName of pkgNames) {
        cy.visit(`${homepage}/packages/${pkgName}`, {
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
          let self = 0;
          const deps = new Map();
          resources.map((resource) => {
            if (resource.name.startsWith(resourceUrlPrefix)) {
              total += resource.transferSize;
              const resourcePkg = resource.name
                .substring(resourceUrlPrefix.length)
                .split("/", 1)[0];
              if (resourcePkg === pkgName) {
                self += resource.transferSize;
              } else {
                deps.set(
                  resourcePkg,
                  (deps.get(resourcePkg) ?? 0) + resource.transferSize
                );
              }
            }
          });
          cy.exec(`echo "${pkgName}:" >> size-check.log.yml`);
          cy.exec(
            `echo "  total: ${getSizeInKB(total)}" >> size-check.log.yml`
          );
          if (deps.size > 0) {
            cy.exec(`echo "  details:" >> size-check.log.yml`);
            cy.exec(
              `echo "    <self>: ${getSizeInKB(self)}" >> size-check.log.yml`
            );
            for (const [pkg, size] of deps.entries()) {
              cy.exec(
                `echo "    ${pkg}: ${getSizeInKB(size)}" >> size-check.log.yml`
              );
            }
          }
        });
      }
    });
  });

  it.skip("by each brick", () => {
    cy.exec(`echo "" >> size-check.log.yml`);
    cy.exec(`echo "# --- Load by each brick --" >> size-check.log.yml`);

    cy.visit(`${homepage}/-`);

    cy.contains("This is size-check index!");

    cy.get("#main-mount-point > ul > li").then((elements) => {
      expect(elements.length).to.be.greaterThan(0);
      const items = elements.map((i, el) => el.textContent).get();
      for (const item of items) {
        const [pkgName, brick] = item.split(":");
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
          let self = 0;
          const deps = new Map();
          resources.map((resource) => {
            if (resource.name.startsWith(resourceUrlPrefix)) {
              total += resource.transferSize;
              const resourcePkg = resource.name
                .substring(resourceUrlPrefix.length)
                .split("/", 1)[0];
              if (resourcePkg === pkgName) {
                self += resource.transferSize;
              } else {
                deps.set(
                  resourcePkg,
                  (deps.get(resourcePkg) ?? 0) + resource.transferSize
                );
              }
            }
          });
          cy.exec(
            `echo "${brick}: ${getSizeInKB(total)}" >> size-check.log.yml`
          );
          if (deps.size > 0) {
            cy.exec(
              `echo "  <self>: ${getSizeInKB(self)}" >> size-check.log.yml`
            );
            for (const [pkg, size] of deps.entries()) {
              cy.exec(
                `echo "  ${pkg}: ${getSizeInKB(size)}" >> size-check.log.yml`
              );
            }
          }
        });
      }
    });
  });
});

function getSizeInKB(size) {
  return `${Math.ceil(size / 1024).toLocaleString()} KB`;
}

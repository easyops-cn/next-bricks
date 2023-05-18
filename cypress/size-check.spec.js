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
      let react = 0;
      const deps = new Map();
      resources.map((resource) => {
        if (resource.name.startsWith(resourceUrlPrefix)) {
          total += resource.transferSize;
          if (
            /\/chunks\/(?:2?784|(?:2?8)?316)\.[0-9a-f]+\.js$/.test(
              resource.name
            )
          ) {
            react += resource.transferSize;
          } else {
            const resourcePkg = resource.name
              .substring(resourceUrlPrefix.length)
              .split("/", 1)[0];
            deps.set(
              resourcePkg,
              (deps.get(resourcePkg) ?? 0) + resource.transferSize
            );
          }
        } else {
          others += resource.transferSize;
        }
      });
      const lines = [];
      lines.push(
        `Core: ${getSizeInKB(others)}`,
        `All bricks: ${getSizeInKB(total)}`,
        `Packages:`
      );
      if (react > 0) {
        lines.push(`  <react>: ${getSizeInKB(react)}`);
      }
      if (deps.size > 0) {
        for (const [pkg, size] of deps.entries()) {
          lines.push(`  ${pkg}: ${getSizeInKB(size)}`);
        }
      }
      cy.exec(`echo "${lines.join("\n")}" >> size-check.log.yml`);
    });
  });

  it("by each package", () => {
    cy.exec(
      `echo "\n# --- Load bricks by each package --" >> size-check.log.yml`
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
          let react = 0;
          const deps = new Map();
          resources.map((resource) => {
            if (resource.name.startsWith(resourceUrlPrefix)) {
              total += resource.transferSize;
              if (
                /\/chunks\/(?:2?784|(?:2?8)?316)\.[0-9a-f]+\.js$/.test(
                  resource.name
                )
              ) {
                react += resource.transferSize;
              } else {
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
            }
          });

          const lines = [];
          lines.push(`${pkgName}:`, `  total: ${getSizeInKB(total)}`);
          if (deps.size > 0 || react > 0) {
            lines.push("  details:", `    <self>: ${getSizeInKB(self)}`);
            if (react > 0) {
              lines.push(`    <react>: ${getSizeInKB(react)}`);
            }
            if (deps.size > 0) {
              for (const [pkg, size] of deps.entries()) {
                lines.push(`    ${pkg}: ${getSizeInKB(size)}`);
              }
            }
          }
          cy.exec(`echo "${lines.join("\n")}" >> size-check.log.yml`);
        });
      }
    });
  });

  it("by each brick", () => {
    cy.exec(`echo "\n# --- Load by each brick --" >> size-check.log.yml`);

    cy.visit(`${homepage}/-`);

    cy.contains("This is size-check index!");

    cy.get("#main-mount-point > ul > li").then((elements) => {
      expect(elements.length).to.be.greaterThan(0);
      const items = elements.map((i, el) => el.textContent).get();
      const printedPkgs = new Set();
      for (const item of items) {
        const [pkgName, brick] = item.split(":");
        if (!printedPkgs.has(pkgName)) {
          printedPkgs.add(pkgName);
          cy.exec(`echo "\n# Package: ${pkgName}" >> size-check.log.yml`);
        }
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
          let react = 0;
          const deps = new Map();
          resources.map((resource) => {
            if (resource.name.startsWith(resourceUrlPrefix)) {
              total += resource.transferSize;
              if (
                /\/chunks\/(?:2?784|(?:2?8)?316)\.[0-9a-f]+\.js$/.test(
                  resource.name
                )
              ) {
                react += resource.transferSize;
              } else {
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
            }
          });

          const lines = [];
          lines.push(`${brick}:`, `  total: ${getSizeInKB(total)}`);
          if (deps.size > 0 || react > 0) {
            lines.push("  details:", `    <self>: ${getSizeInKB(self)}`);
            if (react > 0) {
              lines.push(`    <react>: ${getSizeInKB(react)}`);
            }
            if (deps.size > 0) {
              for (const [pkg, size] of deps.entries()) {
                lines.push(`    ${pkg}: ${getSizeInKB(size)}`);
              }
            }
          }
          cy.exec(`echo "${lines.join("\n")}" >> size-check.log.yml`);
        });
      }
    });
  });
});

function getSizeInKB(size) {
  return `${Math.ceil(size / 1024).toLocaleString()} KB`;
}

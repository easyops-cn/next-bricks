/// <reference types="Cypress" />
/* global expect */

const homepage = "http://localhost:8081/-size-check-";
const resourceUrlPrefix = "http://localhost:8081/sa-static/-/bricks/";

describe("brick size check", () => {
  it("all together", () => {
    cy.exec(`echo "# --- Load all bricks together --" > size-check.log.yml`);

    cy.visit(`${homepage}/all`, {
      onBeforeLoad(win) {
        win.performance.setResourceTimingBufferSize(3000);
        cy.spy(win.console, "error").as("console.error");
      },
    });
    cy.contains("This is size-check!", {
      timeout: 6e4,
    });
    cy.get("@console.error").should("not.be.called");

    cy.window().then(async (win) => {
      const { performance } = win;
      const resources = performance.getEntriesByType("resource");
      let others = 0;
      let total = 0;
      let react = 0;
      const deps = new Map();
      await Promise.all(
        resources.map(async (resource) => {
          if (
            resource.name.startsWith(resourceUrlPrefix) &&
            !resource.name.endsWith(".LICENSE.txt")
          ) {
            total += resource.transferSize;
            if (await isReactChunk(resource.name)) {
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
        })
      );
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
        const entries = [...deps.entries()];
        entries.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
        for (const [pkg, size] of entries) {
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
      const pkgNames = elements.map((_i, el) => el.textContent).get();
      pkgNames.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
      for (const pkgName of pkgNames) {
        cy.visit(`${homepage}/packages/${pkgName}`, {
          onBeforeLoad(win) {
            cy.spy(win.console, "error").as("console.error");
          },
        });
        cy.contains("This is size-check!");
        cy.get("@console.error").should("not.be.called");

        cy.window().then(async (win) => {
          const { performance } = win;
          const resources = performance.getEntriesByType("resource");
          let total = 0;
          let self = 0;
          let react = 0;
          const deps = new Map();
          await Promise.all(
            resources.map(async (resource) => {
              if (
                resource.name.startsWith(resourceUrlPrefix) &&
                !resource.name.endsWith(".LICENSE.txt")
              ) {
                total += resource.transferSize;
                if (await isReactChunk(resource.name)) {
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
            })
          );

          const lines = [];
          lines.push(`${pkgName}:`, `  total: ${getSizeInKB(total)}`);
          if (deps.size > 0 || react > 0) {
            lines.push("  details:", `    <self>: ${getSizeInKB(self)}`);
            if (react > 0) {
              lines.push(`    <react>: ${getSizeInKB(react)}`);
            }
            if (deps.size > 0) {
              const entries = [...deps.entries()];
              entries.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
              for (const [pkg, size] of entries) {
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
      const items = elements.map((_i, el) => el.textContent).get();
      items.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
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

        cy.window().then(async (win) => {
          const { performance } = win;
          const resources = performance.getEntriesByType("resource");
          let total = 0;
          let self = 0;
          let react = 0;
          const deps = new Map();
          const byFiles = new Map();

          await Promise.all(
            resources.map(async (resource) => {
              if (
                resource.name.startsWith(resourceUrlPrefix) &&
                !resource.name.endsWith(".LICENSE.txt")
              ) {
                total += resource.transferSize;
                if (await isReactChunk(resource.name)) {
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
                // Remove the version part from the file path
                const filePath = resource.name
                  .substring(resourceUrlPrefix.length)
                  .replace(/([^/]+\/)\d+\.\d+\.\d+\//, "$1");
                byFiles.set(filePath, resource.transferSize);
              }
            })
          );

          const lines = [];
          lines.push(`${brick}:`, `  total: ${getSizeInKB(total)}`);
          if (deps.size > 0 || react > 0) {
            lines.push("  details:", `    <self>: ${getSizeInKB(self)}`);
            if (react > 0) {
              lines.push(`    <react>: ${getSizeInKB(react)}`);
            }
            if (deps.size > 0) {
              const entries = [...deps.entries()];
              entries.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
              for (const [pkg, size] of entries) {
                lines.push(`    ${pkg}: ${getSizeInKB(size)}`);
              }
            }
          }
          if (byFiles.size > 0) {
            lines.push("  files:");
            const entries = [...byFiles.entries()];
            entries.sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
            for (const [file, size] of entries) {
              lines.push(`    ${file}: ${getSizeInKB(size)}`);
            }
          }
          cy.exec(`echo "${lines.join("\n")}" >> size-check.log.yml`);
        });
      }
    });
  });
});

function getSizeInKB(size) {
  return `${(+(size / 1024).toFixed(2)).toLocaleString()} KB`;
}

async function isReactChunk(resourceName) {
  const response = await fetch(`${resourceName}.LICENSE.txt`);
  if (response.ok) {
    const license = await response.text();
    if (
      license.includes("@license React") &&
      /(?:react(?:-dom(?:-client)?)?|scheduler)\.production(?:\.min)?\.js/.test(
        license
      )
    ) {
      return true;
    }
  }
  return false;
}

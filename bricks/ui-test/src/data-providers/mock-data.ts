export const mockDataList = [
  {
    alias: "example to-do app",
    type: "describe",
    children: [
      {
        alias: "beforeEach hooks",
        type: "beforeEach",
        children: [
          {
            type: "code",
            params: {
              content: "cy.visit('http://localhost:3000')",
            },
          },
          {
            type: "preset",
            name: "login",
            params: {
              useName: "easyops",
              password: 123456,
            },
          },
        ],
      },
      {
        alias: "displays two todo items by default in case 1",
        type: "case",
        children: [
          {
            type: "code",
            params: {
              content: "cy.get('.todo-list li').should('have.length', 2)",
            },
          },
          {
            type: "code",
            params: {
              content:
                "cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')",
            },
          },
          {
            type: "code",
            params: {
              content:
                "cy.get('.todo-list li').last().should('have.text', 'Walk the dog')",
            },
          },
        ],
      },
      {
        alias: "with a checked task in new describe",
        type: "describe",
        children: [
          {
            alias: "beforeEach hooks",
            type: "beforeEach",
            children: [
              {
                type: "code",
                params: {
                  content:
                    "cy.contains('Pay electric bill').parent().find('input[type=checkbox]').check()",
                },
              },
            ],
          },
          {
            alias: "can filter for uncompleted tasks in case 1",
            type: "case",
            children: [
              {
                type: "code",
                params: {
                  content:
                    "cy.contains('Active').click();\ncy.get('.todo-list li') .should('have.length', 1) .first() .should('have.text', 'Walk the dog');\ncy.contains('Pay electric bill').should('not.exist')",
                },
              },
            ],
          },
          {
            alias: "can filter for completed tasks in case 2",
            type: "case",
            children: [
              {
                type: "code",
                params: {
                  content: "cy.contains('Completed').click()",
                },
              },
              {
                type: "preset",
                name: "viewItem",
                params: {
                  text: "第一项",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

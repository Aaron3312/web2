describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173/web2/", { timeout: 10000 }); // Espera hasta 10 segundos

    /* ==== Generated with Cypress Studio ==== */
    cy.get('[href="#/peliculas"]', { timeout: 8000 }).click(); // Espera hasta 8 segundos
    cy.get('[href="#/series"]').click();
    cy.get('[href="#/estrenos"]').click();
    cy.get(':nth-child(2) > .bg-black', { timeout: 20000 }).click();
    cy.get('.justify-between').click();
    cy.get('[href="#/series"]').click();
    cy.get(':nth-child(2) > .relative > .absolute', { timeout: 10000 }).click();
    cy.get(':nth-child(2) > .aspect-\\[2\\/3\\] > .w-full', { timeout: 10000 }).click();
    /* ==== End Cypress Studio ==== */
  });
});
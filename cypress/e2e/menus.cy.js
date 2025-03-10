describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:5173/web2/", { timeout: 10000 }); // Espera hasta 10 segundos

		/* ==== Generated with Cypress Studio ==== */
		cy.get('[href="#/peliculas"]', { timeout: 8000 }).click(); // Espera hasta 8 segundos
		cy.get('[href="#/series"]').click();
		cy.get('[href="#/estrenos"]').click();
		cy.get(":nth-child(2) > .bg-black", { timeout: 20000 }).click();
		cy.get(".justify-between").click();
		cy.get('[href="#/series"]').click();
		cy.get(":nth-child(2) > .relative > .absolute", { timeout: 10000 }).click();
		cy.get(".border-b > .flex > :nth-child(2)").click();
		cy.get(".mt-8 > .flex > :nth-child(3)").click();
		cy.get(".mt-8 > .flex > :nth-child(1)").click();
		cy.get('.md\\:flex > [href="#/"]').click();
		cy.get('[href="#/peliculas"]').click();
		cy.get('[href="#/series"]').click();
		cy.get('[href="#/estrenos"]').click();
		/* ==== End Cypress Studio ==== */
	});
});

describe("template spec", () => {
	it("passes", () => {
		cy.visit("http://localhost:5173/web2/", { timeout: 10000 }); // Espera hasta 10 segundos
		/* ==== Generated with Cypress Studio ==== */
		cy.get('[href="#/peliculas"]').click();
		cy.get(".overflow-x-auto > .flex > :nth-child(1)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(2)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(3)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(4)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(5)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(6)").click();
		cy.get(".md\\:flex-row > .flex > :nth-child(1)").select([2]);
		cy.get(".md\\:flex-row > .flex > :nth-child(1)").select([3]);
		cy.get(".md\\:flex-row > .flex > :nth-child(2)").select(
			"vote_average.desc"
		);
		cy.get(".md\\:flex-row > .flex > :nth-child(2)").select(
			"primary_release_date.desc"
		);
		cy.get(".md\\:flex-row > .flex > :nth-child(2)").select("revenue.desc");
		cy.get(".md\\:flex-row > .flex > :nth-child(2)").select("title.asc");
		cy.get(".overflow-x-auto > .flex > :nth-child(4)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(3)").click();
		cy.get(".overflow-x-auto > .flex > :nth-child(2)").click();
		cy.get(".md\\:flex-row > .flex > :nth-child(1)").select([3]);
		cy.get(".md\\:flex-row > .flex > :nth-child(1)").select([2]);
		cy.get(".overflow-x-auto > .flex > :nth-child(1)").click();
		cy.get(".mt-10 > .flex > :nth-child(3)").click();
		cy.get(":nth-child(17) > .bg-black > div.text-white > .mt-2").click();
		cy.get(".border-b > .flex > :nth-child(2)").click();
		cy.get(".mt-8 > .flex > :nth-child(3)").click();
		cy.get(":nth-child(2) > .aspect-\\[2\\/3\\] > .w-full").click();
		cy.get(".border-b > .flex > :nth-child(2)").click();
		cy.get(".mt-8 > .flex > :nth-child(1)").click();
		cy.get(".mt-8 > .flex > :nth-child(3)").click();
		cy.get(":nth-child(2) > .aspect-\\[2\\/3\\] > .w-full").click();
		/* ==== End Cypress Studio ==== */
	});
});

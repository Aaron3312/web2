describe("template spec", () => {
	it("passes", () => {
        cy.visit("http://localhost:5173/web2/");

        /* ==== Generated with Cypress Studio ==== */
        cy.get('[style="transform: translateX(0%); transition: transform 0.5s ease-out; z-index: 5;"] > .flex-col > .max-w-xl > .bg-red-600').click();
        cy.get('.border-b > .flex > :nth-child(2)').click();
        cy.get('.mt-8 > .flex > :nth-child(3)').click();
        cy.get('.mt-8 > .flex > :nth-child(4)').click();
        cy.get(':nth-child(2) > .aspect-\\[2\\/3\\] > .w-full').click();
        cy.get(':nth-child(3) > .aspect-\\[2\\/3\\] > .w-full').click();
        cy.get(':nth-child(2) > .aspect-\\[2\\/3\\] > .w-full').click();
        cy.get(':nth-child(2) > .aspect-\\[2\\/3\\] > .w-full').click();
        cy.get('.text-blue-500').click();
        /* ==== End Cypress Studio ==== */
    });
});

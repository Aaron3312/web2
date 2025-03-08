describe("template spec", () => {
	it("passes", () => {
        cy.visit("http://localhost:5173/web2/");


        /* ==== Generated with Cypress Studio ==== */
        cy.get('[href="#/series"]').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(1)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(2)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(3)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(4)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(5)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(6)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(7)').click();
        cy.get(':nth-child(2) > .relative > .absolute').click();
        cy.get('.border-b > .flex > :nth-child(2)').click();
        cy.get('.mt-8 > .flex > :nth-child(3)').click();
        cy.get('.mt-8 > .flex > :nth-child(1)').click();
        cy.get('[href="#/series"]').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(2)').click();
        cy.get('.md\\:flex-row > .flex > :nth-child(1)').select('337');
        cy.get('.md\\:flex-row > .flex > :nth-child(2)').select('vote_average.desc');
        cy.get('.md\\:flex-row > .flex > :nth-child(1)').select('213');
        cy.get('.md\\:flex-row > .flex > :nth-child(2)').select('first_air_date.desc');
        cy.get('.md\\:flex-row > .flex > :nth-child(1)').select('337');
        cy.get('.md\\:flex-row').click();
        cy.get('.md\\:flex-row > .flex > :nth-child(1)').select('359');
        cy.get('.overflow-x-auto > .flex > :nth-child(3)').click();
        cy.get('.overflow-x-auto > .flex > :nth-child(1)').click();
        cy.get(':nth-child(2) > .relative > .absolute').click();
        cy.get('.border-b > .flex > :nth-child(2)').click();
        cy.get('.mt-8 > .flex > :nth-child(3)').click();
        cy.get('.mt-8 > .flex > :nth-child(4)').click();
        cy.get('.mt-8 > .flex > :nth-child(1)').click();
        cy.get(':nth-child(2) > .aspect-\\[2\\/3\\] > .w-full').click();
        cy.get(':nth-child(3) > .p-3 > .flex > .text-yellow-500').click();
        /* ==== End Cypress Studio ==== */
    });
});

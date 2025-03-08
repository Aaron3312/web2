describe("template spec", () => {
	it("passes", () => {
        cy.visit("http://localhost:5173/web2/");


        /* ==== Generated with Cypress Studio ==== */
        cy.get('.hidden > .flex > .bg-blue-600').click();
        cy.get('#email').type('test1@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('.space-y-4 > .bg-blue-600').click();
        cy.get('.mt-4 > .w-full').click();
        cy.get('.mt-4 > .bg-blue-600').click();
        cy.get('[href="#/dashboard"]').click();

        /* ==== End Cypress Studio ==== */
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-2xl > .text-blue-500').click();        
        cy.get('[href="#/dashboard"]').click();
        cy.get('.space-x-4').click();
        cy.get('.md\\:flex > .text-xl').click();
        cy.get('[href="#/peliculas"]').click();
        cy.get(':nth-child(1) > .bg-black > div.text-white > .mt-2').click();
        cy.get('.mt-4 > .bg-blue-600').click();
        cy.get('.md\\:flex > .text-xl').click();
        cy.get('.bg-black').click();
        cy.get('.bg-yellow-500').click();
        cy.get('.mt-4 > .bg-blue-600').click();
        cy.get('.bg-yellow-500').click();
        cy.get('[href="#/dashboard"]').click();
        cy.get('.mt-4 > .w-full').click();
        cy.get('.mt-4 > .bg-blue-600').click();
        cy.get('.mt-4 > .w-full').click();
        cy.get('.mt-4 > .w-full').click();
        cy.get('.mt-4 > .w-full').click();
        cy.get('.mt-4 > .bg-blue-600').click();
        cy.get('.bg-red-600').click();
        /* ==== End Cypress Studio ==== */
    });
});

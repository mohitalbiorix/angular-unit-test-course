
beforeEach(() => {
    cy.fixture('courses.json').as("coursesJSON");
    cy.intercept("http://localhost:9000/api/courses");
    cy.visit("/");
});

describe('First page', () => {

    it('should be visit home page', () => {
        cy.visit("/");
        cy.contains("All Courses");
    });

    it('should be visit about page', () => {
        cy.visit("/about");
        cy.contains("Welcome to the Angular Testing Course");
    });

    it('should be visit about page on click', () => {
        cy.visit("/");
        cy.contains("ABOUT").click();
        cy.url().should('include', '/about');
    });

    it('should display a list of courses', () => {
        cy.contains("All Courses");
        cy.get("mat-card").should("have.length", 9);
    });

    it('should display an advance courses', () => {
        cy.get('.mat-mdc-tab-label-container .mat-mdc-tab-labels .mat-mdc-tab').should("have.length", 2);
        cy.get('.mat-mdc-tab-label-container .mat-mdc-tab-labels .mat-mdc-tab').last().click();
        cy.get('.mat-mdc-tab-body-active .mat-mdc-card').its('length').should('be.gt', 1);
        cy.get('.mat-mdc-tab-body-active .mat-mdc-card .mat-mdc-card-title').first().should('contain', "Angular Security Course - Web Security Fundamentals");
    });

});

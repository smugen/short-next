/// <reference types="Cypress" />

beforeEach(() => {
  cy.visit('/sys/login');
  cy.url().should('include', '/sys/login');
});

describe('switch between sign in and sign up forms', () => {
  it('should show sign in form and switch to sign up form back and forth', () => {
    cy.get('h1').contains('Sign In');
    cy.get('button').contains('Sign Up').click();
    cy.get('h1').contains('Sign Up');
    cy.get('button').contains('Sign In').click();
    cy.get('h1').contains('Sign In');
  });

  it('should preserve username email and password inputs', () => {
    const admin = 'admin';
    const password = 'pswd';
    cy.get('[name="email"]').type(admin);
    cy.get('[name="password"]').type(password);
    cy.get('button').contains('Sign Up').click();
    cy.get('[name="email"]').should('have.value', admin);
    cy.get('[name="password"]').should('have.value', password);
    cy.get('button').contains('Sign In').click();
    cy.get('[name="email"]').should('have.value', admin);
    cy.get('[name="password"]').should('have.value', password);
  });
});

describe('sign up then sign in', () => {
  const email = `${crypto.randomUUID()}@example.com`;
  const password = 'pswd';

  it('should sign up then sign in', () => {
    cy.get('button').contains('Sign Up').click();
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password);
    cy.get('button').contains('Sign Up').click();
    cy.get('h1').contains('Sign In');
    cy.get('[name="email"]').should('have.value', email);
    cy.get('[name="password"]').should('have.value', password);
    cy.get('button').contains('Sign In').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

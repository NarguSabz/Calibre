describe("Ajouter une activité", () => {
	it("Page ajouter-activite est accessible", () => {
		cy.visit("http://localhost:3000/ajouter-activite");
	});
	it('Entre "Course" comme activité', () => {
		cy.get('#titre_activite').type("Course");
	});
  it('Entre une description de la course"', () => {
		cy.get('#description').type("Avec des amis au Mont-Royal, 5km");
	});
  it('Entre la date de la course', () => {
		cy.get('#date').type("2022-06-01");
	});


  it('Clique sur le bouton "Ajouter"', () => {
    cy.get('.btn').click();
  });

  it("Page afficher-activite est accessible", () => {
		cy.visit("http://localhost:3000/afficher-activites");
	});
  
	it('Les données sont correctes"', () => {
		cy.get('tbody > :nth-child(1) > :nth-child(1)').should('contain', 'Course');
	});
});

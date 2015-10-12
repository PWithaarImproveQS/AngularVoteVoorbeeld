Feature: 
  To prevent double voting from one user. 
  As a marketing mangager,
  I want the user to be able to vote only once.
  
  Only one vote on the items per user is allowed.

	Background: 
	  Given a connection to the server
  
	Scenario: Susan votes on an item after she has already voted 
		Given A votable item "Item1"
		When Susan votes on "Item1"
		And Susan votes again on "Item1"
		Then The total amount of votes on "Item1" is 1
	
	Scenario: Susan votes on an item after she has already voted 
		Given A votable item "Item1"
		And A votable item "Item2"
		When Susan votes on "Item2"
		Then The total amount of votes on "Item2" is 1
		But The total amount of votes on "Item1" is 0
		  
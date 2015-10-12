Feature: Adding vote items to the list
	In order to support new vote items
	As a connected user
	I want to add a vote item
  	
	Scenario: Create a vote item on a empty server
		Given a connection to the server
		When I send a new vote item
		Then the amount of vote items is 1
	
	Scenario: Create another vote item on the same server
		Given a connection to the server
		When I send a new vote item
		Then the amount of vote items is 2

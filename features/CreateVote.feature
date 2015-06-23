Feature: This is an example test
	In order to support new vote items
	As a connected user
	I want to add a vote item
  	
	Scenario: Create a vote item on a empty server
		Given a connection to the server
		When I send a vote item with the text: New vote item
		Then the amount of vote items is 1
	

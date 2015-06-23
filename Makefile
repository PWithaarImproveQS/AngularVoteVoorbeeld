cucumber:
		@NODE_ENV=test cucumber.js tests/features \
				-r tests/features/step_definitions

.PHONY: cucumber
.PHONY: run
run:
	npm run dev

.PHONY: install
install:
	npm install

.PHONY: format
format:
	npx prettier ./src --write

.PHONY: build
build:
	npm run build
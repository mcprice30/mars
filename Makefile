.SILENT:

all: mars npm

mars:
	cd run_mars && go install

npm:
	cd static && npm install

clean:
	cd static && rm -rf node_modules

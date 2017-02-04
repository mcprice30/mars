.SILENT:

all:
	cd static && npm install
	cd run_mars && go install

clean:
	cd static && rm -rf node_modules

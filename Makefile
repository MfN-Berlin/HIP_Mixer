#!make
.PHONY: standalone
.DEFAULT_GOAL := standalone

standalone:
	-rm mixer.zip
	mkdir -p mixer/files
	cp -r css js media src mixer/files;
	cp standalone/mixer.html mixer;
	cp standalone/local_configuration.js mixer/files/js;
	cp INSTALL_STANDALONE.md mixer/INSTALL_STANDALONE.txt;
	zip -r mixer mixer
	rm -rf mixer

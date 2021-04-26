/**
   Javacript Controller for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class MixerController {
    
    constructor(model) {
	this.model = model;
    }
    
    /** 
     * Loads the configuration file and stores it in the MixerModel object:
     * # an array of Frame objects containing the paths to images and calls for each species. 
     *
     * @param {string} url (relative to this.basePath) url of the json file containing the configuration.
     */
    loadConfiguration(path) {
        path = `${this.model.basePath}/${path}`;
	var configuration = (function() {
	    var json = null;
	    $.ajax({
		'async': false,
		'global': false,
		'url': path,
		'dataType': "json",
		'success': function(data) {
		    json = data;
		}
	    });
	    return json;
	})();
        this._storeConfiguration(configuration);
    }

    /** 
     * Starts the mixer, called from the start screen, button "Mixer starten"
     */
    launch(name) {
	this.model.reset();
	this.model.start();
        this.model.setAnimalGroup(name);
        this.select(0);
    }
    
    /** 
     * Quits the mixer, returns to the start screen.
     * Called from the close button (top-right "X")
     */
    quit() {
	this.model.reset();
    }
    
    /** 
     * Shows the credits for media. 
     * The credits screen is printed by the CreditsView constructor.
     */
    toggleCredits() {
        this.model.toggleCredits();
    }

    /**
     * Selects a frame (an animal)
     *
     * @param i int index of the frame
     */
    select(i) {
        this.model.setSelectedFrame(i);
    }

    /**
     * Toggle noise on/off. 
     * Multiple noises can be on at the same time.
     *
     * @param n int index of the noise in progress.noises
     */
    toggleNoise(n) {
        this.model.toggleNoise(n);
    }
    
    /**
     * Toggle animal call on/off. 
     * Multiple animal calls can be on at the same time.
     *
     * @param n int index of the animal call in progress.animals
     */
    toggleAnimal(n) {
        this.model.toggleAnimal(n);
    }
    
    /**
     * Get the text to the noise 
     *
     * @param n int index of the noise in progress.noises
     */
    getNoiseInfo(n) {
        var text = this.model.progress.currentNoises[n].text.de;
        return(text);
    }

    /**
     * Get the credits to the noise 
     *
     * @param n int index of the noise in progress.noises
     */
    getNoiseCredits(n) {
        var noise = this.model.progress.currentNoises[n];
        var text = `
           ${noise.title.de} -  
           ${noise.recording.toHTMLString()}`;
        return(text);
    }
    
    /**
     * Get the text to the animal call 
     *
     * @param n int index of the noise in progress.animalCalls
     */
    getAnimalCallInfo(n) {
        var text = this.model.progress.currentAnimalCalls[n].text.de;
        return(text);
    }

    /**
     * Get the credits to the animal call
     *
     * @param n int index of the animal call in progress.animalCalls
     */
    getAnimalCallCredits(n) {
        var call = this.model.progress.currentAnimalCalls[n];
        var text = `
           ${call.title.de} -  
           ${call.recording.toHTMLString(false)}`;
        return(text);
    }
    
    toggleVisualization(visualization) {
        if (this.model.progress) {
            this.model.progress.visualization = visualization;
        }
        HTML5FramePlayer.toggle(visualization);
    }

    /** 
     * Switch to animal group when chosn in the menu
     *
     * @param name string name of a frame group, as set in config.ini (antarctic|pinnipeds|wales|other)
     */
    showAnimalGroup(name) {
        this.model.mute();
        this.model.setAnimalGroup(name);
    }

    changeSpeed(speed) {
        this.model.setSpeed(speed);
    }
    
    /* Private methods */
    
    /**
     * Parses the configuration file and stores it in the model.
     */
    _storeConfiguration(configuration) {
        // frames contain information on the animal (but not the animal calls)
	for (var i = 0; i < configuration.frame.length; i++) {
	    var f = configuration.frame[i];
            if (f.enabled) {
	        var fObj = this._parseFrame(f);
	        this.model.addFrame(fObj);
            }
	}
        // an animal call object contains a noise recording for each animal
	for (var i = 0; i < configuration.frame.length; i++) {
	    var f = configuration.frame[i];
            // make a noise object for each filter (aka animal)
            for (var filter in f.recording.paths) {
	        var nObj = this._parseAnimalCall(f, filter);
	        this.model.addAnimalCall(nObj);
            }
	}
        // a Noise object contains a noise recording for each animal
	for (var i = 0; i < configuration.noise.length; i++) {
	    var n = configuration.noise[i];
            // make a noise object for each filter (aka animal)
            for (var filter in n.recording.paths) {
	        var nObj = this._parseNoise(n, filter);
	        this.model.addNoise(nObj);
            }
	}
        this.model.addUIText("start", configuration.start_text);
        this.model.addUIText("help", configuration.help_text);
    }
    
    /**
     * Parse a frame entry from the configuration file.
     * Frames hold information on an animal (icon, text, image, call)
     *
     * f Object a JSON object 
     */
    _parseFrame(f) {
        var clone = {...f};
        // replace the path array by the path to the filtered file
        //clone.recording.path = f.recording.paths[filter];
        var icon = this._parseMedia(clone.icon);
        var image  = this._parseMedia(clone.image);
        var recording = this._parseMedia(clone.recording);
        //var spectrogram = `${this.model.basePath}/${clone.visualization.spectrogram}`;
        //var waveform = `${this.model.basePath}/${clone.visualization.waveform}`;
        var group = clone.group.split(',');
        //return new Frame(clone.id, clone.species, icon, image, recording, clone.text, spectrogram, waveform, group);
        return new Frame(clone.id, clone.species, icon, image, recording, clone.text, null, null, group);
    }
    
    /**
     * Parse a noise entry from the configuration file.
     *
     * n Object a JSON object 
     * filter String the name of a filter (aka animal)
     */
    _parseNoise(n, filter) {
        var clone = {...n};
        // replace the path array by the path to the filtered file
        clone.recording.path = n.recording.paths[filter];
        var icon = this._parseMedia(clone.icon);
        var recording = this._parseMedia(clone.recording);
        var spectrogram = `${this.model.basePath}/${n.visualization.spectrogram}`;
        var waveform = `${this.model.basePath}/${n.visualization.waveform[filter]}`;
        return new Noise(filter, icon, clone.icon.pos.x, clone.icon.pos.y, recording, clone.title, clone.text, clone.field, spectrogram, waveform);
    }
    
    /**
     * Parse an animal call entry from the configuration file.
     * Frames hold information on animal calls (recording, spectrogram, waveform)
     *
     * n Object a JSON object 
     * filter String the name of a filter (aka animal)
     */
    _parseAnimalCall(n, filter) {
        var clone = {...n};
        // replace the path array by the path to the filtered file
        clone.recording.path = n.recording.paths[filter];
        var icon = this._parseMedia(clone.icon);
        var recording = this._parseMedia(clone.recording);
        var spectrogram = `${this.model.basePath}/${n.visualization.spectrogram}`;
        var waveform = `${this.model.basePath}/${n.visualization.waveform[filter]}`;
        var group = clone.group;
        return new Noise(filter, icon, null, null, recording, clone.species, clone.text, null, spectrogram, waveform, group);
    }

    _parseMedia(m) {
        return new Media(`${this.model.basePath}/${m.path}`, m.credit, m.license, m.backlink)
    }
}

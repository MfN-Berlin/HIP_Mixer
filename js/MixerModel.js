/**
   Javacript Model for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class MixerModel extends Observable {
    
    constructor() {
	super();
        // Base path (relative URL) to the module dir
        this.basePath = "";
        // Array of Frame objects, one per animal, containing images, call, text, credits
        this.frames = [];
        // Array of Noise objects, one per noise, containing recording, text, credits, icon
        this.noises = [];
        // Array of noise Objects, one per animal call, containing filtered recording of animal calls
        this.animalCalls = [];
        this.maxNoises = 6; // how many noises shall be displayed in each frame
        // Dict of dicts, UI texts (all texts except texts on animals, which are in frames array)
        // Each text has a name, as in config.json, and is itself a dict where the key is
        // the language code (e.g. "de")
        this.uiTexts = [];
    }

    /**
     * Resets the model's state, notifies observers.
     */
    reset() {
	this.progress = new Progress();
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }

    /**
     * Sets the model state to started, notifies observers.
     */
    start() {
        this.progress.started = true;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }

    /**
     * Selects a frame (an animal) and the corresponding filtered noises
     *
     * @param i int index of the frame
     */
    setSelectedFrame(i) {
        // update the progress object
        this.progress.currentFrame = this.frames[i];

        //*** noises ***//
        // remember which noises were active 
        var activeNoises = [];
        for (var n in this.progress.currentNoises) {
            activeNoises.push(this.progress.currentNoises[n].active);
        }
        // set current noises according to filter
        this.progress.currentNoises = this._selectNoises(this.frames[i].id);
        // reactivate previuosly active noises
        for (var n in this.progress.currentNoises) {
            this.progress.currentNoises[n].active = activeNoises[n];
        }
        
        //*** animal calls ***//
        // remember which animal calls were active 
        var activeAnimalCalls = [];
        for (var n in this.progress.currentAnimalCalls) {
            activeAnimalCalls.push(this.progress.currentAnimalCalls[n].active);
        }
        // set current animal calls according to filter
        this.progress.currentAnimalCalls = this._selectAnimalCalls(this.frames[i].id);
        // reactivate previuosly active animal calls
        for (var n in this.progress.currentAnimalCalls) {
            this.progress.currentAnimalCalls[n].active = activeAnimalCalls[n];
        }

        // notify observers
        this.progress.continue = false;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }

    /* Activates or mutes a noise recording */
    toggleNoise(n) {
        this.progress.currentNoises[n].active = !this.progress.currentNoises[n].active;
        this.progress.continue = true;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }

    /* Activates or mutes an animal recording */
    toggleAnimal(n) {
        this.progress.currentAnimalCalls[n].active = !this.progress.currentAnimalCalls[n].active;
        this.progress.continue = true;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }
    
    /* Deactivate and mute all noises */
    mute() {
        for (var n in this.progress.currentNoises) {
            this.progress.currentNoises[n].active = false;
        }
        for (var n in this.progress.currentAnimalCalls) {
            this.progress.currentAnimalCalls[n].active = false;
        }
        this.progress.continue = true;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }
    
    /* Shows/hides the credits screen */
    toggleCredits() {
        this.progress.showCredits = !this.progress.showCredits;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }
    
    /**
     * Sets the relative path to the module's root folder
     *
     * @param String path part of the folder's URL
     */
    setBasePath(path) {
        this.basePath = path;
    }
    
    /**
     * Add a frame configuration
     * Frames are defined in config.json and 
     * loaded and parsed by the controller on start up.
     */
    addFrame(frame) {
        this.frames.push(frame);
    }
    
    /**
     * Add a noise configuration
     * Noises are defined in config.json and 
     * loaded and parsed by the controller on start up.
     */
    addNoise(noise) {
        this.noises.push(noise);
    }
    
    /**
     * Add an animal call configuration
     * Animals/frames are defined in config.json and 
     * loaded and parsed by the controller on start up.
     */
    addAnimalCall(call) {
        this.animalCalls.push(call);
    }
    
    /**
     * Add a UI text
     * UI texts are defined in config.json and 
     * loaded and parsed by the controller on start up.
     * Texts can be accessewd through this.text["text_name"]
     * Text in the frames, i.e. text on animals and noises, 
     * are handled by addFrame(frame) and stored in this.frame array.
     */
    addUIText(name, text) {
        this.uiTexts[name] = text;
    }

    /**
     * Randomize the order of the frames every time the mixer starts,
     * make sure the "soundscape" frame is at the beginning
     * put the frames in group "antarctic" at the beginning
     */
    shuffleFrames() {
        this.frames = this._shuffle(this.frames);
        this.frames = this._reorder(this.frames);
    }

    /** Select a group of animals to display */
    setAnimalGroup(name) {
        this.progress.animalGroup = name;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }

    setSpeed(speed) {
        this.progress.speed = speed;
	this.setChanged();
	this.notifyObservers(this.progress);
	this.clearChanged();
    }
    
    /* private methods */

    // https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
    _shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {  
            
            // Generate random number  
            var j = Math.floor(Math.random() * (i + 1)); 
            
            var temp = array[i]; 
            array[i] = array[j]; 
            array[j] = temp; 
        } 
        
        return array; 
    }

    /** Add the "soundscape" frame at the beginning */
    _reorder(frames) {
        // remove soundscape frame
        var resp = frames.filter(function(frame)  {
            return frame.id !== "Rubbing_ice";
        });
        // add soundscape at the beginning
        var first = null;
        for (var i in frames) {
            if (frames[i].id == "Rubbing_ice") {
                first = frames[i];
                break;
            }
        }
        resp.unshift(first);
        return resp;
    }

    _groupBy(frames, groupName) {
        var resp = frames.filter(function(frame)  {
            return frame.group.includes(groupName);
        });
        return(resp);
    }
    
    /** Return the noises filtered for the current animal/frame */
    _selectNoises(id) {
        var resp = [];
        for (var n in this.noises) {
            if (this.noises[n].filter == id) {
                resp.push(this.noises[n]);
            }
        }
        return resp;
    }

    /** Return the animal calls filtered for the current frame */
    _selectAnimalCalls(id) {
        var resp = [];
        for (var n in this.animalCalls) {
            if (this.animalCalls[n].filter == id) {
                resp.push(this.animalCalls[n]);
            }
        }
        return resp;
    }
    
    _shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}


/**
 * Records the state of the mixer.
 */
class Progress {
    constructor() {
	/* boolean true if the mixer has started */
	this.started = false;
	/* Frame object: the frame currently loaded, with the animal call, text and image */
	this.currentFrame = null;
	/* Array of Noise objects: recordings of noises filtered for this animal */
	this.currentNoises = null;
        this.currentAnimalCalls = null;
        /* Do not clear the screen */
        this.continue = false;
        /* Show the credits screen */
        this.showCredits = false;
        /* Selected visualization (spectro|wave)*/
        this.visualization = "wave";
        /* Which group of animals shall be loaded. 
         * Animals are assigned a group in config.ini (antarctic|pinnipeds|wales|...) 
         */
        this.animalGroup = 'antarctic';
        /* Playback speed */
        this.speed = 1;
    }
}


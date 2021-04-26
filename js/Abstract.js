/************************************************************************
   Observable and Observer class for MVC
*************************************************************************/
class Observable {

    constructor() {
	this.observer = [];
	this.changed = false;
    }

    
    addObserver(obj) {
	this.observer.push(obj);
    }

    setChanged() {
	this.changed = true;
    }

    clearChanged() {
	this.changed = false;
    }

    notifyObservers(progress) {
	if (this.changed) {
	    for (var i = 0; i < this.observer.length; i++) {
		this.observer[i].update(progress);
	    }
	}
    }
}

class Observer {
    /** Update this observer. Called from Model.*/
    update(progress) {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
}


/************************************************************************
   Abstract base class for the Mixer Views

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*************************************************************************/
class AbstractView extends Observer {

    /** Clears the view. Call through model updates.*/
    clear() {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
    
    /** 
     * Shows the view. 
     * Called the first time the view is drawn.
     * Called through model updates.
     *
     * progress Progress object passed on model update (or null). 
     *    The Progress object (defined in MixerModel.js) 
     *    holds the current Frame, the Noises and the started flag.
     */
    show(progress) {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
    
    /** 
     * Redraws the view. 
     * Called when the view has already been dran and needs updating.
     * Called through model updates.
     *
     * progress Progress object passed on model update (or null). 
     *    The Progress object (defined in MixerModel.js) 
     *    holds the current Frame, the Noises and the started flag.
     */
    redraw(progress) {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
    
    /**
     * Gets the HTML Element to use for displaying this view
     *
     * @return DOMElement
     */
    getDisplayElement() {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
}

/************************************************************************
   Abstract Audio player factory and players for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*************************************************************************/
class AbstractPlayerFactory {
    createFramePlayer() {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
    
    createNoisePlayer() {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
}

/** Player for animal calls */
class AbstractFramePlayer {
    play(frame) {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
}

/** Player for noises */
class AbstractNoisePlayer {
    play(noise) {
	throw "this method is abstract and should be overwritten by the implementing class";
    }
}

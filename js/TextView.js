/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class TextView extends AbstractView {
    /**
     * Constructs the view for the species selector
     */
    constructor(model) {
	super();
        this.model = model;
    }
    
    /** Overrides abstract method in Observer. */
    update(progress) {
        if (!progress.started) {
            // mixer has not yet started
	    this.clear();
            
        } else if (progress.started && !progress.currentFrame) {
	    // mixer has started, but no animal has been selected
	    this.clear();
            
        } else if (progress.started && progress.currentFrame) {
	    // mixer has started, and an animal has been selected
	    this.clear();
            this.show(progress);
        }
    }
    
    /** Overrides abstract method in AbstractView. */
    clear() {
        var selector = this.getDisplayElement();
        var content = this.model.uiTexts["help"].de;
        selector.innerHTML = content;
    }
    
    /** Overrides abstract method in AbstractView. */
    show(progress) {
        var selector = this.getDisplayElement();
        var content;
        var currentFrame = progress.currentFrame;
        content = currentFrame.text.de;
        selector.innerHTML = content;
    }
    
    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("text");
    }
    
    /* Event handlers */

    /**
     * Show the text to the noise 
     *
     * @param n int index of the noise in progress.noises
     */
    static showNoiseInfo(n) {
        var text = controller.getNoiseInfo(n);
        var credits = controller.getNoiseCredits(n);
        var el = document.getElementById("noise_info");
        el.innerHTML = `${text}<div class="inline_credits">${credits}</div>`;
        el.style.display = "block";
    }

    static hideNoiseInfo() {
        var el = document.getElementById("noise_info");
        el.innerHTML = "";
        el.style.display = "none";
    }
    
    /**
     * Show the text to the animal call 
     *
     * @param n int index of the noise in progress.noises
     */
    static showAnimalCallInfo(n) {
        var text = controller.getAnimalCallInfo(n);
        var credits = controller.getAnimalCallCredits(n);
        var el = document.getElementById("noise_info");
        el.innerHTML = `${text}<div class="inline_credits">${credits}</div>`;
        el.style.display = "block";
    }

    static hideAnimalCallInfo() {
        var el = document.getElementById("noise_info");
        el.innerHTML = "";
        el.style.display = "none";
    }
}

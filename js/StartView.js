/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class StartView extends AbstractView {
    /**
     * Constructs the view for the start screen
     */
    constructor(model) {
	super();
        this.model = model;
        this._printStartScreen();
    }

    /** Overrides abstract method in Observer. */
    update(progress) {
        if (!progress.started) {
	    this.show();
        } else {
	    this.clear();
        }
    }
    
    /** Overrides abstract method in AbstractView. */
    clear() {
        this.getDisplayElement().style.display = "none";
        var close_icon = this._drawCloseButton();
        var close_button = this._getQuitElement();
        close_button.innerHTML = `<div id="quit_button">${close_icon}</div>`;
        close_button.style.display = "block";
    }
    
    /** Overrides abstract method in AbstractView. */
    show() {
        this.getDisplayElement().style.display = "block";
        // hide close button and audio player
        var close_button = this._getQuitElement();
        close_button.style.display = "none";
        document.getElementById("sound").style.display = "none";
    }
        
    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("start");
    }

    /* Private methods */
    
    /** 
     * Prints the start page.
     * (toggling is handled by the controller).
     */
    _printStartScreen() {
        var contents = `
            ${this.model.uiTexts["start"].de}`;
        /*
        contents += `
            <div id="start_button">
                <input type="button" class="button" id="start_button" value="Starten" onclick="controller.launch('antarctic');">
            </div>`;
        */
        var start = this.getDisplayElement();
        start.innerHTML = contents;
    }
        
    /**
     * Gets the HTML Element to use for displaying the "quit" button
     */
    _getQuitElement() {
        return document.getElementById("quit");
    }
    
    _drawCloseButton() {
	return `
          <div id="close" onclick="controller.quit()">
              <img src="${this.model.basePath}/icons/Icon--question.png"/>
          </div>`;
    }

}

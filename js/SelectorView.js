/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class SelectorView extends AbstractView {
    /*maximum number of animals to display in a selector*/
    static MAX_ANIMALS = 11;
    /*default animal group to display*/
    static DEFAULT_GROUP = 'antarctic';

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
            this.show();
            
        } else if (progress.started && progress.currentFrame) {
	    // mixer has started, and an animal has been selected
	    this.clear();
            this.redraw(progress);
        }
    }

    /** Overrides abstract method in AbstractView. */
    clear() {
        var selector = this.getDisplayElement();
        selector.innerHTML = "";
    }

    /** Overrides abstract method in AbstractView. */
    show(progress=null) {
        if (progress) {
            var currentFrame = progress.currentFrame;
            // if animal is not in newly selected group, show frame 0
            if (!currentFrame.group.includes(progress.animalGroup)) {
                progress.currentFrame = this.model.frames[0];
                progress.currentNoises = [];
            }
        }
    
        var group = (progress)? progress.animalGroup:SelectorView.DEFAULT_GROUP;
        var content = `<div id="group_name">Höre das Geräusch aus Perspektive von...</div>`
        //content += this._drawMenu();
        var counter = 0;
        for (var i in this.model.frames) {
            var f = this.model.frames[i];
            // display animals in selected group
            if (f.group.includes(group)) {
                var isSelected = (currentFrame && f == currentFrame);
                content += this._drawIcon(i, f, isSelected);
                counter += 1;
                if (counter >= SelectorView.MAX_ANIMALS) break;
            }
        }
        this.getDisplayElement().innerHTML = content;
    }

    /** Overrides abstract method in AbstractView. */
    redraw(progress) {
        this.show(progress)
    }
    
    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("selector");
    }

    /* private methods */
    
    /** 
     * Draws an icon (animal)
     * @param index int index of the icon in the selector
     * frame Frame object corresponding to this icon
     * isSelected boolean is the icon currently selected
     */
    _drawIcon(index, frame, isSelected=false) {
        var selectedClass = (isSelected)? "selected": "";
        var resp = `<div class="icon_wrapper ${selectedClass}" onclick="controller.select(${index});">
                    <img src="${frame.icon.path}" class="icon"/>
                    <div class="name">${frame.species.de}</div>
                    </div>`;
        return resp;
    }
    
}

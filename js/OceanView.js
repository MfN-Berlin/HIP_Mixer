/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class OceanView extends AbstractView {
    /**
     * Constructs the view for the ocean 
     * (the part of the screen with the animal pictures and the noises)
     */
    constructor(model) {
	super();
        this.model = model;
        // max number of icons that can be placed on a frame
        // TODO: make this configurable
        this.maxSlots = 8;
        // holds positions of the noise icons (array of ints)
        // convert each slot to pixels using this._slotToPos(slot)
        this.slots = []
    }
    
    /** Overrides abstract method in Observer. */
    update(progress) {
        if (!progress.started) {
            // mixer has not yet started
	    this.clear();
            
        } else if (progress.started && !progress.currentFrame) {
	    // mixer has started, but no animal has been selected
	    this.clear();
            
        } else if (progress.started && progress.currentFrame && !progress.continue) {
	    // mixer has started, and an animal has been selected
	    this.clear();
            this.show(progress);
            
        } else if (progress.started && progress.currentFrame && progress.continue) {
	    // an animal has been selected, and a noise has been toggled
            this.redraw(progress);
        }
    }
    
   /** Overrides abstract method in AbstractView. */
    clear() {
        this.slots = []; // clear noise icons slots
        var selector = this.getDisplayElement();
        selector.innerHTML = "";        
    }
    
    /** Overrides abstract method in AbstractView. */
    show(progress) {
        this.redraw(progress);
    }
    
    /** Overrides abstract method in AbstractView. */
    redraw(progress) {
        var selector = this.getDisplayElement();
        var content = "";
        // main menu
        content += this._drawMenu();
        // title
        var group = (progress)? progress.animalGroup:SelectorView.DEFAULT_GROUP;
        var groupDisplayName = {'antarctic':'Tierstimmen im Südpolarmeer', 'north_polar_sea':'Tierstimmen im Nordpolarmeer'}
        content += `<div id="call_caption">${groupDisplayName[group]}</div>`;
        // calls
        content += `<div id="calls">${this._drawCallMenu(progress)}</div>`;
        // noises
        content += `<div id="noise_caption">Menschliche Schallquellen im Meer</div>`;
        if (progress.currentNoises) {
            content += `<div id="noises">${this._drawCurrentNoises(progress.currentNoises)}</div>`;
        }
        selector.innerHTML = content;
    }

    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("ocean");
    }

    /* Private methods */
    _drawMenu() {
        var resp = `<div id="group_menu">
           <div id="menu" onclick="OceanView.showGroupMenu()">
              <svg id="menu_button" class="Icon Icon--cc drop" role="img">
                 <use class="drop" xlink:href="/modules/custom/hip_mixer/icons/sprites.svg#Icon--menu"></use>
              </svg>
           </div>
           <div id="group_dropdown" class="dropdown-content">
	      <div onclick="controller.showAnimalGroup('north_polar_sea')" class="show_animal_group">Tiere des Nordpolarmeers</div>
	      <div onclick="controller.showAnimalGroup('antarctic')" class="show_animal_group">Tiere des Südpolarmeers</div>
           </div>
        </div>`;
        return resp;
    }

    /** Whale and seal icons, animal call menus */
    _drawCallMenu(progress) {
        var resp = "";
        var group = (progress)? progress.animalGroup:SelectorView.DEFAULT_GROUP;
        var counter = 0;
        for (var i in progress.currentAnimalCalls) {
            var animal = progress.currentAnimalCalls[i];
            // display animals in selected group
            if (animal.group.includes(group) && animal.title.de != 'Mensch') {
                counter ++;
                resp += this._drawIcon(i, animal);
                //resp += this._drawAnimalEntry(animal, listName, i, counter);
            }
        }        
        return resp;
    }
    
    /** 
     * Draws an icon (animal)
     * @param index int index of the icon in the selector
     * frame Frame object corresponding to this icon
     * isSelected boolean is the icon currently selected
     */
    _drawIcon(i, animal) {
        var selectedClass = (animal.active)? "selected":"";
        var resp = `<div class="icon_wrapper ${selectedClass}" 
                      onclick="controller.toggleAnimal(${i});"  
                      onmouseover="TextView.showAnimalCallInfo(${i});"
                      onmouseout="TextView.hideAnimalCallInfo()">
                    <img src="${animal.icon.path}" class="icon"/>
                    <img src="/modules/custom/hip_mixer/icons/circle_selected.png" class="circle_selected"/>
                    <div class="name">${animal.title.de}</div>
                    </div>`;
        return resp;
    }


    _drawCallMenu_ALT(progress) {
        var resp = "";
        //resp += `<img id="seal_icon" src="${this.model.basePath}/icons/seal.png"/>`
        resp += this._listAnimals('pinnipeds', progress);
        //resp += `<img id="whale_icon" src="${this.model.basePath}/icons/whale.png"/>`
        resp += this._listAnimals('whales', progress);
        return resp;
    }

    _listAnimals(listName, progress) {
        // group is "antarctic" or "arctic"
        var group = (progress)? progress.animalGroup:SelectorView.DEFAULT_GROUP;
        var resp = `<ul id="call_menu_${listName}">`

        var counter = 0;
        for (var i in progress.currentAnimalCalls) {
            var animal = progress.currentAnimalCalls[i];
            // select animals in the currently selected group and the current menu drawn (listName)
            // includes does a string comparison, not an array comparison
            if (animal.group.includes(group) && animal.group.includes(listName)) {
                counter ++;
                resp += this._drawAnimalEntry(animal, listName, i, counter);
            }
        }
        resp += "</ul>";
        return resp;
    }

    _drawAnimalEntry(animal, listName, i, counter) {
        var animalSelectedClass = (animal.active)? "selected":"";
        if (counter > 4) {
            var top = (counter-5)*1.5;
            var style = `position: absolute; left: 110px; top: ${top}em;`
        }
        if (counter > 9) {
            var top = (counter-10)*1.5;
            var style = `position: absolute; left: 220px; top: ${top}em;`
        }
        var resp =`<li id="call_li_${listName}_${i}" style="${style}" class="animal_menuitem_wrapper ${animalSelectedClass}">
                   <div 
                      onclick="controller.toggleAnimal(${i});"  
                      onmouseover="TextView.showAnimalCallInfo(${i});"
                      onmouseout="TextView.hideAnimalCallInfo()">${animal.title.de}</div>
                   </li>`;
        return resp;
    }
    
    
    /** Draw current noise icons */
    _drawCurrentNoises(currentNoises) {
        var noiseButtons = "";
        var resp = "";
        for (var n in currentNoises) {
            var noise = currentNoises[n];
            var pos = {x:noise.x, y:noise.y};
            // place the button, if a slot and position could be found
            noiseButtons += this._drawNoiseButton(n, noise, pos);
        }
        resp += `<div id="icon_overlay">${noiseButtons}</div>`
        return(resp);
    }

    /** Generate HTML for a noise button 
        @param n index of the noise in the progress.currentNoises array
        @noise Noise object
        @pos {x:int, y:int} position in pixels
     */
    _drawNoiseButton(n, noise, pos) {
        var noiseSelectedClass = (noise.active)? "selected":"";
        // event handlers for onmouseXXX are at the bottom of this file
        // as they do not require a model update
        var resp = `
               <div class="noise_icon_wrapper ${noiseSelectedClass}" 
                  style="top:${pos.y}px; left:${pos.x}px;"
                  onclick="controller.toggleNoise(${n});"
                  onmouseover="TextView.showNoiseInfo(${n});"
                  onmouseout="TextView.hideNoiseInfo()">
               <img class="noise_icon ${noise.field}"
                  src="${noise.icon.path}"/>
               <div class="noise_text">${noise.title.de}</div>
               </div>`
        return resp;
    }

    /* Event handlers */

    /** Toggle details menu */
    static showGroupMenu() {
        var dropdown = OceanView._getDropdownEl();
        dropdown.classList.toggle("show");
        if (dropdown.classList.contains('show')) {
            window.closeDropdownEvent = window.addEventListener('click', function() {
                if (!event.target.matches('.drop')) {
                    var dropdown = OceanView._getDropdownEl();
                    if (dropdown)
                        document.getElementById("group_dropdown").classList.remove('show');
                }
            })
        } else {
            window.removeEventListener(window.closeDropdownEvent);
        }
    }

    static _getDropdownEl() {
        return document.getElementById("group_dropdown");
    }
}

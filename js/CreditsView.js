/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/

class CreditsView extends AbstractView {

    /**
     * Constructs the view for the credits screen
     */
    constructor(model) {
	super();
        this.model = model;
    }
    
    /** Overrides abstract method in Observer. */
    update(progress) {
        // draw the credits screen only once at program start
        if (!progress.started) {
	    this.clear();
            this.show(progress);
        }
        // the credits screen has been marked for showing
        this.redraw(progress);
    }

    /** Overrides abstract method in AbstractView. */
    clear() {
        var footer = document.getElementById("footer");
        footer.innerHTML = `<span onclick="controller.toggleCredits()">Über diese App</span>`;
        var credits = this.getDisplayElement();
        credits.innerHTML = "";
        credits.style.display = "none";
    }
    
    /** Overrides abstract method in AbstractView. */
    show(progress) {
        var contents = this._printCredits();
        var credits = this.getDisplayElement();
        credits.innerHTML = contents;
    }

    /** Overrides abstract method in AbstractView. */
    redraw(progress) {
        var credits = this.getDisplayElement();
        var val = progress.showCredits? "block":"none";
        credits.style.display = val;
    }
    
    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("credits");
    }

    /* Private methods */
    
    /** 
     * Prints all the credits to the credits screen.
     * Credits are read from the configuration file and stored in the model's "frames" array.
     * The credits screen remains hidden until toggled by the user 
     * (toggling is handled by the controller).
     */
    _printCredits() {
        var contents = "<h1>Über diese App</h1>";
        // Entwicklung
        contents += `
<dl>
<dt>Konzept</dt>
<dd>
Mirjam Müller (Umweltbundesamt), 
Alvaro Ortiz Troncoso (Museum für Naturkunde Berlin), 
Michaël Beaulieu (Deutsches Meeresmuseum)</dd>
<dt>Programmierung</dt>
<dd>Alvaro Ortiz Troncoso (Museum für Naturkunde Berlin)</dd>
<dt>Audiobearbeitung</dt>
<dd>Tina Birnbach (Museum für Naturkunde Berlin), Alvaro Ortiz Troncoso (Museum für Naturkunde Berlin)</dd>
<dt>Texte</dt>
<dd>Cora Albrecht (Museum für Naturkunde Berlin), Tina Birnbach (Museum für Naturkunde Berlin)</dd>
<dt>Wissenschaftliche Beratung</dt>
<dd>
Michael Dähne (Deutsches Meeresmuseum),
Ulrike Buschewski (Deutsches Meeresmuseum) 
</dd>
</dl>`;
        // Die Tierstimmen
        contents += `<h2>Tierstimmen</h2>`;
        contents += "<dl>"
        for(var f in this.model.frames) {
            var frame = this.model.frames[f];
            contents += `<dt>${frame.species.de}</dt>`;
            contents += `<dd><em>Aufnahme</em>: ${frame.recording.toHTMLString()}<br/>`;
            contents += `<em>Bild</em>: ${frame.image.toHTMLString()}</dd>`;
        }
        contents += "</dl>"
        // Die Lärmaufnahmen
        contents += `<h2>Lärmaufnahmen</h2>`;
        contents += "<dl>"
        var found = [];
        for(var n in this.model.noises) {
            var noise = this.model.noises[n];
            // each noise is filtered multiple times according to the animal hearing capabilities
            // here noises are identified by their text attribute
            if (found.indexOf(noise.title.de) == -1) {
                found.push(noise.title.de);
                contents += `<dt>${noise.title.de}</dt>`;
                contents += `<dd><em>Aufnahme</em>: ${noise.recording.toHTMLString()}</dd>`;
            }
        }
        contents += "</dl>"
        // Icons
        contents +=`
<h2>Grafiken</h2>
<p>Icons by Freepik from http://www.flaticon.com</p>`;
        // Algorithmen
        contents +=`
<h2>Wissenschaftliche Quellen</h2>
        <i>Die Audiobearbeitungsalgorithmen basieren auf:</i><br/><br/>
        <p>
        Driedger, J. (2011). Time-scale modification algorithms for music audio signals. Master's thesis, Saarland University<br/>
        </p>
        <p>
        Southall, B., Bowles, A., Ellison, W. et al. (2007) Aquatic Mammals- Marine Mammal Noise Exposure Criteria: Initial Scientific Recommendations. Aquatic Mammals, 33(4), appendix A, Frequency-selective weighting, p. 500<br/>
        </p>
        <p>
        Unter <a href="https://github.com/MfN-Berlin/HIP_Audio_Filters/wiki/Filters" target="_blank">diesem Link</a> können Sie mehr über die Filteralgoritmen erfahren.
        </p>
        `
        // Close Button
        contents += `<div id="credits_close"><input type="button" class="button" id="close_credits" value="Schliessen" onclick="controller.toggleCredits()"></div>`;
        return contents;
    }
    
}

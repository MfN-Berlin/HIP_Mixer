/**
 * The mixer is structured in frames. Each frame corresponds to a species of animal.
 * Frames are defined in config.json and loaded by the controller on start up.
 */
class Frame {
    /**
     * Constructs a Frame object
     *
     * @param species: Array<String:String> keys are language codes, values are name of the species
     * @param icon: Media Thumbnail of the animal
     * @param image: Media Large image of the animal
     * @param recording: Media Sound recording of the animal
     * @param text: Array<String:String> keys are language codes, values are information texts on species
     * @param spectrogram: path to image
     * @param waveform: path to image
     * @param group: [] of names of the group this animal belongs to (e.g. 'antarctic', 'other')
     */
    constructor(id, species, icon, image, recording, text, spectrogram, waveform, group) {
        this.id = id;
        this.species = species;
        this.icon = icon;
        this.image = image;
        this.recording = recording;
        this.text = text;
        this.spectrogram = spectrogram;
        this.waveform = waveform;
        this.group = group;
    }
}

/**
 * Noise objects are displayed as icons/buttons in the Ocean view.
 * Noise objects are defined in config.json and loaded by the controller on start up.
 */
class Noise {
    /**
     * Constructs a Noise object
     *
     * @param filter: String filter used (latin name of the animal)
     * @param icon: Media icon for this noise
     * @param recording: Media Sound recording of the noise
     * @param text: Array<String:String> keys are language codes, values are information texts on the noise
     * @param field: String "near"|"far"
     * @param spectrogram: path to image
     * @param waveform: path to image
     */
    constructor(filter, icon, x, y, recording, title, text, field, spectrogram, waveform, group) {
        this.filter = filter;
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.recording = recording;
        this.title = title;
        this.text = text;
        this.active = false;
        this.field = field;
        this.spectrogram = spectrogram;        
        this.waveform = waveform;
        this.group = group;
    }
}

/**
 * Images and sounds are stored in Medi aobjects.
 * Media are defined in config.json and loaded by the controller on start up.
 */
class Media {
    /**
     * Constructs a Media object
     *
     * @param path: String Path to the media file
     * @param credit: String Name of creator and / or backlink
     * @param license: String License of the media
     */
    constructor(path, credit="", license="", backlink="", name="") {
        this.path = path;
        this.credit = credit;
        this.license = license;
        this.backlink = backlink;
        this.name = name;
    }

    /** 
     * Returns a HTML representation of the media's metadata 
     * 
     * @param link boolean whether to backlink if applicable (default true)
     */
    toHTMLString(link=true) {
        if (this.backlink && link) {
            return `<a href="${this.backlink}" target="_blank">${this.credit}</a>, ${this.license}`;
        } else {
            return `${this.credit}, ${this.license}`;
        }
    }
}

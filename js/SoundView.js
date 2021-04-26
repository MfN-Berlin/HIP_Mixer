/**
   Javacript View for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/
class SoundView extends AbstractView {
    /**
     * Constructs the view for the sound 
     */
    constructor(model, playerFactory) {
	super();
        this.model = model;
        this.framePlayer = playerFactory.createFramePlayer();
        this.noisePlayer = playerFactory.createNoisePlayer();
        this.animalPlayer = playerFactory.createNoisePlayer();
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
	    this.clear();
            this.redraw(progress);
        }
    }
    
    /** Overrides abstract method in AbstractView. */
    clear() {
        // empty the view
        var el = this.getDisplayElement();
        el.innerHTML = "";
    }
    
    /** Overrides abstract method in AbstractView. */
    show(progress) {
        var el = this.getDisplayElement();
        el.style.display = 'block';
        this.redraw(progress);
    }

    /** Overrides abstract method in AbstractView. */
    redraw(progress) {
        // don't play when showing credits page
        if (progress.showCredits) return;
        
        var el = this.getDisplayElement();
        var currentFrame = progress.currentFrame;
        el.innerHTML = "";

        // show speed controls if there there are any deep sounding whales in the selection
        var showSpeed = false
        if (progress.currentAnimalCalls) {
            for (var n in progress.currentAnimalCalls) {
                if (progress.currentAnimalCalls[n].active && progress.currentAnimalCalls[n].group.includes('deepfrequency')) {
                    showSpeed = true;
                    break;
                }
            }
        }
        // reset speed if no more low frequency whales in selection
        if (!showSpeed) progress.speed=1;
        
        // draw and initialize noise players
        if (progress.currentNoises) {
            for (var n in progress.currentNoises) {
                var noise = progress.currentNoises[n];
                if (noise.active) {
                    el.innerHTML += this.noisePlayer.play(noise, progress.visualization, 'noise', progress.speed);
                }
            }
        }
        // draw and initialize animal call players
        if (progress.currentAnimalCalls) {
            for (var n in progress.currentAnimalCalls) {
                var call = progress.currentAnimalCalls[n];
                if (call.active) {
                    el.innerHTML += this.noisePlayer.play(call, progress.visualization, 'call', progress.speed);
                }
            }
        }
        // draw and initialize soundscape call player
        var soundscape = progress.currentAnimalCalls[0];
        el.innerHTML += this.framePlayer.play(progress.currentFrame, soundscape, this.model.basePath, progress.visualization, showSpeed, progress.speed);
        
        // event handlers are at the bottom of this file
        this.framePlayer.addPlayPauseEventHandler(SoundView.playPauseNoises); 
        this.framePlayer.addSeekEventHandler(SoundView.seekNoises);
        this.framePlayer.addVolumeEventHandler(SoundView.volumeChange); 
        HTML5FramePlayer.toggle(progress.visualization);
    }
    
    /** Overrides abstract method in AbstractView. */
    getDisplayElement() {
        return document.getElementById("sound");
    }
    
    /* Player event handlers */

    /** Event handler called when user clicks on pause button. 
      * Pauses all noise players.*/
    static playPauseNoises() {
        // main player is paused?
        if (!document.getElementById("player_audio")) return;
        // pause main player (background soundscape)
        var paused = document.getElementById("player_audio").paused;
        // pause noise and animal call players (alll of class player_noise)
        var nPlayers = document.getElementsByClassName("player_noise");
        if (paused===true) {
            for (var n=0; n < nPlayers.length; n++) {
                nPlayers[n].pause();
            }
        } else {
            for (var n=0; n < nPlayers.length; n++) {
                nPlayers[n].play();
            }
        }
    }

    /** Event handler called when user clicks seek bar. 
      * Moves the playhead of all noise players.*/
    static seekNoises() {
        var time = document.getElementById("player_audio").currentTime;
        var nPlayers = document.getElementsByClassName("player_noise");
        for (var n=0; n < nPlayers.length; n++) {
            nPlayers[n].currentTime = time;
        }
    }
    
    /** Event handler called when user clicks changes the volume. 
      * Changes the volume of all noise players.*/
    static volumeChange() {
        var vol = document.getElementById("player_audio").volume;
        var nPlayers = document.getElementsByClassName("player_noise");
        for (var n=0; n < nPlayers.length; n++) {
            nPlayers[n].volume = vol;
        }
    }

}

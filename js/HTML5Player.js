/**
   HTML5 Audio player factory and players for the Mixer

   @author: Alvaro Ortiz Troncoso for Museum fuer Naturkunde Berlin
   @see https://code.naturkundemuseum.berlin/Alvaro.Ortiz/Pinguine
*/
class HTML5PlayerFactory extends AbstractPlayerFactory {
    createFramePlayer() {
        return new HTML5FramePlayer();
    }
    
    createNoisePlayer() {
        return new HTML5NoisePlayer();
    }
    
    createAnimalPlayer() {
        return new HTML5AnimalPlayer();
    }
}

class HTML5FramePlayer extends AbstractFramePlayer {

    empty(basePath, visualization="wave") {
        var spectroButton = this._drawSpectroButton(basePath, visualization);
        var waveButton = this._drawWaveButton(basePath, visualization);
        var spectroVisualClass = (visualization == "spectro")? "selected": "";
        var waveVisualClass = (visualization == "wave")? "selected": "";
        var resp = `
                <div class="player-wrapper" id="player_frame">
                    <div id="inline_buttons">${waveButton}${spectroButton}</div>
                    <div id="spectrogram_frame" class="${spectroVisualClass}" >
                    </div>
                    <div id="waveform_frame" class="${waveVisualClass}">
                    </div>
                    <audio autoplay="false" controls="false" loop="false" id="player_audio">
                    </audio>
                    <div id="inline_credits"></div>
                </div>`;
        return resp;
    }
    
    play(frame, recording, basePath, visualization="wave", showSpeed=true, speed=1) {
        var volume = 1;
        var spectroButton = this._drawSpectroButton(basePath, visualization);
        var waveButton = this._drawWaveButton(basePath, visualization);
        var spectroVisualClass = (visualization == "spectro")? "selected": "";
        var waveVisualClass = (visualization == "wave")? "selected": "";
        var speedClass1 = (speed == 1)? "selected":"";
        var speedClass3 = (speed != 1)? "selected":"";
        var recordingPath = (speed != 1)? recording.recording.path.split('.')[0]+'_3x.mp3':recording.recording.path;
        var text_original = "Die Hörfähigkeit der marinen Tierarten ist sehr unterschiedlich. Die Anwendung filtert die Störgeräusche mithilfe von bioakustischen Methoden, um die Hörfähigkeit einzelner Tiere zu simulieren.";
        var text_optimiert = "Große Bartenwale produzieren Rufe Außerhalb des menschlichen Hörbereichs. Indem Sie die Tonhöhe erhöhen, werden diese tiefen Frequenzen hörbar.";
        var resp = `<div class="player-wrapper" id="player_frame">`;
        resp += `   <div id="inline_buttons">${waveButton}${spectroButton}</div>
                    <div id="spectrogram_frame" class="${spectroVisualClass}" >
                        <img class="spectrogram_img" src="${recording.spectrogram}" />
                    </div>
                    <div id="waveform_frame" class="${waveVisualClass}">
                        <img class="waveform_img" src="${recording.waveform}" /><hr class="db_marker"/>
                    </div>
                    <audio autoplay="true" controls="true" loop="true" id="player_audio" oncanplay="this.volume=${volume/4}">
                        <source src="${recording.recording.path}" type="audio/mpeg"/>
                    </audio>
                    <div id="inline_credits"><div id="inline_credits_info"
                       title="${text_original}"
                    >
                    Simulierte Hörfähigkeit:<br/><b>${frame.species.de}</b></div>`;
        if (showSpeed) {
            resp += `
               <div id="speed">
               <div style="padding-left: 13px;">
               <div id="speed_1"
                  title="${text_original}"
                  class="speed_button ${speedClass1}" 
                  onClick="controller.changeSpeed(1)">Original</div>
               <div id="speed_3" 
                  title="${text_optimiert}"
                  class="speed_button ${speedClass3}" 
                  onClick="controller.changeSpeed(3)">Optimiert</div>
               </div>
               </div>
            `;
        }
        resp += `</div></div>`;
        return resp;
    }

    _drawSpectroButton(basePath, visualization) {
        var selectedClass = (visualization == "spectro")? "selected": "";
	return `
          <div id="spectro_button" class="${selectedClass}" title="Spektrum" onclick="controller.toggleVisualization('spectro')">
            <svg class="icon" role="img">
              <use xlink:href="${basePath}/icons/sprites.svg#Icon--spectro"></use>
            </svg>
          </div>`;
    }
    
    _drawWaveButton(basePath, visualization) {
        var selectedClass = (visualization == "wave")? "selected": "";
	return `
          <div id="wave_button" class="${selectedClass}" title="Wellenform" onclick="controller.toggleVisualization('wave')">
            <svg class="icon" role="img">
              <use xlink:href="${basePath}/icons/sprites.svg#Icon--wave"></use>
            </svg>
          </div>`;
    }

    /** Event handlers 
        Add event handlers to the main player. 
        Corresponding 'handler' functions are in SoundView.
     */
    addPlayPauseEventHandler(handler) {
        var el = document.getElementById("player_audio");
        if (el) {
            el.addEventListener("play", handler);
            el.addEventListener("pause", handler);
        }
    }
    
    addSeekEventHandler(handler) {
        var el = document.getElementById("player_audio");
        if (el) {
            el.addEventListener("seeked", handler);
        }
    }
    
    addVolumeEventHandler(handler) {
        var el = document.getElementById("player_audio");
        if (el) {
            el.addEventListener("volumechange", handler);
        }
    }
    
    
    /** Toggle wave or spectrum visualization */
    static toggle(visualization) {
        var el, otherEl, visual, otherVisual, noiseVisuals=[], otherNoiseVisuals=[], animalCallVisuals=[];
        if (visualization == 'spectro') {
            otherEl = document.getElementById('wave_button');
            el = document.getElementById('spectro_button');
            visual = document.getElementById('spectrogram_frame');
            otherVisual = document.getElementById('waveform_frame');
            noiseVisuals = document.getElementsByClassName('spectrogram_noise');
            animalCallVisuals = document.getElementsByClassName('spectrogram_call');
            otherNoiseVisuals = document.querySelectorAll('.waveform_noise, .waveform_call');
        } else if (visualization == 'wave') {
            el = document.getElementById('wave_button');
            otherEl = document.getElementById('spectro_button');
            visual = document.getElementById('waveform_frame');
            otherVisual = document.getElementById('spectrogram_frame');
            noiseVisuals = document.getElementsByClassName('waveform_noise');
            animalCallVisuals = document.getElementsByClassName('waveform_call');
            otherNoiseVisuals = document.querySelectorAll('.spectrogram_noise, .spectrogram_call');
        }

        // toggle player visuals
        if (el == null || otherEl == null || visual == null || otherVisual == null)
            throw "Unknown visualization button";
        el.classList.add('selected');
        visual.classList.add('selected');
        otherEl.classList.remove('selected');
        otherVisual.classList.remove('selected');

        // toggle noise visuals
        for (var n=0; n < otherNoiseVisuals.length; n++) {
            otherNoiseVisuals[n].classList.remove('selected');
        }
        for (var n=0; n < noiseVisuals.length; n++) {
            noiseVisuals[n].classList.add('selected');
        }
        if (animalCallVisuals) {
            for (var n=0; n < animalCallVisuals.length; n++) {
                animalCallVisuals[n].classList.add('selected');
            }
        }
    }
}

class HTML5NoisePlayer extends AbstractNoisePlayer {
    /**
     * Draws a player for a noise or an animal call recording
     * noise: noise object to play
     * visualization string 'wave' | 'spectro'
     * mode string 'noise'|'call'
     */
    play(noise, visualization, mode='noise', speed=1) {
        // var volume = (noise.field=='near')? 1.0:0.25; // far-away noises are played quieter
        var volume = 1;
        var wave_selectedClass = "";
        var spectro_selectedClass = "";
        wave_selectedClass = (visualization == 'wave' && noise.active)? "selected": "";
        spectro_selectedClass = (visualization == 'spectro' && noise.active)? "selected": "";
        var recordingPath = (speed == 3)? noise.recording.path.split('.')[0]+'_3x.mp3': noise.recording.path;
        var resp = `
                <div class="spectrogram_${mode} ${spectro_selectedClass}">
                    <img class="spectrogram_img" src="${noise.spectrogram}" />
                </div>
                <div class="waveform_${mode} ${wave_selectedClass}">
                    <img class="waveform_img" src="${noise.waveform}" />
                </div>
                <audio autoplay="true" loop="true" class="player_noise" oncanplay="this.volume=${volume};">
                    <source src="${recordingPath}" type="audio/mpeg"/>
                </audio>`;
        return resp;
    }
    
}

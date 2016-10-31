////////////////////////////////////
//
// SpeechSynth
// A simple wrapper around HTML5 SpeechSynthesis API for modern browsers.
// MIT-style license. Copyright 2016 Nick A. Beers
//
////////////////////////////////////
(function(window, document, undefined) {
	"use strict";
	
	var SpeechSynthProto;
	var SpeechSynth = function(options) {
        //Unchanging settings and defaults
		// Default values for some properties
        this.speechSynth = window.speechSynthesis;
        this.defaultLanguageText = 'Google US English';
        this.volume = 1;
        this.rate = 1;
        this.pitch = 1;

        // Setup plugin specific options
        this.popoutElement = {};
        this.isVisible = false;
        this.voiceSelector = {};
        this.playButton = {};
        this.pauseButton = {};
        this.events = [];

        // Event types
        this.clickEvt = (this.usesTouch) ? "touchstart" : "mousedown";
        
        // set options and create element
        this.setOptions(options);
        this.init(); 
	};

	//////////////////////////////////////////////////////////////////////////////////

    (SpeechSynthProto = SpeechSynth.prototype).nothing = function(){};

	//////////////////////////////////////////////////////////////////////////////////

    SpeechSynthProto.setOptions = function(options){
        var hasOwnProp = Object.prototype.hasOwnProperty;

        // setup defaults for all options that we want users to update
        this.options = {

        };

        // set user specified options
        if(options){
            for (var option in this.options) {
				if (hasOwnProp.call(this.options, option) && options[option] !== undefined) {
					this.options[option] = options[option];
				}
			}
        }
    };

    //////////////////////////////////////////////////////////////////////////////////

    SpeechSynthProto.speechSynthSpeak = function(text) {
        if (text) {
            var utterThis = new SpeechSynthesisUtterance(text);
            var selectedOption = this.voiceSelector.selectedOptions[0].getAttribute('data-name');
            for (i = 0; i < voices.length; i++) {
                if (voices[i].name === selectedOption) {
                    utterThis.voice = voices[i];
                }
            }

            utterThis.volume = (this.volume) ? this.volume : utterthis.volume;
            utterThis.rate = (this.rate) ? this.rate : utterthis.rate;
            utterThis.pitch = (this.pitch) ? this.pitch : utterthis.pitch;

            this.speechSynth.speak(utterThis);
        }
    }
    
	//////////////////////////////////////////////////////////////////////////////////
    
    SpeechSynthProto.generateAudioControls = function(){
        // TODO: Create HTML components and add them into the DOM
        // Allow user to customize classes or provide their own HTML for the controls
        // and specify buttons for each action
    };
    
	//////////////////////////////////////////////////////////////////////////////////
    
    SpeechSynthProto.populateVoiceList = function(){
        var voices = this.speechSynth.getVoices();

        for (i = 0; i < voices.length; i++) {
            var option = document.createElement('option');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

            if (voices[i].default) {
                option.textContent += ' -- DEFAULT';
            }

            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
            this.voiceSelector.appendChild(option);
        }
        
        // default needs work to run on all browsers properly
        for (var i = 0; i < voiceSelect.options.length; i++) {
            if (this.voiceSelector.options[i].getAttribute('data-name') == this.defaultLanguageText) {
                this.voiceSelector.selectedIndex = i;
                break;
            }
        }
    };

	//////////////////////////////////////////////////////////////////////////////////
    
    SpeechSynthProto.addEvents = function(){
        // Add the play button
        this.events.push(this.playButton.addEventListener(this.clickEvt, function(event) {
            event.preventDefault();

            var text = this.getSelectionText();
            this.speechSynthSpeak(text);
        }));
        // Add the stop button
        this.events.push(this.pauseButton.addEventListener(this.clickEvt, function(event){
            event.preventDefault();

            if(this.speechSynth.speaking){
                this.speechSynth.cancel();
            }
        }));
    };

	//////////////////////////////////////////////////////////////////////////////////
	
    SpeechSynthProto.init = function() {
		// Set up events and load in everything
        this.generateAudioControls();
		this.populateVoiceList();
		this.addEvents();
	};
    
    //////////////////////////////////////////////////////////////////////////////////

    SpeechSynthProto.getSelectionText = function() {
        var text = ""
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
        return text;
    }
   
	//////////////////////////////////////////////////////////////////////////////////

    // Expose class to user
    window.SpeechSynth = SpeechSynth;

})(this, this.document);
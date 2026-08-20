import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isDarkMode: boolean;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isDarkMode, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'nl-BE';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            onTranscript(transcript);
          } else {
            currentTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current || disabled) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      id="btn-voice-dictation"
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      title={isListening ? 'Stop spraakopname' : 'Spreek feitenrelaas in (Spraakherkenning)'}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        isListening
          ? 'bg-red-600 text-white border-red-500 animate-pulse shadow-md shadow-red-500/20'
          : isDarkMode
          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
      }`}
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 text-white" />
          <span>Opname actief...</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-blue-500" />
          <span>Inspreken</span>
        </>
      )}
    </button>
  );
};

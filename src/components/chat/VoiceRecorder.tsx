import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, Trash2 } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

type VoiceRecorderProps = {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
};

const VoiceRecorder = ({ onSend, onCancel }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      waveformRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#4CAF50',
        progressColor: '#2E7D32',
        cursorWidth: 0,
        height: 40,
        barWidth: 2,
        barGap: 1,
      });
    }

    return () => {
      waveformRef.current?.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Load the recorded audio into the waveform
        if (waveformRef.current) {
          waveformRef.current.loadBlob(blob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
      {isRecording ? (
        <>
          <div className="flex-1 flex items-center space-x-4">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
              <Mic size={16} className="text-white" />
            </div>
            <span className="text-gray-600">{formatTime(recordingTime)}</span>
            <div ref={containerRef} className="flex-1" />
          </div>
          <button
            onClick={stopRecording}
            className="p-2 text-red-500 hover:text-red-600"
          >
            <Square size={20} />
          </button>
        </>
      ) : audioBlob ? (
        <>
          <div className="flex-1">
            <div ref={containerRef} />
          </div>
          <button
            onClick={handleSend}
            className="p-2 text-green-500 hover:text-green-600"
          >
            <Send size={20} />
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-red-500 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </>
      ) : (
        <button
          onClick={startRecording}
          className="p-2 text-gray-500 hover:text-gray-600"
        >
          <Mic size={20} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
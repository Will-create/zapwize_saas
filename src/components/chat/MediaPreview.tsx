import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type MediaPreviewProps = {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  caption?: string;
  onClose: () => void;
};

const MediaPreview = ({ type, url, caption, onClose }: MediaPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Reset state when media changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [url]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img src={url} alt={caption} className="max-h-full max-w-full object-contain" />
          </div>
        );

      case 'video':
        return (
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <video
              src={url}
              controls
              className="max-h-full max-w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              muted={isMuted}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex-1 mx-4">
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <button onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <audio
              src={url}
              controls
              className="w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<div className="text-center">Loading document...</div>}
              error={<div className="text-center text-red-500">Failed to load document</div>}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && (
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink size={20} />
          </button>
          <button
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = '';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download size={20} />
          </button>
          <button
            className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {renderContent()}
        {caption && (
          <div className="absolute bottom-4 left-4 right-4 text-center text-white bg-black bg-opacity-50 p-2 rounded">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPreview;
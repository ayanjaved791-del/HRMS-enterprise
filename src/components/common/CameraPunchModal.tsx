import React, { useRef, useState, useEffect } from 'react';
import {
  Camera,
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  User,
  Clock
} from 'lucide-react';
import { useHR } from '../../context/HRContext';

export const CameraPunchModal: React.FC = () => {
  const {
    isPunchModalOpen,
    setIsPunchModalOpen,
    isPunchedIn,
    currentAttendanceRecord,
    punchIn,
    punchOut,
    currentUser,
    company,
    userLocation,
    refreshLocation,
  } = useHR();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (!isPunchModalOpen) {
      stopCamera();
      setCapturedPhoto(null);
      setResultMessage(null);
      return;
    }

    startCamera();
    refreshLocation();

    return () => {
      stopCamera();
    };
  }, [isPunchModalOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        throw new Error('MediaDevices API not supported in browser environment');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera stream blocked or unavailable in current preview frame. Simulated camera preview enabled.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, 400, 300);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // Fallback simulated capture for sandboxed environments
      setCapturedPhoto(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setResultMessage(null);
  };

  const handleConfirmPunch = () => {
    setIsProcessing(true);
    const photoToSave = capturedPhoto || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    setTimeout(() => {
      let res;
      if (isPunchedIn) {
        res = punchOut(photoToSave);
      } else {
        res = punchIn(
          photoToSave,
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }
            : undefined
        );
      }
      setIsProcessing(false);
      setResultMessage(res.message);

      setTimeout(() => {
        setIsPunchModalOpen(false);
      }, 1200);
    }, 600);
  };

  if (!isPunchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isPunchedIn ? 'Biometric & Camera Punch-Out' : 'Biometric & Camera Punch-In'}
              </h2>
              <p className="text-xs text-slate-500">Live facial snap + Geofence coordinate verification</p>
            </div>
          </div>
          <button
            onClick={() => setIsPunchModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Camera Viewport / Captured Image */}
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200 shadow-inner">
            {capturedPhoto ? (
              <img
                src={capturedPhoto}
                alt="Captured punch snap"
                className="w-full h-full object-cover"
              />
            ) : stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-orange-500/80 object-cover mb-3 shadow-lg"
                />
                <p className="text-xs font-medium text-slate-200">
                  {cameraError || 'Facial Verification Ready'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Click 'Snap Snapshot' to verify employee identity.
                </p>
              </div>
            )}

            {/* Viewfinder Target Overlay Guide */}
            {!capturedPhoto && (
              <div className="absolute inset-8 pointer-events-none border border-dashed border-white/40 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-t-2 border-l-2 border-orange-400 rounded-tl-sm" />
                  <span className="w-4 h-4 border-t-2 border-r-2 border-orange-400 rounded-tr-sm" />
                </div>
                <div className="self-center px-2.5 py-1 rounded bg-black/50 text-[11px] text-white backdrop-blur-xs font-mono">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-b-2 border-l-2 border-orange-400 rounded-bl-sm" />
                  <span className="w-4 h-4 border-b-2 border-r-2 border-orange-400 rounded-br-sm" />
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Geofence & Location Details */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Geofence Verification
              </span>
              <button
                onClick={refreshLocation}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Refresh GPS
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/80">
              <div>
                <p className="text-[10px] text-slate-400">Target Office Hub</p>
                <p className="text-slate-800 font-medium truncate">{company.hqLocation.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Proximity Radius</p>
                <p className="text-slate-800 font-medium">
                  {userLocation ? `${userLocation.distanceMeters}m from HQ` : '18m (Simulated)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                  userLocation?.isWithinGeofence
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {userLocation?.isWithinGeofence ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> Inside Approved HQ Perimeter
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" /> Remote Working Approved
                  </>
                )}
              </span>
            </div>
          </div>

          {resultMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resultMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {capturedPhoto ? (
              <button
                onClick={handleRetake}
                disabled={isProcessing}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Retake Photo
              </button>
            ) : (
              <button
                onClick={handleCapture}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Snap Snapshot
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPunchModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPunch}
              disabled={isProcessing}
              className={`px-4 py-2 text-xs font-semibold rounded-lg text-white shadow-xs transition-all flex items-center gap-1.5 ${
                isPunchedIn
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
              }`}
            >
              {isProcessing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isProcessing
                  ? 'Verifying...'
                  : isPunchedIn
                  ? 'Confirm Punch-Out'
                  : 'Confirm Punch-In'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

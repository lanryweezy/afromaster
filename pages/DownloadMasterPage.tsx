import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { encodeWAV } from '../utils/wavEncoder';
import { initiatePaystackPayment } from '../services/paymentService';
import { IconDownload, IconArrowRight, IconCheckCircle, IconLockClosed, IconSparkles } from '../constants';


const DownloadMasterPage: React.FC = () => {
  const { setCurrentPage, masteredTrackInfo, masteredAudioBuffer } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');


  if (!masteredTrackInfo || !masteredAudioBuffer) {
    setCurrentPage(AppPage.UPLOAD);
    return <p>No mastered track found, redirecting...</p>;
  }

  const handleDownload = (format: 'wav' | 'mp3' | 'flac') => {
    // For this demo, let's assume a successful payment unlocks the feature permanently
    // In a real app, you'd check the user's subscription status from context
    if (format !== 'wav' && paymentStatus !== 'success') {
        setIsModalOpen(true);
        return;
    }

    if (format === 'wav') {
        const wavBlob = encodeWAV(masteredAudioBuffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${masteredTrackInfo.name.replace(/\.[^/.]+$/, "")}_mastered.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        // Here you would trigger the download for the other formats
        alert(`Simulating download of ${format.toUpperCase()} file. This would be enabled for Pro users.`);
    }
  };
  
  const handleUpgrade = () => {
    setPaymentStatus('processing');
    initiatePaystackPayment(
        (response) => {
            console.log('Payment successful:', response);
            setPaymentStatus('success');
        },
        () => {
            console.log('Payment modal closed by user.');
            setPaymentStatus('idle');
        }
    );
  };

  const closeModal = () => {
      setIsModalOpen(false);
      // Don't reset payment status if it was successful
      if (paymentStatus !== 'success') {
          setPaymentStatus('idle');
      }
  };
  
  const { name, settings } = masteredTrackInfo;

  return (
    <>
      <div className="max-w-2xl mx-auto text-center p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconCheckCircle className="w-20 h-20 text-green-400" />
        </div>
        <h2 className="text-4xl font-heading font-semibold mb-3 text-gradient-primary">Your Master is Ready!</h2>
        <p className="text-slate-200 mb-6 text-lg">
          <span className="font-semibold text-primary-focus transition-colors">{name}</span> has been successfully Afromastered.
        </p>

        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-lg mb-8 text-sm text-left text-slate-300 space-y-1.5 border border-slate-700/50">
          <p><strong>Genre:</strong> {settings.genre}</p>
          <p><strong>Loudness:</strong> {typeof settings.loudnessTarget === 'string' ? settings.loudnessTarget : `${settings.customLoudnessValue} LUFS`}</p>
          <p><strong>Tone:</strong> {settings.tonePreference}</p>
          <p><strong>Stereo Width:</strong> {settings.stereoWidth}</p>
          <p><strong>Compression:</strong> {settings.compressionAmount}%</p>
          <p><strong>Saturation:</strong> {settings.saturationAmount}%</p>
          <p><strong>Bass/Treble:</strong> {settings.bassBoost.toFixed(1)}dB / {settings.trebleBoost.toFixed(1)}dB</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Choose Your Download Format</h3>
          {/* FUNCTIONAL WAV OPTION */}
          <Button 
            onClick={() => handleDownload('wav')} 
            size="lg" 
            variant="primary"
            leftIcon={<IconDownload className="w-5 h-5"/>}
            className="w-full"
          >
            Download WAV (High Quality)
          </Button>
          
          {/* PRO OPTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => handleDownload('mp3')}
              size="lg"
              variant="ghost"
              leftIcon={paymentStatus === 'success' ? <IconDownload className="w-5 h-5"/> : <IconLockClosed className="w-5 h-5"/>}
              className="w-full relative"
            >
              Download MP3 (Standard)
              {paymentStatus !== 'success' && <span className="absolute -top-2 -right-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PRO</span>}
            </Button>
            <Button 
              onClick={() => handleDownload('flac')} 
              size="lg"
              variant="ghost"
              leftIcon={paymentStatus === 'success' ? <IconDownload className="w-5 h-5"/> : <IconLockClosed className="w-5 h-5"/>}
              className="w-full relative"
            >
              Download FLAC (Lossless)
               {paymentStatus !== 'success' && <span className="absolute -top-2 -right-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PRO</span>}
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <Button 
            onClick={() => setCurrentPage(AppPage.DASHBOARD)} 
            size="md"
            variant="secondary"
            rightIcon={<IconArrowRight className="w-5 h-5"/>}
          >
            Finish & View Dashboard
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Upgrade to Pro">
        {paymentStatus === 'success' ? (
            <div className="text-center">
                <IconCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h3>
                <p className="text-slate-300 mb-6">You've unlocked Pro features. You can now download MP3 and FLAC formats.</p>
                <Button size="lg" onClick={closeModal}>
                    Awesome!
                </Button>
            </div>
        ) : (
            <div className="text-center">
                <IconSparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                <p className="text-lg text-slate-200 mb-4">Unlock high-quality downloads and advanced features for just <span className="font-bold text-white">₦5,000</span>.</p>
                <ul className="text-left space-y-2 text-slate-400 mb-6 list-disc list-inside">
                    <li>Download lossless WAV & FLAC files</li>
                    <li>Download high-bitrate MP3 files</li>
                    <li>Advanced AI models</li>
                    <li>Priority support</li>
                </ul>
                <Button size="lg" onClick={handleUpgrade} isLoading={paymentStatus === 'processing'}>
                    {paymentStatus === 'processing' ? 'Processing...' : 'Upgrade Now with Paystack'}
                </Button>
                <p className="text-xs text-slate-500 mt-4">This will open the Paystack payment gateway.</p>
            </div>
        )}
      </Modal>
    </>
  );
};

export default DownloadMasterPage;

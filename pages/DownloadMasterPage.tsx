import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { encodeWAV } from '../utils/wavEncoder';
import { deductCredits } from '../services/paymentService';
import { checkAndDeductCredits } from '../services/firebaseService';
import { IconDownload, IconArrowRight, IconCheckCircle, IconLockClosed, IconSparkles, IconAlertTriangle } from '../constants';
import PageContainer from '../components/PageContainer';

const DownloadMasterPage: React.FC = () => {
  const { setCurrentPage, masteredTrackInfo, masteredAudioBuffer, user, setIsLoading, setErrorMessage } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // Payment status removed - users now purchase credits separately

  if (!masteredTrackInfo || !masteredAudioBuffer) {
    setCurrentPage(AppPage.UPLOAD);
    return <p>No mastered track found, redirecting...</p>;
  }

  const handleDownload = async (format: 'wav' | 'mp3' | 'flac') => {
    if (!user) {
      setCurrentPage(AppPage.AUTH);
      return;
    }

    // For premium formats, direct users to purchase credits
    if (format !== 'wav') {
      setIsModalOpen(true);
      return;
    }

    setIsDownloading(true);
    try {
      const hasEnoughCredits = await checkAndDeductCredits(user, setIsLoading, setErrorMessage);
      if (!hasEnoughCredits) {
        setIsCreditModalOpen(true);
        return;
      }

      if (format === 'wav') {
        const wavBlob = encodeWAV(masteredAudioBuffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${masteredTrackInfo.name.replace(/\.[^/.]+$/, '')}_mastered.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert(`Simulating download of ${format.toUpperCase()} file. This would be enabled for Pro users.`);
      }
    } catch (error) {
      console.error('An error occurred during download preparation:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpgrade = () => {
    // Redirect to credits purchase page
    setCurrentPage(AppPage.BUY_CREDITS);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { name, settings } = masteredTrackInfo;

  return (
    <>
      <PageContainer>
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconCheckCircle className="w-20 h-20 text-green-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-3 text-gradient-primary">Your Master is Ready!</h2>
        <p className="text-slate-200 mb-6 text-lg">
          <span className="font-semibold text-primary-focus transition-colors">{name}</span> has been successfully Afromastered.
        </p>

        <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-lg mb-8 text-sm text-left text-slate-300 space-y-1.5 border border-slate-700/50">
          <p><strong>Genre:</strong> {settings.genre}</p>
          <p><strong>Loudness:</strong> {typeof settings.loudnessTarget === 'string' ? settings.loudnessTarget : `${settings.customLoudnessValue} LUFS`}</p>
          <p><strong>Tone:</strong> {settings.tonePreference}</p>
          <p><strong>Stereo Width:</strong> {settings.stereoWidth}</p>
          <p><strong>Compression:</strong> {settings.compressionAmount}%</p>
          <p><strong>Saturation:</strong> {settings.saturation?.amount ?? settings.saturationAmount}%</p>
          <p><strong>Bass/Treble:</strong> {settings.bassBoost.toFixed(1)}dB / {settings.trebleBoost.toFixed(1)}dB</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Choose Your Download Format</h3>
          <Button
            onClick={() => handleDownload('wav')}
            size="lg"
            variant="primary"
            leftIcon={<IconDownload className="w-5 h-5" />}
            className="w-full"
            isLoading={isDownloading}
          >
            {isDownloading ? 'Preparing Download...' : 'Download WAV (1 Credit)'}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => handleDownload('mp3')}
              size="lg"
              variant="ghost"
              leftIcon={paymentStatus === 'success' ? <IconDownload className="w-5 h-5" /> : <IconLockClosed className="w-5 h-5" />}
              className="w-full relative"
              isLoading={isDownloading}
            >
              Download MP3 (Standard)
              {paymentStatus !== 'success' && <span className="absolute -top-2 -right-2 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PRO</span>}
            </Button>
            <Button
              onClick={() => handleDownload('flac')}
              size="lg"
              variant="ghost"
              leftIcon={paymentStatus === 'success' ? <IconDownload className="w-5 h-5" /> : <IconLockClosed className="w-5 h-5" />}
              className="w-full relative"
              isLoading={isDownloading}
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
            rightIcon={<IconArrowRight className="w-5 h-5" />}
          >
            Finish & View Dashboard
          </Button>
        </div>
      </PageContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Upgrade to Pro">
        {paymentStatus === 'success' ? (
          <div className="text-center">
            <IconCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h3>
            <p className="text-slate-300 mb-6">You&apos;ve unlocked Pro features. You can now download MP3 and FLAC formats.</p>
            <Button size="lg" onClick={closeModal}>
              Awesome!
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <IconSparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <p className="text-lg text-slate-200 mb-4">Unlock high-quality downloads and advanced features for just <span className="font-bold text-white">₦5,000</span>.</p>
            <ul className="text-left space-y-2 text-slate-400 mb-6 list-disc list-inside">
              <li>Download lossless WAV &amp; FLAC files</li>
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

      <Modal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} title="Insufficient Credits">
        <div className="text-center">
          <IconAlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-2">Out of Credits</h3>
          <p className="text-slate-300 mb-6">You don&apos;t have enough credits to download this master. Please purchase more to continue.</p>
          <Button
            size="lg"
            onClick={() => {
              setIsCreditModalOpen(false);
              setCurrentPage(AppPage.BUY_CREDITS);
            }}
          >
            Buy Credits
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DownloadMasterPage;

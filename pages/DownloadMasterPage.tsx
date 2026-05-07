import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { encodeWAV } from '../utils/wavEncoder';
import { initiatePaystackPayment } from '../services/paymentService';
import { IconDownload, IconArrowRight, IconCheckCircle, IconLockClosed, IconSparkles } from '../constants';


const DownloadMasterPage: React.FC = () => {
  const { setCurrentPage, projectTracks, masteringVariations, activeVariationId } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const currentVariation = masteringVariations.find(v => v.id === activeVariationId);
  const isBatch = projectTracks.length > 1;

  if (projectTracks.length === 0 || (activeVariationId !== 'original' && !currentVariation)) {
    setCurrentPage(AppPage.UPLOAD);
    return <p>No mastered project found, redirecting...</p>;
  }

  const handleDownloadAll = async () => {
    if (paymentStatus !== 'success' && isBatch) {
        setIsModalOpen(true);
        return;
    }

    for (const track of projectTracks) {
        const buffer = currentVariation?.projectBuffers?.[track.id] || track.audioBuffer;
        if (!buffer) continue;

        const wavBlob = encodeWAV(buffer);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        const variationSuffix = currentVariation ? `_${currentVariation.name.replace(/\s+/g, '_')}` : '_original';
        a.download = `${track.name.replace(/\.[^/.]+$/, "")}${variationSuffix}_mastered.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Brief delay to prevent browser download blocking
        await new Promise(resolve => setTimeout(resolve, 800));
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

  return (
    <>
      <div className="max-w-3xl mx-auto text-center p-6 sm:p-10 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl card-accent">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconCheckCircle className="w-16 h-16 text-green-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-3 text-gradient-primary">Project Export Ready</h2>
        <p className="text-slate-300 mb-8 text-lg">
          {isBatch ? `Your ${projectTracks.length}-track EP has been unified.` : `Your master is ready for release.`}
        </p>

        <div className="bg-indigo-900/20 backdrop-blur-md p-6 rounded-2xl mb-8 text-left border border-indigo-500/30">
          <div className="flex justify-between items-start mb-4">
              <h4 className="text-indigo-400 font-bold uppercase text-[10px] tracking-widest">Unified Project DNA</h4>
              <span className="px-2 py-0.5 rounded bg-indigo-500 text-[9px] font-bold text-white uppercase tracking-tighter">Consistency ON</span>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-slate-300">
            <p><strong>Master Vibe:</strong> {currentVariation?.name || 'Original'}</p>
            <p><strong>Target LUFS:</strong> -14.0</p>
            <p><strong>Tracks:</strong> {projectTracks.length}</p>
            <p><strong>Cohesion:</strong> High (Matched)</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleDownloadAll} 
            size="lg" 
            variant="primary"
            leftIcon={<IconDownload className="w-5 h-5"/>}
            className="w-full shadow-primary/20 shadow-xl"
          >
            {isBatch ? `Download All Tracks (.WAV)` : `Download Master (.WAV)`}
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
             <Button variant="ghost" disabled className="w-full cursor-not-allowed">Export as ZIP (PRO)</Button>
             <Button variant="ghost" disabled className="w-full cursor-not-allowed">MP3/FLAC Batch (PRO)</Button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setCurrentPage(AppPage.PREVIEW)} variant="ghost" className="text-xs">Back to Preview</Button>
          <Button onClick={() => window.location.reload()} variant="secondary" className="text-xs">Start New Project</Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Unlock Batch Export">
        <div className="text-center">
            <IconSparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Project Mode Restricted</h3>
            <p className="text-slate-400 mb-6">Mastering entire albums with 1-click consistency is a <span className="text-primary font-bold">Pro Feature</span>.</p>
            <Button size="lg" onClick={handleUpgrade} isLoading={paymentStatus === 'processing'}>
                Upgrade to Pro (₦5,000)
            </Button>
        </div>
      </Modal>
    </>
  );
};

export default DownloadMasterPage;

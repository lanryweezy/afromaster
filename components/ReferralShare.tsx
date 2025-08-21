import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { IconShare, IconCopy, IconCheck, IconUsers, IconGift } from '../constants';
import Button from './Button';

interface ReferralShareProps {
  className?: string;
}

const ReferralShare: React.FC<ReferralShareProps> = ({ className = '' }) => {
  const { user } = useAppContext();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (user) {
      // Get user's referral data from Firestore
      const getUserReferralData = async () => {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../src/firebaseConfig');
          
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setReferralCode(userData.referralCode || '');
            setReferralCount(userData.referralCount || 0);
          }
        } catch (error) {
          console.error('Error fetching referral data:', error);
        }
      };
      
      getUserReferralData();
    }
  }, [user]);

  useEffect(() => {
    if (referralCode) {
      setShareUrl(`${window.location.origin}?ref=${referralCode}`);
    }
  }, [referralCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Afromaster - Free AI Mastering',
          text: 'Get your tracks mastered for FREE! Use my referral code to get started.',
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
    }
  };

  if (!user || !referralCode) {
    return null;
  }

  return (
    <div className={`bg-slate-800/60 backdrop-blur-md p-6 rounded-lg border border-slate-700/50 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <IconGift className="w-6 h-6 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Share & Earn Credits</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300">
          <IconUsers className="w-5 h-5" />
          <span>You've referred {referralCount} friends</span>
          {referralCount > 0 && (
            <span className="text-green-400 font-semibold">
              (+{Math.min(referralCount, 5)} credits earned!)
            </span>
          )}
        </div>

        <div className="bg-slate-900/50 p-3 rounded border border-slate-600">
          <p className="text-sm text-slate-400 mb-2">Your Referral Link:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:border-primary focus:outline-none"
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              variant="secondary"
              leftIcon={copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={shareApp}
            size="md"
            variant="primary"
            leftIcon={<IconShare className="w-4 h-4" />}
            className="w-full"
          >
            Share App
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-slate-400">Refer up to 5 friends</p>
            <p className="text-xs text-green-400 font-semibold">1 credit per referral</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p>• Your friends get 1 free credit when they sign up</p>
          <p>• You earn 1 credit for each friend who joins (up to 5)</p>
          <p>• Credits can be used to download mastered tracks</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralShare;

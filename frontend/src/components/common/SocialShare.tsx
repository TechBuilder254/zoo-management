import React from 'react';
import { Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url?: string;
  title?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = 'Check this out!',
  className = '',
}) => {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform];
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Share:</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="hover:text-blue-600"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="hover:text-sky-500"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="hover:text-green-600"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className="hover:text-primary"
        aria-label="Copy link"
      >
        <LinkIcon size={18} />
      </Button>
    </div>
  );
};


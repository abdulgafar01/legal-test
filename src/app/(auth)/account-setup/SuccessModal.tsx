import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <DialogContent className="max-w-sm mx-auto text-center border-0 shadow-lg">
        <div className="py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <DialogTitle>
            
          </DialogTitle>
          <h2 className="text-2xl font-semibold mb-4">Congratulations</h2>
          <p className="text-gray-600">
            Your profile is ready. Service seekers can see your profile details now.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;

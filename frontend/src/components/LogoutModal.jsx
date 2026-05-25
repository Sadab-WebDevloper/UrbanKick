import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-[320px] rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center">
          {/* Icon Header - Scaled Down */}
          <div className="w-14 h-14 bg-red-50 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-inner">
            <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <LogOut className="w-5 h-5" />
            </div>
          </div>

          <h3 className="text-xl font-black text-primary tracking-tight mb-2 ">
            Logout ?
          </h3>
          <p className="text-xs text-secondary font-bold px-2 leading-relaxed mb-6 opacity-80">
            Are you sure you want to log out of your Account?
          </p>

          <div className="flex flex-col gap-2">
            <button 
              onClick={onConfirm}
              className="w-full py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Yes,  Logout</span>
            </button>
            
          </div>
        </div>

        {/* Bottom Safety Hint - Minimal */}
        <div className="bg-gray-50/50 py-3 px-6 border-t border-gray-100 text-center">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Secure Session</span>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white p-4 m-4 rounded shadow-lg w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-end mr-3">
          <button onClick={onClose} className="mb-1">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;

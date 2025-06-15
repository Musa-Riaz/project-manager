import { X } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";
import Header from "@/app/(components)/Header";
type Props = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
      <div className="w-full px-2 max-w-2xl rounded-lg bg-white pt-4 shadow-lg dark:bg-dark-secondary">
        <Header
          name={name}
          buttonComponent={
            <button
              className="flex h-7 w-7 justify-center items-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
    isOpen:boolean,
    onClose: () => void,
    title:string,
    children:ReactNode
  }

const Modal = ({ isOpen, onClose, title, children}:ModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    )
  }

export default Modal

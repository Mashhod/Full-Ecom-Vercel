import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  id, 
  type = 'success', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500',
      title: 'text-green-800',
      message: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      message: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      message: 'text-blue-700',
    },
  };

  const Icon = icons[type];
  const colorClasses = colors[type];

  return (
    <div
      className={`${colorClasses.bg} ${colorClasses.border} border rounded-xl shadow-soft p-4 mb-3 max-w-sm w-full transform transition-all duration-300 ease-out ${isExiting ? 'animate-toast-exit' : 'animate-toast-slide'} hover:shadow-medium transition-shadow duration-200`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h4 className={`text-sm font-semibold ${colorClasses.title} mb-1`}>
              {title}
            </h4>
          )}
          <p className={`text-sm ${colorClasses.message}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className={`${colorClasses.icon} hover:opacity-70 transition-opacity duration-200 rounded-full p-1 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${type === 'success' ? 'focus:ring-green-500' : type === 'error' ? 'focus:ring-red-500' : type === 'warning' ? 'focus:ring-yellow-500' : 'focus:ring-blue-500'}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;

"use client";

import React from "react";

interface MapDialogProps {
  location: {
    lat: number;
    lng: number;
    label?: string;
    time?: string;
  } | null;
  onClose: () => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ location, onClose }) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {location.label || "位置情報"}
            </h2>
            {location.time && (
              <p className="text-gray-600 text-sm mt-1">
                時刻: {location.time}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-0">
          <iframe
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=ja&z=16&output=embed`}
            width="100%"
            height="450"
            className="border-0 rounded-b-2xl"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default MapDialog;
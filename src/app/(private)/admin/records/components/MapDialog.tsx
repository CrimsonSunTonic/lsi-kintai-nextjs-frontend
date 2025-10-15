"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  return (
    <Dialog open={!!location} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {location?.label
          ? `${location.label} の位置 (${location.time})`
          : "地図の表示"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {location && (
          <iframe
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=ja&z=16&output=embed`}
            width="100%"
            height="450px"
            style={{ border: 0 }}
            loading="lazy"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;

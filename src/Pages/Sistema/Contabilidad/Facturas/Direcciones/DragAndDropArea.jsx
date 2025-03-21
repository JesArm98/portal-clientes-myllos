import { useState } from "react";
import { Box, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const DragAndDropArea = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    onFileSelect(files);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    onFileSelect(files);
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: `2px dashed ${isDragging ? "#1976d2" : "#9e9e9e"}`,
        borderRadius: 4,
        padding: 3,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragging ? "#e3f2fd" : "#fafafa",
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      <Box
        onClick={() => document.getElementById("upload-drag-and-drop").click()}
        sx={{ cursor: "pointer" }}
      >
        <UploadFileIcon sx={{ fontSize: 48, color: "#1976d2" }} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Arrastra tus archivos XML aquí o haz clic para seleccionarlos
        </Typography>
        <input
          accept=".xml"
          style={{ display: "none" }}
          id="upload-drag-and-drop"
          type="file"
          multiple
          onChange={handleFileSelect}
        />
      </Box>
    </Box>
  );
};

export default DragAndDropArea;

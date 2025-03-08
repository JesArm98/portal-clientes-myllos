import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddressForm from "./AddressForm";

const AddressDialog = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  isEditing = false,
  title = ""
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    {console.log(data)}
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar la dirección:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="address-dialog-title"
    >
      <DialogTitle id="address-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <AddressForm 
          onSubmit={handleSubmit} 
          initialValues={initialValues || {}} 
          isEditing={isEditing} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
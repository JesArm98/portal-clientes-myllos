import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  DialogTitle,
  Slide,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Transition = React.forwardRef(function Transition(props, ref) {
  const { direction, timeout } = props;
  return <Slide direction={direction} ref={ref} {...props} timeout={timeout} />;
});

const CustomDialog = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  isSubmitting,
  submitLabel = "Guardar",
  submitDisabled = false,
  onPdfPreview = false,
  width = "sm",
  paddingContent = 2,
  colorTitle = "#3DC2CF",
  marginBottomContent = "15px",
  heightTitle = "10px",
  fontSize = "1.25rem",
  defectIconButton = "",
  hoveredIconButton = "",
  transitionDirection = "up",
  transitionTimeout = 600,
  disableBackdrop = false,
}) => {
  const [hovered, setHovered] = useState(false);

  // Memoizar estilos para evitar re-renders innecesarios
  const dialogTitleStyles = useMemo(
    () => ({
      display: "flex",
      justifyContent: "center",
      backgroundColor: colorTitle,
      color: "white",
      fontSize: fontSize,
      fontWeight: 700,
      height: heightTitle,
      alignItems: "center",
      marginBottom: onPdfPreview ? "0px" : marginBottomContent,
    }),
    [colorTitle, fontSize, heightTitle, marginBottomContent, onPdfPreview]
  );

  const closeIconStyles = {
    position: "absolute",
    zIndex: 13,
    color: "white",
    right: 8,
    top: 8,
    cursor: "pointer",
  };

  const submitButtonStyles = {
    fontSize: "16px",
    textTransform: "none",
  };

  return (
    <Dialog
      open={open}
      maxWidth={width}
      fullWidth
      TransitionComponent={Transition}
      TransitionProps={{
        direction: transitionDirection,
        timeout: transitionTimeout,
      }}
      BackdropProps={{
        style: {
          backgroundColor: disableBackdrop
            ? "transparent"
            : "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle sx={dialogTitleStyles}>{title}</DialogTitle>

      <Box sx={{ p: paddingContent }}>{children}</Box>

      <HighlightOffIcon
        sx={closeIconStyles}
        onClick={onClose}
        variant="contained"
      />

      {!onPdfPreview && (
        <DialogActions>
          <Button
            onClick={onSubmit}
            color="primary"
            disabled={isSubmitting || submitDisabled}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={submitButtonStyles}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} />
              ) : hovered ? (
                hoveredIconButton
              ) : (
                defectIconButton
              )
            }
          >
            {isSubmitting ? "Procesando..." : submitLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomDialog;

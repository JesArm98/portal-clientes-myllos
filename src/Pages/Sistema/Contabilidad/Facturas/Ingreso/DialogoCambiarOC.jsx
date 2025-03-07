import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { useSnackbar } from "@/Context/SnackbarContext";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
//import { useAuth } from "@/Context/AuthContext";

const URL = import.meta.env.VITE_API_URL;

const DialogoCambiarOC = ({
  open,
  setOpenCambiarOC,
  uuid,
  setContador,
  contador,
  tituloModalCE,
  subTotal,
}) => {
  const [ordenCompra, setOrdenCompra] = useState("");
  const [openCollapseDe, setOpenCollapseDe] = useState(false);
  const [montoOrdenCompra, setMontoOrdenCompra] = useState("");
  const [disabledButtonOC, setDisabledButtonOC] = useState(false);
  const { showSnackbar } = useSnackbar();

  //const { getConfig } = useAuth();

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(value),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Validar que solo contenga números y más de 3 caracteres
    if (/^\d*$/.test(value)) {
      setOrdenCompra(value);
    }
  };

  //   EDITA LA ORDEN DE COMPRA METODO
  const handleEditarOC = async () => {
    let errorGuardado = ""; // Declarar errorGuardado fuera del try-catch

    try {
      const config = getConfig();

      // Realiza la solicitud GET a la URL de prueba
      const getResponse = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetFacturaByUUID?uuid=${uuid}`,
        config
      );

      const dataFromGet = getResponse.data;

      const responseList = [dataFromGet];

      if (responseList[0]) {
        responseList[0].ordenCompra = ordenCompra;
      }

      // Envía la solicitud POST
      const postResponse = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/ValidarFacturaOC`,
        responseList,
        config
      );

      errorGuardado = postResponse.data[0].error;

      // Envía la solicitud POST
      const EditarOC = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/EditarFacturaOrdenCompra`,
        postResponse.data[0],
        config
      );

      // Verifica el código de estado de la respuesta
      if (EditarOC.status === 200) {
        showSnackbar("Orden de compra actualizada con éxito", "success");
        setContador(contador + 1);
        setOpenCambiarOC(false);
      } else {
        setOpenCambiarOC(false);
      }
    } catch (error) {
      // Mostrar el errorGuardado que ya se asignó en el bloque try
      showSnackbar(errorGuardado || "Ocurrió un error inesperado", "error");
    }
  };

  const handleConsultarOC = async () => {
    try {
      const config = getConfig();

      const getResponse = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetOrdenCompraCargos?ordenCompra=${ordenCompra}`,
        config
      );

      if (getResponse.status === 200) {
        setMontoOrdenCompra(getResponse.data);
        showSnackbar("Orden de compra encontrada", "success");
        setDisabledButtonOC(true); // Deshabilitar botón si el estado es 200
      }
    } catch (error) {
      console.error("Error al consultar la Orden de Compra:", error);
      showSnackbar("Orden de compra no existe", "error");
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "common.white",
          py: 2,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {tituloModalCE}
      </DialogTitle>

      <HighlightOffIcon
        sx={{
          position: "absolute",
          zIndex: 13,
          color: "white",
          right: 12,
          top: 12,
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.2)",
          },
        }}
        onClick={() => {
          setOpenCambiarOC(false),
            setMontoOrdenCompra(""),
            setDisabledButtonOC(false);
        }}
        variant="contained"
      />

      <DialogContent sx={{ mt: 3, px: 4 }}>
        <Box style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            Introduce la orden de compra:
          </Typography>
          <Box
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              id="ordenCompra"
              value={ordenCompra}
              onChange={handleInputChange}
              placeholder="Orden de compra"
              style={{
                width: "100%",
                padding: "8px 40px 8px 8px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              style={{
                position: "absolute",
                right: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleConsultarOC()}
            >
              🔍
            </button>
          </Box>
        </Box>

        {montoOrdenCompra && montoOrdenCompra.razonSocial && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              onClick={() => setOpenCollapseDe((prev) => !prev)}
              endIcon={openCollapseDe ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Detalles de la Orden de Compra
            </Button>
          </Box>
        )}
        {montoOrdenCompra && montoOrdenCompra.razonSocial && (
          <Collapse in={openCollapseDe}>
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Monto:
                  </Typography>
                  <TextField
                    value={`${formatCurrency(montoOrdenCompra?.monto)} ${
                      montoOrdenCompra?.abrevia
                    }`}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cargado:
                  </Typography>
                  <TextField
                    value={formatCurrency(montoOrdenCompra?.montoCargado)}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Disponible:
                  </Typography>
                  <TextField
                    value={formatCurrency(montoOrdenCompra?.montoDisponible)}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Moneda:
                  </Typography>
                  <TextField
                    value={montoOrdenCompra?.abrevia}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Clave SAP:
                  </Typography>
                  <TextField
                    value={montoOrdenCompra?.claveSapSucursal}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Razón Social:
                  </Typography>
                  <TextField
                    value={montoOrdenCompra?.razonSocial}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography>
            Subtotal de la factura de ingreso: ${subTotal}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          disabled={!disabledButtonOC}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: disabledButtonOC ? "#262e66" : "#ccc",
            color: "white",
            cursor: disabledButtonOC ? "pointer" : "not-allowed",
          }}
          onClick={() => handleEditarOC()}
        >
          Cambiar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogoCambiarOC;

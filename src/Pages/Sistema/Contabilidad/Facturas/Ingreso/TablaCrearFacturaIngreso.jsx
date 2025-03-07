import { useEffect, useState } from "react";
import CustomTable from "@/Components/Custom/CustomTable";
import { useSnackbar } from "@/Context/SnackbarContext";
//import { useAuth } from "@/Context/AuthContext";
import { tableCellPropsCenter } from "@/Components/Custom/CustomBoxStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Collapse,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useMemo } from "react";

function TablaFacturaIngresos({
  agencias,
  setInvalidos,
  setValidadaCount,
  total,
  setTotal,
  setVerificacionDataConOC,
}) {
 // const { getConfig } = useAuth();
  const [data, setData] = useState(agencias);
  const { showSnackbar } = useSnackbar();
  const [tempOrdenDeCompraNumber, setTempOrdenDeCompraNumber] = useState("");
  const [montoOrdenCompra, setMontoOrdenCompra] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openCollapseDe, setOpenCollapseDe] = useState(false);

  const [rowSelection, setRowSelection] = useState({});

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (Array.isArray(data)) {
      const sonTodasInvalidas = data.every(
        (agencia) => agencia.descrEstatus === "INVALIDA"
      );
      setInvalidos(sonTodasInvalidas);
      const numeroValidas = data.filter(
        (agencia) => agencia.descrEstatus === "FACTURA VALIDA"
      ).length;
      setValidadaCount(numeroValidas);
    } else {
      console.error("La variable 'data' no es un arreglo:", data);
    }
  }, [data]);

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    const selectedRows = data.filter((row) => {
      const rowId = row.uuid || row.id;
      return selectedRowIds.includes(rowId);
    });
    const newTotal = selectedRows.reduce((acc, row) => {
      const totalValue = parseFloat(row.facturaDto?.Total) || 0;
      return acc + totalValue;
    }, 0);
    setTotal(newTotal);
  }, [rowSelection, data]);

  const columns = [
    {
      accessorKey: "descrEstatus",
      header: "ESTATUS",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Chip
            label={status}
            color={status === "FACTURA VALIDA" ? "success" : "error"}
            size="small"
          />
        );
      },
    },
    {
      accessorKey: "existeFactura",
      header: "ESTATUS CARGA",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Chip
            label={status === true ? "CARGADO" : "NO CARGADO"}
            color={status === true ? "error" : "success"}
            size="small"
          />
        );
      },
    },
    { accessorKey: "error", header: "Motivo", ...tableCellPropsCenter },

    { accessorKey: "ordenCompra", header: "OC", ...tableCellPropsCenter },
    { accessorKey: "uuid", header: "UUID", ...tableCellPropsCenter },
    {
      accessorKey: "facturaDto.Receptor.UsoCFDI",
      header: "Uso CFDI",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Fecha",
      header: "Fecha",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      accessorKey: "facturaDto.Folio",
      header: "Folio",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.SubTotal",
      header: "SubTotal",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(value);
      },
    },
    {
      accessorFn: (row) => {
        try {
          // Verifica si `row`, `facturaDto`, `Impuestos` y `Traslados` existen
          const traslados = row?.facturaDto?.Impuestos?.Traslados;
          // Si `traslados` existe y tiene elementos, devuelve `TasaOCuota`; si no, devuelve una cadena vacía
          return traslados?.length > 0 && traslados[0]?.TasaOCuota
            ? traslados[0].TasaOCuota
            : "";
        } catch (error) {
          // En caso de error, devuelve una cadena vacía
          return "";
        }
      },
      id: "TasaOCuota",
      header: "Tasa",
      ...tableCellPropsCenter,

      Cell: ({ cell }) => {
        const value = cell.getValue();
        return `${value}%`;
      },
    },

    {
      accessorKey: "facturaDto.Impuestos.TotalImpuestosTrasladados",
      header: "Impuestos",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Total",
      header: "Total",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(value);
      },
    },
    {
      accessorKey: "facturaDto.Moneda",
      header: "Moneda",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.MetodoPago",
      header: "Metodo pago",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.FormaPago",
      header: "Forma de pago",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Emisor.Rfc",
      header: "Emisor",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Emisor.Nombre",
      header: "RSocial",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Emisor.RegimenFiscal",
      header: "Regimen",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Receptor.Nombre",
      header: "Receptor",
      ...tableCellPropsCenter,
    },
    { accessorKey: "descrSuc", header: "Sucursal", ...tableCellPropsCenter },

    {
      accessorKey: "facturaDto.Version",
      header: "Versión",
      ...tableCellPropsCenter,
    },
  ];

  const handleConsultar = async () => {
    try {
      const config = getConfig();
      const response = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetOrdenCompraCargos?ordenCompra=${tempOrdenDeCompraNumber}`,
        { ...config, responseType: "text" }
      );
      const parsedData = JSON.parse(response.data);
      setMontoOrdenCompra(parsedData);
    } catch (error) {
      showSnackbar(
        "La orden de compra ingresada no existe. Por favor, verifica el número e intenta nuevamente.",
        "error"
      );
      console.error("Error al consultar la orden de compra:", error);
    }
  };

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(value),
    []
  );

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <CustomTable
        columns={columns}
        data={data}
        getRowId={(row) => row.uuid || row.id}
        state={{ rowSelection }}
        onRowSelectionChange={setRowSelection}
        enableRowSelection
        muiTableContainerProps={{
          sx: {
            maxHeight: "60vh",
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            color="primary"
            disabled={Object.keys(rowSelection).length === 0}
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenModal(true);
              setTempOrdenDeCompraNumber("");
            }}
            variant="contained"
            sx={{ my: 2 }}
          >
            Agregar orden de compra
          </Button>
        )}
      />

      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setMontoOrdenCompra("");
        }}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Ingrese el número de orden de compra
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            label="Orden de compra"
            type="number"
            value={tempOrdenDeCompraNumber}
            onChange={(e) => setTempOrdenDeCompraNumber(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Consultar"
                    onClick={handleConsultar}
                    color="primary"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {montoOrdenCompra.montoDisponible && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                onClick={() => setOpenCollapseDe((prev) => !prev)}
                endIcon={
                  openCollapseDe ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
              >
                Detalles de la Orden de Compra
              </Button>
            </Box>
          )}

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
                    value={`${formatCurrency(montoOrdenCompra.monto)} ${
                      montoOrdenCompra.abrevia
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
                    value={formatCurrency(montoOrdenCompra.montoCargado)}
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
                    value={formatCurrency(montoOrdenCompra.montoDisponible)}
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
                    value={montoOrdenCompra.claveSapSucursal}
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
                    value={montoOrdenCompra.razonSocial}
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>

          <Box
            sx={{
              mt: 1,
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resumen
            </Typography>
            <Typography variant="body1">
              Total de las facturas seleccionadas: {formatCurrency(total)}
            </Typography>
            {montoOrdenCompra && (
              <Typography variant="body1">
                Disponible orden de compra:{" "}
                {formatCurrency(montoOrdenCompra.montoDisponible)}
              </Typography>
            )}
            {montoOrdenCompra.montoDisponible < total && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, fontWeight: "600" }}
              >
                El total de las facturas excede el monto disponible de la orden
                de compra
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            disabled={
              !montoOrdenCompra.montoDisponible ||
              montoOrdenCompra.montoDisponible < total
            }
            color="primary"
            onClick={() => {
              const handleValidacionOC = async (newData) => {
                try {
                  const config = getConfig();
                  const response = await axios.post(
                    "https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/ValidarFacturaOC",
                    newData,
                    config
                  );
                  setData(response.data);
                  setVerificacionDataConOC(response.data);
                } catch (error) {
                  console.error("Error al validar la orden de compra:", error);
                }
              };

              const selectedRowIds = Object.keys(rowSelection);
              const newData = data.map((row) => {
                const rowId = row.uuid || row.id;
                if (selectedRowIds.includes(rowId)) {
                  return {
                    ...row,
                    ordenCompra: Number(tempOrdenDeCompraNumber),
                  };
                } else {
                  return row;
                }
              });

              handleValidacionOC(newData);
              setOpenModal(false);
              setRowSelection({});
            }}
          >
            Añadir orden de compra
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TablaFacturaIngresos;

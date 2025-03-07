import { useEffect, useState } from "react";
import { useSnackbar } from "@/Context/SnackbarContext";
import CustomTable from "@/Components/Custom/CustomTable";
import axios from "axios";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddIcon from "@mui/icons-material/Add";
import { mkConfig } from "export-to-csv";
import CustomSpeedDial from "@/Components/Custom/CustomSpeedDial";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { tableCellPropsCenter } from "@/Components/Custom/CustomBoxStyles";
import ExportCsvButton from "@/Components/Custom/ExportCsvButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  CircularProgress,
  DialogTitle,
  Backdrop,
  ListItemText,
  ListItemIcon,
  ListItem,
  Typography,
  List,
} from "@mui/material";
//import { useAuth } from "@/Context/AuthContext";
import ConceptosIngresos from "./ConceptosIngresos";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewDialog from "@/Components/Custom/PreviewDialog";
import TablaFacturaIngresos from "./TablaCrearFacturaIngreso";
import { InsertDriveFile } from "@mui/icons-material";
import CustomDialog from "@/Components/Custom/CustomDialog";
import DragAndDropArea from "./DragAndDropArea";
import { useNavigate } from "react-router-dom";
import DialogoCambiarOC from "./DialogoCambiarOC";
import DialogoEliminarOC from "./DialogoEliminarOC";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Factura Ingresos",
});

function Ingresos() {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [total, setTotal] = useState(0);
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesJefes, setSucursalesJefes] = useState("");
  const [contador, setContador] = useState(1);
  const [invalidos, setInvalidos] = useState(false);
  const [validadaCount, setValidadaCount] = useState("");
  const [VerificacionData, setVerificacionData] = useState(null);
  const [verificacionDataConOC, setVerificacionDataConOC] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [isMobile] = useState(window.innerWidth <= 600);
  const [agencias, setAgencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tituloModalCE, setTituloModalCE] = useState("");
  const [conceptosDialogOpen, setConceptosDialogOpen] = useState(false);
  const [PDF, setPDF] = useState("");
  const [openPDF, setOpenPDF] = useState(false);
  const [base64Files, setBase64Files] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validados, setValidados] = useState(false);
  const [conceptos, setConceptos] = useState();
  const [openCambiarOC, setOpenCambiarOC] = useState(false);
  const [openEliminarOC, setOpenEliminarOC] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRowId, setOpenRowId] = useState(null); // Estado global de apertura
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(0);
  const [empresas, setEmpresas] = useState([]); // Estado para almacenar empresas
  const navigate = useNavigate();
  //const { getConfig } = useAuth();
  const [uuidOc, setUuidOc] = useState("");
  const [subTotal, setSubTotal] = useState("");

  console.log(invalidos);

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerDatosDeJefes = async () => {
      try {
        const config = getConfig();

        const respuesta = await axios.get(
          `https://${URL}/WS/TuvanosaEmpleados/Api/Empleados/GetJefesSucursales`,
          config
        );

        setSucursalesJefes(
          respuesta.data
            .filter(
              (registro) =>
                registro.idEmpleado ===
                parseInt(localStorage.getItem("idEmpleado"))
            )
            .map((registro) => ({
              id: registro.idSucursal,
            }))
        );
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatosDeJefes();
  }, []);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const config = getConfig();

        const respuesta = await axios.get(
          `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetFacturas?rol=5`,
          config
        );

        setAgencias(respuesta.data);
      } catch (error) {
        if (error.response) {
          // Si el error tiene respuesta del servidor, revisamos el código de estado
          if (error.response.status === 401) {
            showSnackbar("Sesión expirada. Redirigiendo al login...", "error");
            localStorage.clear(); // Limpiar el almacenamiento local
            navigate("/sign-in"); // Redirigir al login
          }
        } else if (error.message === "Network Error") {
          showSnackbar("Sesión expirada. Redirigiendo al login...", "error");
          localStorage.clear(); // Limpiar el almacenamiento local
          navigate("/sign-in"); // Redirigir al login
        } else {
          console.error("Error al obtener los datos:", error);
        }
        showSnackbar(`${error.response.data}`, "error");
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatos();
  }, [contador]);

  const handleOnCloseCrear = async () => {
    setOpenDialog(false);
    setVerificacionData(null);
    setValidados(false);
    setBase64Files([]);
    setInvalidos(false);
    setVerificacionDataConOC(null);
  };

  const handleOpenPDF = async (id) => {
    try {
      const config = getConfig();

      const respuesta = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetFacturaPdfByUUID?uuid=${id}`,

        config
      );

      if (respuesta.status === 200) {
        setPDF({
          archivoB64: respuesta.data,
          type: "application/pdf",
          nombreDoc: `Factura`,
        });

        console.log(respuesta.data);
      }
    } catch (error) {
      showSnackbar(PDF, "error");
    } finally {
      setOpenPDF(true);
    }
  };

  const handleOpenXML = async (id) => {
    try {
      const config = getConfig();
      const respuesta = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetFacturaXmlByUUID?uuid=${id}`,
        { ...config, responseType: "text" }
      );

      if (respuesta.status === 200) {
        const blob = new Blob([respuesta.data], { type: "application/xml" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `factura_${id}.xml`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showSnackbar(`Descargado XML de la factura ${id}`, "success");
      }
    } catch (error) {
      showSnackbar("Error downloading the XML file", "error");
    }
  };

  const handleOpenConceptos = async (conceptos) => {
    setConceptos(conceptos);
    setConceptosDialogOpen(true);
  };

  const getBackgroundColor = (status) => {
    if (status === true || status === "Cargada") return "#2e7d32";
    if (status === false) return "#d32f2f";
    return "#9e9e9e";
  };

  const columns = [
    {
      accessorKey: "descrEstatusSap",
      header: "ESTATUS",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Box
            sx={() => ({
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "4px",
              border: `1px solid ${getBackgroundColor(status)}`,
              color: getBackgroundColor(status),
              fontWeight: "bold",
              width: "fit-content",
              p: "0.2rem",
            })}
          >
            {status.toUpperCase()}
          </Box>
        );
      },
    },

    // ESTATUS
    {
      accessorKey: "estatusSat",
      header: "ESTATUS SAT",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Box
            sx={() => ({
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "4px",
              border: `1px solid ${getBackgroundColor(status)}`,
              color: getBackgroundColor(status),
              fontWeight: "bold",
              width: "fit-content",
              p: "0.2rem",
            })}
          >
            {status === true
              ? "VIGENTE"
              : status === false
              ? "CANCELADA"
              : "ERROR"}
          </Box>
        );
      },
    },

    // UUID
    {
      accessorKey: "uuid",
      header: "UUID",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.Fecha",
      header: "Fecha factura",
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Folio",
      header: "Folio",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "ordenCompra",
      header: "ORDEN COMPRA",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value > 0 ? value : "";
      },
    },

    {
      accessorKey: "facturaDto.Emisor.Rfc",
      header: "RFC Emisor",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Emisor.Nombre",
      header: "Nombre Emisor",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Emisor.RegimenFiscal",
      header: "Regimen Emisor",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.Receptor.Rfc",
      header: "RFC Receptor",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Receptor.Nombre",
      header: "Nombre Receptor",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Receptor.UsoCFDI",
      header: "Uso CFDI",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.TipoDeComprobante",
      header: "Tipo C",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        if (value === "I") return `INGRESO`;
        else return "Invalido";
      },
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.SubTotal",
      header: "SubTotal",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(value);
      },
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.Impuestos.TotalImpuestosTrasladados",
      header: "Impuestos traslados",
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
      accessorKey: "facturaDto.Total",
      header: "Total",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(value);
      },
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.Moneda",
      header: "Moneda",
      ...tableCellPropsCenter,
    },

    {
      accessorFn: (row) => {
        const traslados = row.facturaDto.Impuestos.Traslados;
        if (traslados && traslados.length > 0) {
          return traslados[0].TasaOCuota;
        } else {
          return "";
        }
      },
      id: "TasaOCuota",
      header: "Tasa o Cuota",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return `${value}%`;
      },
    },

    {
      accessorKey: "facturaDto.MetodoPago",
      header: "Metodo de pago",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.FormaPago",
      header: "Forma de pago",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "descrSuc",
      header: "Sucursal",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "descrEmpl",
      header: "Responsable",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.Version",
      header: "Versión",
      ...tableCellPropsCenter,
    },
  ];

  //   ELIMINA LA ORDEN DE COMPRA METODO
  const handleEliminarOC = async () => {
    try {
      const config = getConfig();

      // Realiza la solicitud GET para obtener la factura por UUID
      const getResponse = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/GetFacturaByUUID?uuid=${uuidOc}`,
        config
      );

      // Obtén los datos de la respuesta
      const dataFromGet = getResponse.data;

      // Verifica si hay datos y establece ordenCompra como 0
      if (dataFromGet) {
        dataFromGet.ordenCompra = 0;
      }

      // Envía la solicitud POST para actualizar la orden de compra
      const EditarOC = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/EditarFacturaOrdenCompra`,
        dataFromGet,
        config
      );

      // Verifica el código de estado de la respuesta
      if (EditarOC.status === 200) {
        showSnackbar("Orden de compra eliminada con éxito", "success");
        setOpenEliminarOC(false);
        setContador(contador + 1);
      } else {
        setOpenCambiarOC(false);
      }
    } catch (error) {
      console.error("Error en las solicitudes:", error);
      showSnackbar("Hubo un error al eliminar la orden de compra", "error");
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Aseguramos que la validación sea insensible a mayúsculas
    const xmlFiles = files.filter((file) =>
      file.name.toLowerCase().endsWith(".xml")
    );

    if (xmlFiles.length !== files.length) {
      alert("Por favor, seleccione solo archivos XML.");
      return;
    }

    setLoading(true);
    try {
      const fileObjectsPromises = xmlFiles.map(async (file) => {
        const archivoB64 = await convertFileToBase64(file);
        return {
          nombreArchivo: file.name,
          archivoB64,
        };
      });
      const base64Files = await Promise.all(fileObjectsPromises);
      setBase64Files(base64Files);
    } catch (error) {
      console.error("Error al convertir archivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleValidar = async () => {
    const config = getConfig();
    const data = {
      idSucursal: sucursalSeleccionada,
      archivosXMLB64: base64Files,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/ValidarFactura`,
        data,
        config
      );

      // Verificar el código de estado
      if (response.status !== 200) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // En axios, la respuesta está en response.data
      setVerificacionData(response.data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    } finally {
      setValidados(true);
      setLoading(false);
    }
  };

  const handleCrear = async () => {
    setLoading(true);
    const config = getConfig();
    const data = verificacionDataConOC ?? VerificacionData;
    setLoading(true);
    try {
      const response = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasIngresos/CreateFactura`,
        data,
        config
      );

      // Verificar el código de estado
      if (response.status !== 200) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      // En axios, la respuesta está en response.data
      console.log(response.data);
      showSnackbar(`${response.data}`, "success");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    } finally {
      setLoading(false);

      handleOnCloseCrear();
      setContador(contador + 1);
    }
  };

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const config = getConfig();
        const response = await axios.get(
          `https://${URL}/WS/TuvanosaEmpleados/Api/Empleados/GetEmpresas`,
          config
        );
        setEmpresas(response.data); // Guardamos la lista de empresas
      } catch (error) {
        console.error("Error al obtener las empresas: ", error);
      }
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      const idEmpresa = empresaSeleccionada;

      try {
        const config = getConfig();
        const response = await axios.get(
          `https://${URL}/WS/TuvanosaEmpleados/Api/Empleados/GetSucursales?id_empresa=${idEmpresa}`,
          config
        );

        // Filtrar por idEmpresa
        const sucursalesFiltradas = response.data.filter(
          (sucursal) => sucursal.idEmpresa === parseInt(idEmpresa)
        );

        setSucursales(sucursalesFiltradas);

        setSucursales(sucursalesFiltradas);
      } catch (error) {
        console.error("Error al obtener las sucursales: ", error);
      }
    };

    fetchSucursales();
  }, [empresaSeleccionada, sucursalesJefes]);

  const handleSucursalChange = (event) => {
    const selectedValue = event.target.value;
    setSucursalSeleccionada(selectedValue);
  };

  const getUserDocumentLink =
    "https://firebasestorage.googleapis.com/v0/b/tvn-api-store.appspot.com/o/documentos%2FManuales%20intranet%2FManualFacturasIngresos.pdf?alt=media&token=79f64584-e627-4eb6-9e46-989ce75d6fcd";

  return (
    <Box>
      <CustomTable
        columns={columns}
        data={agencias}
        state={{ isLoading }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "60vh",
          },
        }}
        enableRowActions
        renderRowActions={({ row }) => {
          const actions = [
            {
              tooltipTitle:
                row.original.ordenCompra === 0 ? "Añadir OC" : "Editar OC",
              icon:
                row.original.ordenCompra === 0 ? (
                  <AddCircleOutlineIcon
                    style={{ color: "green", width: 25, height: 25 }}
                  />
                ) : (
                  <EditRoundedIcon
                    style={{ color: "#ff9100", width: 25, height: 25 }}
                  />
                ),
              onClick: () => {
                setOpenCambiarOC(true);
                setUuidOc(row.original.uuid);
                setTituloModalCE(
                  row.original.ordenCompra === 0
                    ? "Añadir orden de compra"
                    : "Editar orden de compra"
                );
                setSubTotal(row.original.subTotal);
              },
            },
            {
              tooltipTitle: "Eliminar OC",
              icon: (
                <CloseIcon style={{ color: "#f00", width: 25, height: 25 }} />
              ),
              onClick: () => {
                setOpenEliminarOC(true);
                setUuidOc(row.original.uuid);
              },
              condition: row.original.ordenCompra > 0,
            },
            {
              tooltipTitle: "Conceptos",
              icon: (
                <AccountTreeIcon
                  style={{ color: "#2196F3", width: 25, height: 25 }}
                />
              ),
              onClick: () =>
                handleOpenConceptos(row.original.facturaDto.Conceptos),
            },
            {
              tooltipTitle: "Visualizar PDF",
              icon: (
                <PictureAsPdfIcon
                  style={{ color: "#2196F3", width: 25, height: 25 }}
                />
              ),
              onClick: () => handleOpenPDF(row.original.uuid),
            },
            {
              tooltipTitle: "Descargar XML",
              icon: (
                <img
                  src="/images/XML icon.png"
                  alt="Icono de PDF"
                  style={{
                    width: "34px",
                    height: "20px",
                    filter:
                      "invert(27%) sepia(79%) saturate(3486%) hue-rotate(202deg) brightness(98%) contrast(92%)",
                  }}
                />
              ),
              onClick: () => handleOpenXML(row.original.uuid),
            },
          ];

          return (
            <CustomSpeedDial
              actions={actions}
              rowId={agencias.indexOf(row.original)}
              openRowId={openRowId}
              setOpenRowId={setOpenRowId}
            />
          );
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              style={{ width: "fit-content", color: "#262E66" }}
              startIcon={<InfoOutlinedIcon />}
              onClick={() => {
                window.open(getUserDocumentLink, "_blank");
              }}
            >
              {"AYUDA"}
            </Button>
            <Button
              color="primary"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddIcon />}
            >
              {isMobile ? "" : "Agregar"}
            </Button>
            {/* Usar el componente de exportación */}
            <ExportCsvButton
              rows={table.getPrePaginationRowModel().rows}
              columns={columns}
              csvConfig={csvConfig}
            />
          </Box>
        )}
      />

      {/*Crear Factura*/}
      <Dialog
        open={openDialog}
        maxWidth="md"
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
          Crear Factura
        </DialogTitle>

        <HighlightOffIcon
          sx={{
            position: "absolute",
            zIndex: 13,
            color: "white",
            right: 18,
            top: 18,
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.2)",
            },
          }}
          variant="contained"
          onClick={handleOnCloseCrear}
        />

        <DialogContent sx={{ mt: 2, px: 4 }}>
          {!VerificacionData && base64Files.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                {base64Files.length} XML seleccionado
                {base64Files.length !== 1 ? "s" : ""}
              </Typography>
              <List
                sx={{
                  bgcolor: "grey.100",
                  borderRadius: 2,
                  p: 2,
                  maxHeight: "240px",
                  overflowY: base64Files.length > 5 ? "auto" : "visible",
                }}
              >
                {base64Files.map((archivo, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <InsertDriveFile color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={archivo.nombreArchivo}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {!VerificacionData && (
            <>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="empresa-select-label">Empresa</InputLabel>
                <Select
                  labelId="empresa-select-label"
                  label="Empresa"
                  value={empresaSeleccionada || ""}
                  onChange={(event) =>
                    setEmpresaSeleccionada(event.target.value)
                  }
                >
                  {empresas.map((empresa) => (
                    <MenuItem key={empresa.id} value={empresa.id}>
                      {empresa.claveSap} -{empresa.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="sucursal-select-label">Sucursal</InputLabel>
                <Select
                  labelId="sucursal-select-label"
                  label="Sucursal"
                  value={sucursalSeleccionada || ""}
                  onChange={handleSucursalChange}
                >
                  {sucursales.map((sucursal) => (
                    <MenuItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.claveSAP} - {sucursal.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {!VerificacionData && (
            <DragAndDropArea
              onFileSelect={(files) => handleFileUpload({ target: { files } })}
              loading={loading}
            />
          )}

          {loading && (
            <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff" }}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </DialogContent>
        {VerificacionData && (
          <Box sx={{ width: "96%", margin: "0 auto", mb: 3 }}>
            <TablaFacturaIngresos
              agencias={VerificacionData}
              setInvalidos={setInvalidos}
              setValidadaCount={setValidadaCount}
              total={total}
              setTotal={setTotal}
              setVerificacionDataConOC={setVerificacionDataConOC}
            />
          </Box>
        )}

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={
              loading ||
              base64Files.length === 0 ||
              (validados && validadaCount <= 0)
            }
            onClick={validados ? handleCrear : handleValidar}
            sx={{
              fontWeight: "bold",
              px: 2,

              borderRadius: 2,
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            {validados ? "Subir validos" : "Validar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF DIALOG */}
      {PDF && (
        <PreviewDialog
          previewData={PDF}
          transitionTimeout={400}
          open={openPDF}
          onClose={() => {
            setOpenPDF(false);
            setPDF("");
          }}
        />
      )}

      {/*Conceptos*/}
      <CustomDialog
        title={"Conceptos"}
        transitionTimeout={400}
        open={conceptosDialogOpen}
        onPdfPreview={true}
        paddingContent={0}
        onClose={() => setConceptosDialogOpen(false)}
        width="md"
        fullWidth
      >
        <ConceptosIngresos conceptos={conceptos} />
      </CustomDialog>
      <DialogoCambiarOC
        open={openCambiarOC}
        setOpenCambiarOC={setOpenCambiarOC}
        uuid={uuidOc}
        setContador={setContador}
        contador={contador}
        tituloModalCE={tituloModalCE}
        subTotal={subTotal}
      ></DialogoCambiarOC>
      <DialogoEliminarOC
        open={openEliminarOC}
        setOpenEliminarOC={setOpenEliminarOC}
        handleEliminarOC={handleEliminarOC}
      ></DialogoEliminarOC>
    </Box>
  );
}

export default Ingresos;

import { useEffect, useState } from "react";
import { useSnackbar } from "@/Context/SnackbarContext";
import CustomTable from "@/Components/Custom/CustomTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SourceIcon from "@mui/icons-material/Source";
import AddIcon from "@mui/icons-material/Add";
import { mkConfig } from "export-to-csv";
import IconButtonWithTooltip from "@/Components/Custom/IconButtonWithTooltip";
import { tableCellPropsCenter } from "@/Components/Custom/CustomBoxStyles";
import ExportCsvButton from "@/Components/Custom/ExportCsvButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  CircularProgress,
  DialogTitle,
  Backdrop,
  ListItemText,
  ListItemIcon,
  ListItem,
  Typography,
  List,
  TextField,
} from "@mui/material";
//import { useAuth } from "@/Context/AuthContext";
import ConceptosIngresos from "../Ingreso/ConceptosIngresos";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewDialog from "@/Components/Custom/PreviewDialog";
import CustomDialog from "@/Components/Custom/CustomDialog";
import { Form } from "react-hook-form";
import AddressDialog from "./AddressDialog";

const URL = import.meta.env.VITE_API_URL;

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Complementos de facturas",
});

function ComplementosFacturas() {
  const [total, setTotal] = useState(0);
  const [contador, setContador] = useState(1);
  const [invalidos, setInvalidos] = useState(false);
  const [validadaCount, setValidadaCount] = useState("");
  const [VerificacionData, setVerificacionData] = useState(null);
  const [verificacionDataConOC, setVerificacionDataConOC] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [isMobile] = useState(window.innerWidth <= 600);
 // const [agencias, setAgencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conceptosDialogOpen, setConceptosDialogOpen] = useState(false);
  const [PDF, setPDF] = useState("");
  const [openPDF, setOpenPDF] = useState(false);
  const [base64Files, setBase64Files] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validados, setValidados] = useState(false);
  const [conceptos, setConceptos] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const [openAddressDialog, setOpenAddressDialog] = useState(false);
const [addressFormData, setAddressFormData] = useState(null);
const [isEditingAddress, setIsEditingAddress] = useState(false);

console.log(addressFormData)

  const navigate = useNavigate();
 // const { getConfig } = useAuth();

  console.log(invalidos);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const config = getConfig();
        const respuesta = await axios.get(
          `https://${URL}/WS/TuvanosaProveedores/Api/ComplementoPago/GetComplementosPagos?rol=5`,
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
  }, [contador, navigate]);

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
        `https://${URL}/WS/TuvanosaProveedores/Api/ComplementoPago/GetComplementoPagoPdfByUUID?uuid=${id}`,

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
        `https://${URL}/WS/TuvanosaProveedores/Api/ComplementoPago/GetComplementoPagoXmlByUUID?uuid=${id}`,
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
    if (status === false) return "#2196F3";
    return "#9e9e9e";
  };

  const columns = [
    {
      accessorKey: "isPrimary",
      header: "Principal",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const status = cell.getValue() ?? ""; // Protección para valores nulos
        return (
          <Box
            sx={{
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: "4px",
              border: `1px solid ${getBackgroundColor(status)}`,
              color: getBackgroundColor(status),
              fontWeight: "bold",
              width: "120px",
              p: "0.2rem",
            }}
          >
            {status === true ? "PRINCIPAL" : "ADICIONAL"}
          </Box>
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID DIRECCION",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
    },
    {
      accessorKey: "addressType",
      header: "TIPO DIRECCIÓN",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "zipCode",
      header: "CODIGO POSTAL",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "state",
      header: "Estado",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "city",
      header: "CIUDAD",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "colony",
      header: "COLONIA",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "street",
      header: "CALLE",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "number",
      header: "NO. EXTERIOR",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "interior",
      header: "NO. INTERIOR",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "reference",
      header: "REFERENCIAS",
      Cell: ({ cell }) => cell.getValue() ?? "", // Protección contra valores nulos
      ...tableCellPropsCenter,
    },
  ];

  const agencias = [
    {
      "id": "addr-001",
      "street": "Paseo de la Reforma",
      "number": "222",
      "interior": "5B",
      "colony": "Juárez",
      "city": "Ciudad de México",
      "state": "Ciudad de México",
      "zipCode": "06600",
      "addressType": "fiscal",
      "isPrimary": true,
      "reference": "Edificio gris con cristales, cerca del Ángel de la Independencia"
    },
    {
      "id": "addr-002",
      "street": "Av. Insurgentes Sur",
      "number": "1602",
      "interior": "",
      "colony": "Crédito Constructor",
      "city": "Ciudad de México",
      "state": "Ciudad de México",
      "zipCode": "03940",
      "addressType": "office",
      "isPrimary": false,
      "reference": "Frente a la estación de metrobús Ciudad de los Deportes"
    },
    {
      "id": "addr-003",
      "street": "Calzada de Tlalpan",
      "number": "1924",
      "interior": "Local 3",
      "colony": "Country Club",
      "city": "Ciudad de México",
      "state": "Ciudad de México",
      "zipCode": "04220",
      "addressType": "delivery",
      "isPrimary": false,
      "reference": "Entre Avenida San Fernando y calle Ayuntamiento"
    },
    {
      "id": "addr-004",
      "street": "Boulevard Manuel Ávila Camacho",
      "number": "5",
      "interior": "Piso 9",
      "colony": "Lomas de Chapultepec",
      "city": "Ciudad de México",
      "state": "Ciudad de México",
      "zipCode": "11000",
      "addressType": "billing",
      "isPrimary": false,
      "reference": "Torre Polanco, frente al Parque de Chapultepec"
    },
    {
      "id": "addr-005",
      "street": "Av. Universidad",
      "number": "1200",
      "interior": "",
      "colony": "Del Valle",
      "city": "Ciudad de México",
      "state": "Ciudad de México",
      "zipCode": "03100",
      "addressType": "delivery",
      "isPrimary": false,
      "reference": "Cerca del Centro Comercial Coyoacán"
    }
  ]

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const xmlFiles = files.filter((file) =>
      file.name.endsWith(".xml" || ".XML")
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
      archivosXMLB64: base64Files,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `https://${URL}/WS/TuvanosaProveedores/Api/ComplementoPago/ValidateComplementoPago`,
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

  const handleSubmitModalPass = async (event) => {
    event.preventDefault();
    setErrorModal("");

    const URL = import.meta.env.VITE_API_URL;

    try {
      await axios.post(
        `https://${URL}/WS/TuvanosaSeguridad/Api/AuthProveedor/ForgetPassword`,
        {
          correo: correoModal,
        }
      );

      setOpenModal(false);
      setOpenSnack(true);
      setCorreoModal("");
    } catch (error) {
      if (error.response) {
        setErrorModal(`${error.response.data}`);
        setOpenSnackError(true);
      } else {
        setErrorModal("Error al realizar la solicitud (500)");
        setOpenSnackError(true);
      }
    }
  };

  const handleOpenAddressDialog = (address = null) => {
    if (address) {
      setAddressFormData(address);
      setIsEditingAddress(true);
    } else {
      setAddressFormData(null);
      setIsEditingAddress(false);
    }
    setOpenAddressDialog(true);
  };
  
  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    setAddressFormData(null);
    setIsEditingAddress(false);
  };
  
  const handleSubmitAddress = async (data) => {
    const URL = import.meta.env.VITE_API_URL;
    const config = getConfig();
    
    try {
      let response;
      if (isEditingAddress) {
        // Update existing address
        response = await axios.put(
          `https://${URL}/WS/TuvanosaProveedores/Api/Direcciones/UpdateDireccion`,
          {
            ...data,
            id: addressFormData.id // Include the ID for updates
          },
          config
        );
        showSnackbar("Dirección actualizada correctamente", "success");
      } else {
        // Create new address
        response = await axios.post(
          `https://${URL}/WS/TuvanosaProveedores/Api/Direcciones/CreateDireccion`,
          data,
          config
        );
        showSnackbar("Dirección creada correctamente", "success");
      }
      
      // Refresh data or update state as needed
      // You might want to refresh your data here
      // setContador(contador + 1);  // If you have this pattern to refresh data
      
      return response.data;
    } catch (error) {
      if (error.response) {
        showSnackbar(`Error: ${error.response.data}`, "error");
      } else {
        showSnackbar("Error al procesar la solicitud", "error");
      }
      throw error;
    }
  };

  const getUserDocumentLink =
    "https://firebasestorage.googleapis.com/v0/b/tvn-api-store.appspot.com/o/documentos%2FManuales%20intranet%2FManualFacturasComplementos.pdf?alt=media&token=597fca21-3622-4131-9b61-3d9352dc6ae1";

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
          return (
            <Box
              sx={{
                width: "auto",
                position: "relative",
              }}
            >
              <>
              {/*
               <IconButtonWithTooltip
 //                 tooltipTitle="Visualizar facturas del complemento"
 //                 iconColor="#2196F3"
 //                 IconComponent={<SourceIcon />}
 //                 onIconClick={() => handleOpenConceptos(row.original.id)}
 //               />
 */}

                <IconButtonWithTooltip
                  tooltipTitle="Visualizar PDF"
                  iconColor="#2196F3"
                  IconComponent={<PictureAsPdfIcon />}
                  onIconClick={() => handleOpenPDF(row.original.uuid)}
                />

                <IconButtonWithTooltip
                  sx
                  tooltipTitle="Descargar XML"
                  iconColor="#2196F3"
                  IconComponent={
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
                  }
                  onIconClick={() => handleOpenXML(row.original.uuid)}
                />
              </>
            </Box>
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
              onClick={() => handleOpenAddressDialog()}
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

      <AddressDialog
  open={openAddressDialog}
  onClose={handleCloseAddressDialog}
  onSubmit={handleSubmitAddress}
  initialValues={addressFormData}
  isEditing={isEditingAddress}
  title={isEditingAddress ? "Editar Dirección" : "Registro de Dirección"}
/>

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
    </Box>
  );
}

export default ComplementosFacturas;

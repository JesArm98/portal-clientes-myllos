import { useEffect, useState } from "react";
import { useSnackbar } from "@/Context/SnackbarContext";
import CustomTable from "@/Components/Custom/CustomTable";
import axios from "axios";
import { mkConfig } from "export-to-csv";
import IconButtonWithTooltip from "@/Components/Custom/IconButtonWithTooltip";
import { tableCellPropsCenter } from "@/Components/Custom/CustomBoxStyles";
import ExportCsvButton from "@/Components/Custom/ExportCsvButton";
import { Box, Button } from "@mui/material";
//import { useAuth } from "@/Context/AuthContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewDialog from "@/Components/Custom/PreviewDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_API_URL;

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Factura Egresos",
});

function Egresos() {
  const { showSnackbar } = useSnackbar();
  const [agencias, setAgencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xmlDownload, setXmlDownload] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(false);
  const [PDF, setPDF] = useState("");
  const [openPDF, setOpenPDF] = useState(false);
  const navigate = useNavigate();
  //const { getConfig } = useAuth();

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const config = getConfig();

        const respuesta = await axios.get(
          `https://${URL}/WS/TuvanosaProveedores/Api/FacturasEgresos/GetFacturas?rol=5`,
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
  }, []);

  const handleOpenPDF = async (id) => {
    setPdfPreview(true);
    try {
      const config = getConfig();

      const respuesta = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasEgresos/GetFacturaPdfByUUID?uuid=${id}`,

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
      showSnackbar(`${error.response.data}`, "error");
    } finally {
      setOpenPDF(true);
      // Add a 3-second delay before setting xmlDownload to false
      setTimeout(() => {
        setPdfPreview(false);
      }, 1000); // 3000ms = 3 seconds
    }
  };

  const handleOpenXML = async (id) => {
    setXmlDownload(true);
    try {
      const config = getConfig();
      // Ensure the response is received as text
      const respuesta = await axios.get(
        `https://${URL}/WS/TuvanosaProveedores/Api/FacturasEgresos/GetFacturaXmlByUUID?uuid=${id}`,
        { ...config, responseType: "text" }
      );

      if (respuesta.status === 200) {
        // Create a Blob from the XML data
        const blob = new Blob([respuesta.data], { type: "application/xml" });
        // Generate a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = url;
        // Set the filename for the downloaded file
        link.setAttribute("download", `factura_${id}.xml`);
        // Append the link to the document body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Clean up by removing the link and revoking the object URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showSnackbar(`Descargado XML de la factura ${id}`, "success");
      }
    } catch (error) {
      showSnackbar("Error downloading the XML file", "error");
    } finally {
      // Add a 3-second delay before setting xmlDownload to false
      setTimeout(() => {
        setXmlDownload(false);
      }, 1000); // 3000ms = 3 seconds
    }
  };

  // Editar color Activo/Inactivo
  const getBackgroundColor = (status) => {
    if (status === "Cargada en SAP") return "#2e7d32";
    if (status === "0") return "#d32f2f";
    if (status === true) return "#2e7d32";
    if (status === false) return "#d32f2f";
    return "#0288d1";
  };

  const columns = [
    //ESTATUS
    {
      accessorKey: "descrEstatusSap",
      header: "ESTATUS",
      ...tableCellPropsCenter, // Reutiliza las props de alineación centrada
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
              p: "0.2rem",
            })}
          >
            {status?.toUpperCase()}
          </Box>
        );
      },
    },
    //ID
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   ...tableCellPropsCenter,
    // },
    {
      accessorKey: "estatusSat",
      header: "ESTATUS SAT",
      ...tableCellPropsCenter, // Reutiliza las props de alineación centrada
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
    {
      accessorKey: "docContable",
      header: "Doc Contable",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "facturaDto.CfdiRelacionados.0.CfdiRelacionado.0.UUID", //Se hace asi por que no es posible usar[] en el accessorKey
      header: "Doc Relacionado",
      ...tableCellPropsCenter,
    },

    {
      accessorKey: "facturaDto.Version",
      header: "Versión",
      ...tableCellPropsCenter,
    },
    {
      accessorKey: "uuid",
      header: "UUID",
      ...tableCellPropsCenter, // Reutiliza las props de alineación centrada
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
        return value === "E" ? "Egreso" : value;
      },
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
      accessorKey: "fechaModificacion",
      header: "Fecha carga",
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
      id: "TasaOCuota",
      header: "Tasa o Cuota",
      ...tableCellPropsCenter,
      accessorFn: (row) => {
        const traslados = row.facturaDto.Impuestos.Traslados;
        if (traslados && traslados.length > 0) {
          return `${traslados[0].TasaOCuota}% `;
        } else {
          return "";
        }
      },
    },
    {
      accessorKey: "facturaDto.Impuestos.TotalImpuestosTrasladados",
      header: "Impuestos traslados",
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
      accessorKey: "facturaDto.Impuestos.TotalImpuestosRetenidos",
      header: "Impuestos retenidos",
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
  ];

  const getUserDocumentLink =
    "https://firebasestorage.googleapis.com/v0/b/tvn-api-store.appspot.com/o/documentos%2FManuales%20intranet%2FManualFacturasEgresos.pdf?alt=media&token=2b93a2c8-f54d-4e38-9835-71b3e14f4fc1";

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
                <IconButtonWithTooltip
                  tooltipTitle="Visualizar PDF"
                  iconColor="#2196F3"
                  disabled={pdfPreview === true}
                  IconComponent={<PictureAsPdfIcon />}
                  onIconClick={() => handleOpenPDF(row.original.uuid)}
                />

                <IconButtonWithTooltip
                  sx
                  tooltipTitle="Descargar XML"
                  iconColor="#2196F3"
                  disabled={xmlDownload === true}
                  IconComponent={
                    <img
                      src="/images/XML icon.png"
                      alt="Icono de PDF"
                      style={{ width: "34px", height: "20px" }}
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
            {/* Usar el componente de exportación */}
            <ExportCsvButton
              rows={table.getPrePaginationRowModel().rows}
              columns={columns}
              csvConfig={csvConfig}
            />
          </Box>
        )}
      />

      {/* PDF DIALOG */}
      {PDF ? (
        <PreviewDialog
          previewData={PDF}
          transitionTimeout={400}
          open={openPDF}
          onClose={() => {
            setOpenPDF(false);
            setPDF("");
          }}
        />
      ) : null}
    </Box>
  );
}

export default Egresos;

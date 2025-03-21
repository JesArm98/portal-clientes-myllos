import { useEffect, useState } from "react";
import { useSnackbar } from "@/contexts/SnackbarContext";
import CustomTable from "@/components/CustomTable";
//import { useAuth } from "@/contexts/AuthContext";
import IconButtonWithTooltip from "@/components/IconButtonWithTooltip";
import { tableCellPropsCenter } from "@/components/CustomBoxStyles";
import { Box } from "@mui/material";
import axios from "axios";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PreviewDialog from "@/components/PreviewDialog";

const URL = import.meta.env.VITE_API_URL;

function ConceptosIngresos({ conceptos }) {
  const [openPDF, setOpenPDF] = useState(false);
  const [agencias, setAgencias] = useState([]);
  const [agencias2, setAgencias2] = useState([]);
  const [PDF, setPDF] = useState("");
  const { showSnackbar } = useSnackbar();
  //const { getConfig } = useAuth();

  const handleOpenXML = async (id) => {
    try {
      const config = getConfig();
      const respuesta = await axios.get(
        `https://${URL}.tuvanosa.net/WS/TuvanosaProveedores/Api/FacturasSap/GetFacturaXmlByUUID?uuid=${id}`,
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

  const handleOpenPDF = async (id) => {
    try {
      const config = getConfig();

      const respuesta = await axios.get(
        `https://${URL}.tuvanosa.net/WS/TuvanosaProveedores/Api/FacturasSap/GetFacturaPdfByUUID?uuid=${id}`,

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

  const getBackgroundColor = (status) => {
    if (status === true || status === "Cargada") return "#2e7d32";
    if (status === false) return "#d32f2f";
    return "#9e9e9e";
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const config = getConfig();

        const respuesta = await axios.get(
          `https://${URL}/WS/TuvanosaProveedores/Api/ComplementoPago/GetFacturasDelComplementoPagoById?id=${conceptos}`,
          config
        );

        setAgencias(respuesta.data.facturasIngresos);
        setAgencias2(respuesta.data.facturasGastos);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        console.log("Datos obtenidos");
      }
    };

    obtenerDatos();
  }, []);

  const columns = [
    // ID
    {
      accessorKey: "id",
      header: "ID",
      ...tableCellPropsCenter,
    },

    // ESTATUS
    {
      accessorKey: "estatusSat",
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
              width: "120px",
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
      accessorKey: "facturaDto.Version",
      header: "Versión",
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
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={agencias}
        muiTableContainerProps={{
          sx: {
            maxHeight: "60vh",
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              gap: 2,
            }}
          >
            <h3 style={{ paddingLeft: 16, color: "#388e3c" }}>Ingresos</h3>
          </Box>
        )}
      />
      <CustomTable
        columns={columns}
        data={agencias2}
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
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              width: "fit-content",
              display: "flex",
              gap: 2,
            }}
          >
            <h3 style={{ paddingLeft: 16, color: "#d32f2f" }}>Gastos</h3>
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
    </>
  );
}

export default ConceptosIngresos;

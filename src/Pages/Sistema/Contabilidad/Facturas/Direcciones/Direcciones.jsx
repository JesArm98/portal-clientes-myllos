import { useEffect, useState } from "react";
import { useSnackbar } from "@/Context/SnackbarContext";
import CustomTable from "@/Components/Custom/CustomTable";
import axios from "axios";
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
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewDialog from "@/Components/Custom/PreviewDialog";
import AddressDialog from "./AddressDialog";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Complementos de facturas",
});

function Direcciones() {
  const { showSnackbar } = useSnackbar();
  const [isMobile] = useState(window.innerWidth <= 600);
  const [isLoading, setIsLoading] = useState(false);
  const [PDF, setPDF] = useState("");
  const [openPDF, setOpenPDF] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressFormData, setAddressFormData] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [testCounter, setTestCounter] = useState(1); // Counter for test addresses

  // Estado para el diálogo de confirmación de eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Store the addresses in state instead of a constant
  const [addresses, setAddresses] = useState([
    {
      id: "addr-001",
      calle: "Paseo de la Reforma",
      numeroExterior: "222",
      numeroInterior: "5B",
      colonia: "Juárez",
      ciudad: "Ciudad de México",
      estado: "Ciudad de México",
      cp: "06600",
      addressType: "fiscal",
      isPrimary: true,
      referencia:
        "Edificio gris con cristales, cerca del Ángel de la Independencia",
    },
    {
      id: "addr-002",
      calle: "Av. Insurgentes Sur",
      numeroExterior: "1602",
      numeroInterior: "",
      colonia: "Crédito Constructor",
      ciudad: "Ciudad de México",
      estado: "Ciudad de México",
      cp: "03940",
      addressType: "office",
      isPrimary: false,
      referencia: "Frente a la estación de metrobús Ciudad de los Deportes",
    },
    {
      id: "addr-003",
      calle: "Calzada de Tlalpan",
      numeroExterior: "1924",
      numeroInterior: "Local 3",
      colonia: "Country Club",
      ciudad: "Ciudad de México",
      estado: "Ciudad de México",
      cp: "04220",
      addressType: "delivery",
      isPrimary: false,
      referencia: "Entre Avenida San Fernando y calle Ayuntamiento",
    },
    {
      id: "addr-004",
      calle: "Boulevard Manuel Ávila Camacho",
      numeroExterior: "5",
      numeroInterior: "Piso 9",
      colonia: "Lomas de Chapultepec",
      ciudad: "Ciudad de México",
      estado: "Ciudad de México",
      cp: "11000",
      addressType: "billing",
      isPrimary: false,
      referencia: "Torre Polanco, frente al Parque de Chapultepec",
    },
    {
      id: "addr-005",
      calle: "Av. Universidad",
      numeroExterior: "1200",
      numeroInterior: "",
      colonia: "Del Valle",
      ciudad: "Ciudad de México",
      estado: "Ciudad de México",
      cp: "03100",
      addressType: "delivery",
      isPrimary: false,
      referencia: "Cerca del Centro Comercial Coyoacán",
    },
  ]);

  const getBackgroundColor = (status) => {
    if (status === true || status === "Cargada") return "#2e7d32";
    if (status === false) return "#2196F3";
    return "#9e9e9e";
  };

  // Helper function to safely extract nested properties
  const extractNestedProperty = (obj, property) => {
    // Check if the object has the property as a nested object
    if (
      obj &&
      typeof obj === "object" &&
      obj[property] &&
      typeof obj[property] === "object"
    ) {
      // If it's a nested object with the same name property, return that value
      if (obj[property][property] !== undefined) {
        return obj[property][property];
      }
      // Otherwise return some default identifier property like 'name' or 'id'
      return (
        obj[property].name || obj[property].id || JSON.stringify(obj[property])
      );
    }
    // If it's a simple value, return it directly
    return obj && obj[property] !== undefined ? obj[property] : "";
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
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
    {
      accessorKey: "addressType",
      header: "TIPO DIRECCIÓN",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
    {
      accessorKey: "cp",
      header: "CODIGO POSTAL",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        // Handle case where cp might be an object with a cp property
        return typeof value === "object" && value !== null
          ? String(value.cp || "")
          : value !== null && value !== undefined
            ? String(value)
            : "";
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        // Handle case where estado might be an object
        return typeof value === "object" && value !== null
          ? String(value.nombre || value.estado || "")
          : value !== null && value !== undefined
            ? String(value)
            : "";
      },
    },
    {
      accessorKey: "ciudad",
      header: "CIUDAD",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        // Handle case where ciudad might be an object
        return typeof value === "object" && value !== null
          ? String(value.nombre || value.ciudad || "")
          : value !== null && value !== undefined
            ? String(value)
            : "";
      },
    },
    {
      accessorKey: "colonia",
      header: "COLONIA",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        // Handle case where colonia might be an object
        return typeof value === "object" && value !== null
          ? String(value.nombre || value.colonia || "")
          : value !== null && value !== undefined
            ? String(value)
            : "";
      },
    },
    {
      accessorKey: "calle",
      header: "CALLE",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
    {
      accessorKey: "numeroExterior",
      header: "NO. EXTERIOR",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
    {
      accessorKey: "numeroInterior",
      header: "NO. INTERIOR",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
    {
      accessorKey: "referencia",
      header: "REFERENCIAS",
      ...tableCellPropsCenter,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return value !== null && value !== undefined ? String(value) : "";
      },
    },
  ];

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

  // Función para manejar el clic en eliminar dirección
  const handleDeleteClick = (address) => {
    // Verificar si es dirección principal
    if (address.isPrimary) {
      showSnackbar("No se puede eliminar la dirección principal", "error");
      return;
    }

    // Abrir diálogo de confirmación
    setAddressToDelete(address);
    setDeleteConfirmOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = () => {
    if (addressToDelete) {
      // Filtrar las direcciones para eliminar la seleccionada
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressToDelete.id
      );
      setAddresses(updatedAddresses);
      showSnackbar("Dirección eliminada correctamente", "success");
    }

    // Cerrar diálogo y limpiar estado
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  };

  const handleSubmitAddress = async (data) => {
    try {
      // Process data before submitting to handle nested objects
      const processedData = {
        ...data,
        // Extract nested properties if they exist
        cp:
          typeof data.cp === "object" && data.cp !== null
            ? data.cp.cp
            : data.cp,
        estado:
          typeof data.cp === "object" && data.cp !== null
            ? data.cp.nombre || data.cp.estado
            : data.cp,
        ciudad:
          typeof data.cp === "object" && data.cp !== null
            ? data.cp.nombre || data.cp.ciudad
            : data.cp,
        colonia:
          typeof data.cp === "object" && data.cp !== null
            ? data.cp.nombre || data.cp.colonia
            : data.cp,
      };

      if (isEditingAddress) {
        // Update existing address
        const updatedAddresses = addresses.map((addr) =>
          addr.id === addressFormData.id
            ? { ...processedData, id: addressFormData.id }
            : addr
        );
        setAddresses(updatedAddresses);
        showSnackbar("Dirección actualizada correctamente", "success");
      } else {
        // Create new address with fixed values for testing
        const newAddress = {
          ...processedData,
          id: `addr-prueba-${testCounter}`,
          addressType: "prueba",
          isPrimary: false,
        };

        // Add the new address to the addresses array
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);

        // Increment the test counter for the next address
        setTestCounter((prevCounter) => prevCounter + 1);
        showSnackbar("Dirección creada correctamente", "success");
      }

      return true; // Indicate success
    } catch (error) {
      showSnackbar("Error al procesar la solicitud", "error");
      throw error;
    }
  };

  const getUserDocumentLink =
    "https://firebasestorage.googleapis.com/v0/b/tvn-api-store.appspot.com/o/documentos%2FManuales%20intranet%2FManualFacturasComplementos.pdf?alt=media&token=597fca21-3622-4131-9b61-3d9352dc6ae1";

  return (
    <Box>
      <CustomTable
        columns={columns}
        data={addresses} // Use the addresses state here
        state={{ isLoading }}
        muiTableContainerProps={{
          sx: {
            maxHeight: "60vh",
          },
        }}
        enableRowActions
        renderRowActions={({ row }) => {
          const address = row.original;
          return (
            <Box
              sx={{
                width: "auto",
                position: "relative",
                display: "flex",
              }}
            >
              <>
                <IconButtonWithTooltip
                  tooltipTitle="Visualizar PDF"
                  iconColor="#2196F3"
                  IconComponent={<PictureAsPdfIcon />}
                  onIconClick={() => alert("Visualizar PDF")}
                />

                <IconButtonWithTooltip
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
                  onIconClick={() => alert("Descargar XML")}
                />
                {row.original.isPrimary === false && (
                  <IconButtonWithTooltip
                    tooltipTitle="Eliminar dirección"
                    iconColor={address.isPrimary ? "#9e9e9e" : "#f44336"}
                    IconComponent={<DeleteIcon />}
                    onIconClick={() => handleDeleteClick(address)}
                    disabled={address.isPrimary}
                  />
                )}
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

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta dirección?
            {addressToDelete && (
              <Box
                component="span"
                sx={{ display: "block", mt: 1, fontWeight: "bold" }}
              >
                {addressToDelete.calle} {addressToDelete.numeroExterior}
                {addressToDelete.numeroInterior
                  ? `, Int. ${addressToDelete.numeroInterior}`
                  : ""}
                ,{addressToDelete.colonia}, {addressToDelete.ciudad}
              </Box>
            )}
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Direcciones;

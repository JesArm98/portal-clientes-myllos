import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";

// Validation schema using yup
const addressSchema = yup.object({
  calle: yup.string().required("La calle es requerida"),
  numeroExterior: yup.string().required("El número es requerido"),
  colonia: yup.string().required("La colonia es requerida"),
  ciudad: yup.string().required("La ciudad es requerida"),
  estado: yup.string().required("El estado es requerido"),
  cp: yup
    .string()
    .required("El código postal es requerido")
    .matches(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
});

const AddressForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  // Estado para almacenar las colonias disponibles según el CP
  const [colonies, setColonies] = useState([]);
  // Estado para manejar la carga de datos
  const [loading, setLoading] = useState(false);
  // Estado para manejar errores de API
  const [apiError, setApiError] = useState(null);
  // Estado para almacenar los datos completos de la colonia seleccionada
  const [selectedColonyData, setSelectedColonyData] = useState(null);
  // Estado para almacenar los datos completos de la API
  const [apiData, setApiData] = useState([]);

  // Ensure initialValues is not null or undefined
  const safeInitialValues = initialValues || {};
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid},
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      calle: safeInitialValues.calle || "",
      numeroExterior: safeInitialValues.numeroExterior || "",
      numeroInterior: safeInitialValues.numeroInterior || "",
      colonia: safeInitialValues.colonia || "",
      ciudad: safeInitialValues.ciudad || "",
      estado: safeInitialValues.estado || "",
      cp: safeInitialValues.cp || "",
      referencia: safeInitialValues.referencia || "",
      pais: safeInitialValues.pais || "",
    },
    mode: "onChange", // Esto es importante para que isValid se actualice en tiempo real
  });

  // Observar cambios en el código postal
  const cp = watch("cp");
  // Observar cambios en la colonia seleccionada
  const selectedColony = watch("colonia");

  // Efecto para obtener datos cuando cambia el código postal
  useEffect(() => {
    const fetchDataByZipCode = async (value) => {
      if (value && value.length === 5) {
        setLoading(true);
        setApiError(null);
        
        try {
          const response = await axios.get(`https://api.pktuno.mx/Api/Cobertura/${value}`);
          
          // Verificar si la respuesta contiene datos
          if (response.data) {
            console.log("API Response:", response.data);
            
            // Si es un array, procesamos las colonias
            if (Array.isArray(response.data) && response.data.length > 0) {
              // Guardar los datos completos de la API
              setApiData(response.data);
              
              // Extraer solo los nombres de las colonias para el Autocomplete
              const coloniasList = response.data.map(item => item.colonia).filter(Boolean);
              setColonies(coloniasList);
              
              // Autocompletar ciudad, estado y país con los datos del primer elemento
              // (todos deberían tener los mismos valores para estos campos)
              if (response.data[0]) {
                setValue("ciudad", response.data[0].ciudad || "");
                setValue("estado", response.data[0].estado || "");
                setValue("pais", response.data[0].pais || "");
              }
            } else if (response.data.colonia) {
              // Si es un objeto único con datos de colonia
              setApiData([response.data]);
              setColonies([response.data.colonia]);
              setValue("ciudad", response.data.ciudad || "");
              setValue("estado", response.data.estado || "");
              setValue("pais", response.data.pais || "");
            } else {
              setApiError("No se encontraron colonias en la respuesta");
              setColonies([]);
              setApiData([]);
            }
          } else {
            setApiError("No se encontraron datos para este código postal");
            setColonies([]);
            setApiData([]);
          }
        } catch (error) {
          console.error("Error fetching zip code data:", error);
          setApiError("Error al consultar el código postal. Inténtelo de nuevo o verifique que sea correcto.");
          setColonies([]);
          setApiData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setColonies([]);
        setApiData([]);
      }
    };

    fetchDataByZipCode(cp);
  }, [cp, setValue]);

  // Efecto para actualizar los datos cuando se selecciona una colonia
  useEffect(() => {
    if (selectedColony && apiData.length > 0) {
      // Buscar los datos completos de la colonia seleccionada
      const colonyData = apiData.find(item => item.colonia === selectedColony);
      if (colonyData) {
        setSelectedColonyData(colonyData);
        // Actualizar ciudad, estado y país basados en la colonia seleccionada
        setValue("ciudad", colonyData.ciudad || "");
        setValue("estado", colonyData.estado || "");
        setValue("pais", colonyData.pais || "");
      }
    }
  }, [selectedColony, apiData, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  const inputStyles = {
    borderRadius: "20px", // Bordes redondeados
    backgroundColor: "#fff", // Fondo blanco para mejor visibilidad
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px", // Aplica a todo el input
      fontSize: "16px",
      fontWeight: 500,
      "& fieldset": {
        borderColor: "#BDBDBD", // Color de borde en estado normal
      },
      "&:hover fieldset": {
        borderColor: "#1976d2", // Color de borde en hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2", // Color de borde cuando está enfocado
        boxShadow: "0px 0px 6px rgba(25, 118, 210, 0.3)", // Sombra al enfocar
      },
    },

  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
      {apiError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {/* Zip Code - First field to enable auto-completion */}
        <Grid item xs={12} md={6}>
          <Controller
            name="cp"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código Postal"
                fullWidth
                required
                error={!!errors.cp}
                helperText={errors.cp?.message}
                sx={inputStyles}
                InputProps={{
                  endAdornment: loading ? <CircularProgress color="inherit" size={20} /> : null,
                }}
              />
            )}
          />
        </Grid>

        {/* Colony - Autocomplete based on ZIP code */}
        <Grid item xs={12} md={6}>
          <Controller
            name="colonia"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={colonies}
                loading={loading}
                value={field.value || null}
                onChange={(_, newValue) => field.onChange(newValue)}
                disabled={colonies.length === 0}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Colonia"
                    sx={inputStyles}
                    required
                    error={!!errors.colonia}
                    helperText={errors.colonia?.message || (colonies.length === 0 && cp?.length === 5 ? "Ingrese un código postal válido primero" : "")}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Street */}
        <Grid item xs={12} md={6}>
          <Controller
            name="calle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Calle"
                sx={inputStyles}
                fullWidth
                error={!!errors.calle}
                helperText={errors.calle?.message}
              />
            )}
          />
        </Grid>

        {/* Number */}
        <Grid item xs={6} md={3}>
          <Controller
            name="numeroExterior"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                required
                label="Número Exterior"
                fullWidth
                error={!!errors.numeroExterior}
                helperText={errors.numeroExterior?.message}
              />
            )}
          />
        </Grid>

        {/* Interior Number (optional) */}
        <Grid item xs={6} md={3}>
          <Controller
            name="numeroInterior"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                label="Número Interior"
                fullWidth
                helperText="Opcional"
              />
            )}
          />
        </Grid>

        {/* City - Auto-filled from API */}
        <Grid item xs={12} md={4}>
          <Controller
            name="ciudad"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                label="Ciudad"
                required
                fullWidth
                error={!!errors.ciudad}
                helperText={errors.ciudad?.message}
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            )}
          />
        </Grid>

        {/* State - Auto-filled from API */}
        <Grid item xs={12} md={4}>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                label="Estado"
                fullWidth
                required
                disabled
                error={!!errors.estado}
                helperText={errors.estado?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
        </Grid>

        {/* Country - Auto-filled from API */}
        <Grid item xs={12} md={4}>
          <Controller
            name="pais"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                label="País"
                fullWidth
                required
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
        </Grid>

        {/* Reference (optional) */}
        <Grid item xs={12}>
          <Controller
            name="referencia"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                sx={inputStyles}
                label="Referencias"
                fullWidth
                multiline
                rows={2}
                helperText="Añada referencias para facilitar la ubicación"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button
          onClick={() => reset()}
          color="error"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          sx={{border:"1px solid #3DC2CF", borderRadius:"20px", color:"#3DC2CF"}}
          disabled={!isValid}
        >
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;
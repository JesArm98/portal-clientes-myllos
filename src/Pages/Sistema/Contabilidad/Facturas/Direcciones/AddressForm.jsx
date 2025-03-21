import { useState, useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Box, Button, TextField, Grid, Autocomplete } from "@mui/material";
import StyledTextField from "@/Components/Custom/StyledTextField";

// Validation schema using yup
const addressSchema = yup.object({
  calle: yup
    .string()
    .required("La calle es requerida")
    .min(4, "La calle debe tener al menos 4 caracteres"),
  numeroExterior: yup.string().required("El número es requerido"),
  numeroInterior: yup.string().optional(),
  referencia: yup
    .string()
    .optional()
    .test(
      "min-length-if-present",
      "La referencia debe tener al menos 15 caracteres",
      (value) => !value || value.length >= 15
    ),
  cp: yup
    .object({
      cp: yup.string().optional(),
      colonia: yup.string().optional(),
      ciudad: yup.string().optional(),
      municipio: yup.string().optional(),
      estado: yup.string().optional(),
      pais: yup.string().optional(),
    })
    .test(
      "is-valid-origen",
      "Debe seleccionar una opción válida de la lista.",
      (value) => {
        return (
          typeof value === "object" &&
          value !== null &&
          value.cp &&
          value.colonia &&
          value.ciudad
        );
      }
    )
    .required("El CP de origen es obligatorio."),
});

const AddressForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  // Estado para manejar la carga de datos
  const [coloniasOrigen, setColoniasOrigen] = useState([]);

  // Función auxiliar para el estilo común de los inputs
  const getFieldSx = (isEmpty, hasError) => ({
    width: "100%",
    borderRadius: "8px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isEmpty ? "#07417B" : hasError ? "red" : "green",
        borderRadius: "15px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 4px 14px 0px",
      },
      "&:hover fieldset": {
        borderColor: isEmpty ? "blue" : hasError ? "red" : "blue",
      },
      "&.Mui-focused fieldset": {
        borderColor: isEmpty ? "gray" : hasError ? "red" : "green",
      },
    },
  });

  // Ensure initialValues is not null or undefined
  const safeInitialValues = initialValues || {};

  // Inside your component, add this
  const debounceTimer = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      calle: safeInitialValues.calle || "",
      numeroExterior: safeInitialValues.numeroExterior || "",
      numeroInterior: safeInitialValues.numeroInterior || "",
      cp: safeInitialValues.cp || {
        cp: "",
        colonia: "",
        ciudad: "",
        municipio: "",
        estado: "",
        pais: "",
      },
      referencia: safeInitialValues.referencia || "",
    },
    mode: "onChange", // Esto es importante para que isValid se actualice en tiempo real
  });

  // Agregar este watch para ver todos los valores del formulario
  const formValues = useWatch({ control });

  const handleAutocompleteChange = (field, value, onChange) => {
    // Update the input value immediately for responsiveness
    onChange(value || "");

    // Clear any existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only make API call if we have enough characters
    if (value && value.length >= 3) {
      // Debounce the API call to prevent too many requests
      debounceTimer.current = setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://web.pktuno.mx/PKT1/index.php/CatCodigosPostales/ajax_list_mexico_str/?pais=MX&query=${value}`
          );

          // Transformar la respuesta al formato deseado
          const colonias = response.data
            .map((item) => {
              try {
                const parts = item.data.split(" - ");

                if (parts.length < 2) return null;

                const cp = parts[0];
                const locationParts = parts[1].split(", ");
                const locationParts2 = parts[2].split(", ");

                return {
                  cp: cp,
                  colonia: locationParts[0] || "",
                  ciudad: locationParts2[0] || "",
                  municipio: locationParts[1] || "",
                  pais: locationParts2[1] || "",
                };
              } catch (e) {
                console.error("Error procesando item:", item);
                return null;
              }
            })
            .filter((item) => item !== null);

          if (field === "cp") {
            setColoniasOrigen(colonias);
          }
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      }, 300); // Wait 300ms after user stops typing
    } else {
      // Clear the options if input is too short
      if (field === "cp") {
        setColoniasOrigen([]);
      }
    }
  };

  //Origen
  useEffect(() => {
    const fetchOrigenData = async () => {
      if (!formValues?.cp.cp) return; // Validar que CP y colonia existan

      try {
        const response = await axios.get(
          `https://api.pktuno.mx/Api/Cobertura/${formValues.cp.cp}`
        );

        const data = response.data; // Suponiendo que devuelve un array de objetos con cp, colonia y ciudad

        if (Array.isArray(data) && data.length > 0) {
          // Buscar coincidencia exacta de CP y colonia
          const match = data.find(
            (item) =>
              item.cp === formValues.cp.cp &&
              item.colonia.toLowerCase() === formValues.cp.colonia.toLowerCase()
          );

          // Si encontramos una coincidencia, actualizamos el formulario
          if (match) {
            setValue("cp", match, { shouldValidate: true });
            // Si match tiene la propiedad estado, actualízala específicamente
            if (match.estado) {
              setValue("cp.estado", match.estado);
            }
          }
        }
      } catch (error) {
        console.error("Error al obtener la información del origen:", error);
      }
    };

    fetchOrigenData();
  }, [formValues.cp.cp]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    alert(JSON.stringify(data, null, 2));
    if (!isEditing) {
      reset();
    }
  };

  {
    console.log(formValues);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      {/* {apiError && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )} */}

      <Grid container spacing={2}>
        {/* Zip Code - First field to enable auto-completion */}
        <Grid item xs={12}>
          <Controller
            name="cp"
            control={control}
            defaultValue=""
            // Modifica esta parte en el componente Controller para el campo "cp"
            render={({ field: { onChange, value } }) => {
              const isValid = typeof value === "object" && value && value.cp;

              return (
                <Autocomplete
                  freeSolo
                  options={coloniasOrigen}
                  value={value}
                  fullWidth
                  onInputChange={(e, newValue) => {
                    if (/^[a-zA-Z0-9]+$/.test(newValue) || newValue === "") {
                      handleAutocompleteChange("cp", newValue, onChange);
                    }
                  }}
                  // Cuando seleccionas un CP en el Autocomplete
                  onChange={(e, newValue) => {
                    onChange(newValue); // Guarda el objeto completo
                    if (newValue) {
                      // Actualiza también los campos individuales
                      setValue("cp.cp", newValue.cp);
                      setValue("cp.colonia", newValue.colonia);
                      setValue("cp.ciudad", newValue.ciudad);
                      setValue("cp.municipio", newValue.municipio);
                      setValue("cp.estado", newValue.estado);
                      setValue("cp.pais", newValue.pais);
                    }
                  }}
                  getOptionLabel={(option) => {
                    // Check if option is null, undefined, or empty
                    if (!option) return "";
                    // Check if option is a string
                    if (typeof option === "string") return option;
                    // If it's an object, return a string representation
                    return option.cp
                      ? `${option.cp}, ${option.colonia || ""}, ${option.ciudad || ""}, ${option.pais || ""}`
                      : "";
                  }}
                  renderInput={(params) => {
                    const fieldIsEmpty = !value;
                    return (
                      <TextField
                        {...params}
                        label="Dirección*"
                        variant="outlined"
                        fullWidth
                        error={!!errors.cp}
                        helperText={
                          errors.cp
                            ? errors.cp.message
                            : isValid
                              ? "✔️"
                              : "Ingrese su Código Postal o Colonia"
                        }
                        sx={getFieldSx(fieldIsEmpty, !!errors.cp)}
                      />
                    );
                  }}
                />
              );
            }}
          />
        </Grid>
        {/* Street */}
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="calle"
            control={control}
            errors={errors}
            label="Calle"
            helperTextEmpty="La calle es requerida"
          />
        </Grid>

        {/* Number */}
        <Grid item xs={6} md={3}>
          <StyledTextField
            name="numeroExterior"
            control={control}
            errors={errors}
            label="Número Exterior"
            helperTextEmpty={"El número es requerido"}
          />
        </Grid>

        {/* Interior Number (optional) */}
        <Grid item xs={6} md={3}>
          <StyledTextField
            name="numeroInterior"
            control={control}
            errors={errors}
            label="Número Interior"
            helperTextEmpty={"Opcional"}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.cp"
            control={control}
            errors={errors}
            label="CP"
            helperTextEmpty={"Opcional"}
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.colonia"
            control={control}
            errors={errors}
            label="Colonia"
            helperTextEmpty={"Opcional"}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.ciudad"
            control={control}
            errors={errors}
            label="Ciudad"
            helperTextEmpty={"Opcional"}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.municipio"
            control={control}
            errors={errors}
            label="Municipio"
            helperTextEmpty={"Opcional"}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.estado"
            control={control}
            errors={errors}
            label="Estado"
            helperTextEmpty={"Opcional"}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <StyledTextField
            name="cp.pais"
            control={control}
            errors={errors}
            label="Pais"
            helperTextEmpty={"Opcional"}
          />
        </Grid>

        {/* Reference (optional) */}
        <Grid item xs={12}>
          <Controller
            name="referencia"
            control={control}
            render={({ field }) => {
              const fieldIsEmpty = !field.value;
              return (
                <TextField
                  {...field}
                  label="Referencias"
                  variant="outlined"
                  fullWidth
                  minRows={2}
                  error={!!errors.referencia}
                  helperText={
                    errors.referencia
                      ? errors.referencia.message
                      : field.value && field.value.length >= 15
                        ? "✔️"
                        : ""
                  }
                  sx={getFieldSx(fieldIsEmpty, !!errors.referencia)}
                />
              );
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button onClick={() => reset()} color="error">
          Cancelar
        </Button>
        <Button
          type="submit"
          sx={{
            border: "1px solid #3DC2CF",
            borderRadius: "20px",
            color: "#3DC2CF",
          }}
          disabled={!isValid}
        >
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;

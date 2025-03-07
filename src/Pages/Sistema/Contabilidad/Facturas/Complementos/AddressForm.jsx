import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

// Validation schema using yup
const addressSchema = yup.object({
  street: yup.string().required("La calle es requerida"),
  number: yup.string().required("El número es requerido"),
  colony: yup.string().required("La colonia es requerida"),
  city: yup.string().required("La ciudad es requerida"),
  state: yup.string().required("El estado es requerido"),
  zipCode: yup
    .string()
    .required("El código postal es requerido")
    .matches(/^\d{5}$/, "El código postal debe tener 5 dígitos"),
  addressType: yup.string().required("El tipo de dirección es requerido"),
  isPrimary: yup.boolean().default(false),
});

// List of Mexican states
const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Coahuila", "Colima", "Ciudad de México", "Durango", "Estado de México",
  "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
  "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

// Address types
const addressTypes = [
  { value: "fiscal", label: "Fiscal" },
  { value: "delivery", label: "Entrega" },
  { value: "billing", label: "Facturación" },
  { value: "office", label: "Oficina" },
];

const AddressForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  // Ensure initialValues is not null or undefined
  const safeInitialValues = initialValues || {};
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addressSchema),
    defaultValues: {
      street: safeInitialValues.street || "",
      number: safeInitialValues.number || "",
      interior: safeInitialValues.interior || "",
      colony: safeInitialValues.colony || "",
      city: safeInitialValues.city || "",
      state: safeInitialValues.state || "",
      zipCode: safeInitialValues.zipCode || "",
      addressType: safeInitialValues.addressType || "",
      isPrimary: safeInitialValues.isPrimary || false,
      reference: safeInitialValues.reference || "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? "Editar Dirección" : "Registrar Nueva Dirección"}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Street */}
        <Grid item xs={12} md={6}>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Calle"
                fullWidth
                error={!!errors.street}
                helperText={errors.street?.message}
              />
            )}
          />
        </Grid>

        {/* Number */}
        <Grid item xs={6} md={3}>
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número Exterior"
                fullWidth
                error={!!errors.number}
                helperText={errors.number?.message}
              />
            )}
          />
        </Grid>

        {/* Interior Number (optional) */}
        <Grid item xs={6} md={3}>
          <Controller
            name="interior"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número Interior"
                fullWidth
                helperText="Opcional"
              />
            )}
          />
        </Grid>

        {/* Colony */}
        <Grid item xs={12} md={6}>
          <Controller
            name="colony"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Colonia"
                fullWidth
                error={!!errors.colony}
                helperText={errors.colony?.message}
              />
            )}
          />
        </Grid>

        {/* Zip Code */}
        <Grid item xs={12} md={6}>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Código Postal"
                fullWidth
                error={!!errors.zipCode}
                helperText={errors.zipCode?.message}
              />
            )}
          />
        </Grid>

        {/* City */}
        <Grid item xs={12} md={6}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ciudad"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            )}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel id="state-label">Estado</InputLabel>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="state-label"
                  label="Estado"
                >
                  {mexicanStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.state && (
              <FormHelperText>{errors.state.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Address Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.addressType}>
            <InputLabel id="address-type-label">Tipo de Dirección</InputLabel>
            <Controller
              name="addressType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="address-type-label"
                  label="Tipo de Dirección"
                >
                  {addressTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.addressType && (
              <FormHelperText>{errors.addressType.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Is Primary */}
        <Grid item xs={12} md={6}>
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="is-primary-label">Dirección Principal</InputLabel>
                <Select
                  {...field}
                  labelId="is-primary-label"
                  label="Dirección Principal"
                >
                  <MenuItem value={true}>Sí</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {/* Reference (optional) */}
        <Grid item xs={12}>
          <Controller
            name="reference"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Referencias"
                fullWidth
                multiline
                rows={2}
                helperText="Opcional - Añada referencias para facilitar la ubicación"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => reset()}
          color="secondary"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;
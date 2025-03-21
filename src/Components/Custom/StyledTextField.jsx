"use client";

import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Campo de texto estilizado reutilizable para formularios
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del campo (requerido para react-hook-form)
 * @param {Object} props.control - Control de react-hook-form
 * @param {Object} props.errors - Objeto de errores de react-hook-form
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.type - Tipo de input (text, email, etc.)
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.helperTextEmpty - Texto de ayuda cuando el campo está vacío
 * @param {Object} props.rules - Reglas de validación adicionales
 * @param {Object} props.textFieldProps - Props adicionales para pasar al TextField
 * @param {number} props.min - Valor mínimo para campos de tipo number (por defecto 1)
 * @returns {JSX.Element} Componente TextField estilizado
 */

const StyledTextField = ({
  name,
  control,
  errors,
  label,
  type = "text",
  placeholder,
  helperTextEmpty,
  rules = {},
  textFieldProps = {},
  min = 1, // Valor mínimo por defecto de 1 para campos numéricos
}) => {
  // Estilos dinámicos basados en el estado del campo
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

  // Configuración específica para inputs de tipo número
  const getNumberInputProps = () => {
    if (type === "number") {
      return {
        inputMode: "numeric",
        inputProps: {
          min: min, // Aplicar valor mínimo al input HTML nativo
        },
        sx: {
          "& input[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
              opacity: 1, // Hace visibles las flechas siempre
            },
          },
        },
      };
    }
    return {};
  };

  // Combinar las reglas existentes con la validación de valor mínimo para campos numéricos
  const mergedRules = {
    ...rules,
    ...(type === "number" && {
      min: {
        value: min,
        message: `El valor debe ser al menos ${min}`,
      },
      validate: {
        isNumber: (value) => !isNaN(value) || "Debe ser un número válido",
        ...(rules.validate || {}),
      },
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={mergedRules}
      render={({ field }) => {
        const isEmpty = !field.value;
        const hasError = !!errors[name];
        const helperText = hasError
          ? errors[name]?.message
          : !isEmpty
            ? "✔️"
            : helperTextEmpty;

        // Combina los InputProps específicos para números con los que vienen de props
        const numberInputProps = getNumberInputProps();
        const mergedInputProps = {
          ...numberInputProps,
          inputProps: {
            ...(numberInputProps.inputProps || {}),
            ...(textFieldProps.InputProps?.inputProps || {}),
          },
          ...(textFieldProps.InputProps || {}),
        };

        // Para campos numéricos, aseguramos que no se ingresen valores por debajo del mínimo
        const handleChange = (e) => {
          let value = e.target.value;
          if (type === "number" && value !== "" && Number(value) < min) {
            value = min.toString();
          }
          field.onChange(value);
        };

        return (
          <TextField
            {...field}
            {...textFieldProps}
            onChange={handleChange}
            label={label}
            placeholder={placeholder}
            type={type}
            fullWidth
            error={hasError}
            helperText={helperText}
            InputLabelProps={{
              shrink: { xs: true, md: false }, // Mantiene la etiqueta siempre arriba
            }}
            // Sobrescribe InputProps solo si es tipo número o si se proporcionan en props
            InputProps={
              Object.keys(mergedInputProps).length > 0
                ? mergedInputProps
                : undefined
            }
            sx={{
              ...getFieldSx(isEmpty, hasError),
              ...(textFieldProps.sx || {}),
            }}
          />
        );
      }}
    />
  );
};

export default StyledTextField;

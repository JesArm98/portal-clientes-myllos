import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

function Manual() {
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: "20px",
        padding: 2,

        maxWidth: "1200px",
        margin: "auto",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={2}
          fontWeight="bold"
          color="primary"
        >
          Nuevo Portal para Clientes de Operadora de Servicios Myllos
        </Typography>
        <img
          src="/favicon.ico"
          alt="Myllos Logo"
          style={{
            width: "120px",
            height: "120px",
            margin: "auto",
          }}
        />
      </Box>

      <Box sx={{ width: "80%", mb: 4 }}>
        <Typography
          variant="h7"
          textAlign="center"
          sx={{
            lineHeight: 1.6,
            color: "#424242",
          }}
        >
          En este portal encontrará 5 opciones en nuestro menú desplegable
          ubicado a la izquierda, las cuales son:{" "}
          <Typography component="span" fontWeight="bold" color="primary">
            Complementos (de pago), Facturas de Egresos, Facturas de Gastos,
            Facturas de Ingresos y Traslados
          </Typography>
          . En cada opción se tiene su propio manual para mostrar su
          funcionamiento detallado.
        </Typography>
      </Box>

      <Box
        sx={{
          width: "90%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: 1,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="medium"
          color="primary"
          mb={0}
          sx={{
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: 1,
            textAlign: "center",
          }}
        >
          Opciones Disponibles
        </Typography>

        <List>
          <ListItem sx={{ mb: 0 }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Complementos
                </Typography>
              }
              secondary="En este apartado el proveedor podrá mirar los complementos que tiene en nuestro sistema y además agregar nuevos."
              secondaryTypographyProps={{ fontSize: "1rem", color: "#424242" }}
            />
          </ListItem>

          <ListItem sx={{ mb: 0 }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Egresos
                </Typography>
              }
              secondary="En este apartado se encuentran las Facturas de Egreso (uso CFDI G02) que se tienen en el sistema de Myllos. "
              secondaryTypographyProps={{ fontSize: "1rem", color: "#424242" }}
            />
          </ListItem>

          <ListItem sx={{ mb: 0 }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Gastos
                </Typography>
              }
              secondary="En este apartado se encuentran las Facturas de Gastos (uso CFDI G03) que se tienen en el sistema de Myllos."
              secondaryTypographyProps={{ fontSize: "1rem", color: "#424242" }}
            />
          </ListItem>

          <ListItem sx={{ mb: 0 }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Ingresos
                </Typography>
              }
              secondary="En este apartado el proveedor podrá mirar sus Facturas de Ingreso (excluyendo uso CDFI G02 Y G03) que tiene en nuestro sistema y además agregar nuevos."
              secondaryTypographyProps={{ fontSize: "1rem", color: "#424242" }}
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  Traslados
                </Typography>
              }
              secondary="En este apartado se encuentran la Facturación de servicios de Traslados y Fletes que tiene el Proveedor en el sistema de Myllos."
              secondaryTypographyProps={{ fontSize: "1rem", color: "#424242" }}
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
}

export default Manual;

import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  Receipt as ReceiptLongIcon,
  CreditScore as CreditScoreIcon,
  LocalGasStation as LocalGasStationIcon,
  LocalAtm as LocalAtmIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';

// Main menu items
export const mainListItems = (
  <React.Fragment>
    <Tooltip title="Página principal del dashboard" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/">
        <ListItemIcon>
          <HomeIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="INICIO"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    
    <Tooltip title="Gestión de direcciones" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/direcciones">
        <ListItemIcon>
          <ReceiptLongIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="DIRECCIONES"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    
    {/* Commented out as in your original code, but now with tooltips */}
    {/* 
    <Tooltip title="Gestión de egresos financieros" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/egresos">
        <ListItemIcon>
          <CreditScoreIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="EGRESOS"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    
    <Tooltip title="Control de gastos operativos" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/gastos">
        <ListItemIcon>
          <LocalGasStationIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="GASTOS"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    
    <Tooltip title="Registro de ingresos" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/ingresos">
        <ListItemIcon>
          <LocalAtmIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="INGRESOS"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    
    <Tooltip title="Gestión de traslados" placement="right" arrow>
      <ListItemButton component={RouterLink} to="/traslados">
        <ListItemIcon>
          <LocalShippingIcon sx={{color:"#3DC2CF"}} />
        </ListItemIcon>
        <ListItemText 
          primary="TRASLADOS"
          sx={{
            textAlign: "left",
            "& .MuiTypography-root": {
              fontWeight: "bold",
              color: "white"
            },
          }}
        />
      </ListItemButton>
    </Tooltip>
    */}
  </React.Fragment>
);

// Secondary menu items with tooltips
export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset sx={{ color: "white" }}>
      Reportes
    </ListSubheader>
    {/* Add your secondary menu items here with tooltips */}
  </React.Fragment>
);
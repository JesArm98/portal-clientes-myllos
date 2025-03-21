import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import IconButtonWithTooltip from "@/Components/Custom/IconButtonWithTooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddressDialog from "../Direcciones/AddressDialog";

const Cotizaciones = () => {
  // Step estado
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Datos de Envío", "Selección de Servicio", "Confirmación"];

  // State for origin address
  const [originAddress, setOriginAddress] = useState({
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
  });

  // State for destination address
  const [destinationAddress, setDestinationAddress] = useState(null);

  // State for package details
  const [packageDetails, setPackageDetails] = useState({
    numberOfPackages: 1,
    weight: 0,
    contents: "",
    declaredValue: 0,
  });

  // State for special services
  const [specialServices, setSpecialServices] = useState({
    insurance: false,
    RAD: false,
    deliveryType: "home", // 'home' or 'branch'
  });

  // State for available addresses (for origin selection)
  const [availableAddresses, setAvailableAddresses] = useState([]);

  // State for address dialog
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressFormData, setAddressFormData] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressDialogPurpose, setAddressDialogPurpose] = useState("origin"); // 'origin' or 'destination'

  console.log(destinationAddress);

  // State for quote results
  const [quoteResults, setQuoteResults] = useState(null);
  const [isQuoting, setIsQuoting] = useState(false);

  // State for selected alliance/service
  const [selectedService, setSelectedService] = useState(null);

  // State for shipping partners/alliances
  const [shippingPartners, setShippingPartners] = useState([
    {
      id: "estafeta",
      name: "Estafeta",
      logo: "/logos/estafeta.png",
      deliveryTime: "2-3 días",
    },
    {
      id: "fedex",
      name: "FedEx",
      logo: "/logos/fedex.png",
      deliveryTime: "1-2 días",
    },
    {
      id: "dhl",
      name: "DHL",
      logo: "/logos/dhl.png",
      deliveryTime: "2-4 días",
    },
    {
      id: "redpack",
      name: "Redpack",
      logo: "/logos/redpack.png",
      deliveryTime: "3-5 días",
    },
  ]);

  // Fetch available addresses on component mount
  useEffect(() => {
    fetchAvailableAddresses();
  }, []);

  // Function to fetch available addresses
  const fetchAvailableAddresses = async () => {
    try {
      // In a real application, this would fetch from your API
      // For now, we'll use static data
      setAvailableAddresses([
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
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Function to handle package details changes
  const handlePackageDetailsChange = (e) => {
    const { name, value } = e.target;
    setPackageDetails((prev) => ({
      ...prev,
      [name]: ["numberOfPackages", "weight", "declaredValue"].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  // Function to handle special services changes
  const handleSpecialServicesChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "deliveryType") {
      setSpecialServices((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setSpecialServices((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Function to handle address dialog open
  const handleOpenAddressDialog = (purpose, address = null) => {
    setAddressDialogPurpose(purpose);
    if (address) {
      setAddressFormData(address);
      setIsEditingAddress(true);
    } else {
      setAddressFormData(null);
      setIsEditingAddress(false);
    }
    setOpenAddressDialog(true);
  };

  // Function to handle address dialog close
  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
    setAddressFormData(null);
    setIsEditingAddress(false);
  };

  // Function to handle address submission
  const handleSubmitAddress = async (data) => {
    try {
      // In a real application, this would submit to your API
      // For now, we'll just update the local estado

      if (addressDialogPurpose === "origin") {
        // If we're editing an existing address
        if (isEditingAddress) {
          // Update address in available addresses list
          setAvailableAddresses((prev) =>
            prev.map((addr) => (addr.id === data.id ? data : addr))
          );
          // If current origin address is being edited, update it
          if (originAddress.id === data.id) {
            setOriginAddress(data);
          }
        } else {
          // Add new address to available addresses
          const newAddress = {
            ...data,
            id: `addr-${Date.now()}`,
          };
          setAvailableAddresses((prev) => [...prev, newAddress]);
        }
      } else if (addressDialogPurpose === "destination") {
        // Set destination address
        if (isEditingAddress) {
          setDestinationAddress(data);
        } else {
          setDestinationAddress({
            ...data,
            id: `addr-dest-${Date.now()}`,
          });
        }
      }

      handleCloseAddressDialog();
      return data;
    } catch (error) {
      console.error("Error submitting address:", error);
      throw error;
    }
  };

  // Function to handle origin address change
  const handleOriginAddressChange = (e) => {
    const addressId = e.target.value;
    const address = availableAddresses.find((addr) => addr.id === addressId);
    if (address) {
      setOriginAddress(address);
    }
  };

  // Function to handle quote request
  const handleRequestQuote = async () => {
    if (!destinationAddress) {
      alert("Por favor, seleccione una dirección de destino.");
      return;
    }

    setIsQuoting(true);
    setQuoteResults(null);

    try {
      // In a real application, this would submit to your API
      // For now, we'll simulate a response

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate partner offers with dynamic pricing
      const partnerOffers = shippingPartners.map((partner) => {
        // Base price calculation using weight and numeroExterior of packages
        const basePrice =
          packageDetails.weight * 30 +
          packageDetails.numberOfPackages * 50 +
          Math.random() * 100; // Add some random variation

        // Apply special services costs
        const insuranceCost = specialServices.insurance
          ? packageDetails.declaredValue * 0.05
          : 0;
        const radCost = specialServices.RAD ? 80 : 0;
        const homeDeliverySurcharge =
          specialServices.deliveryType === "home" ? 50 : 0;

        // Calculate total price
        const totalPrice =
          basePrice + insuranceCost + radCost + homeDeliverySurcharge;

        return {
          partnerId: partner.id,
          partnerName: partner.name,
          partnerLogo: partner.logo,
          serviceType:
            partner.id === "fedex" || partner.id === "dhl"
              ? "Express"
              : "Standard",
          estimatedDelivery: partner.deliveryTime,
          price: Math.round(totalPrice * 100) / 100,
        };
      });

      // Sort offers by price
      partnerOffers.sort((a, b) => a.price - b.price);

      // Mock quote response with partner offers
      const mockQuoteResponse = {
        success: true,
        quoteId: `Q-${Date.now()}`,
        options: partnerOffers,
      };

      setQuoteResults(mockQuoteResponse);
      setActiveStep(1); // Move to next step
    } catch (error) {
      console.error("Error requesting quote:", error);
      setQuoteResults({
        success: false,
        error: "Error al solicitar la cotización. Por favor, intente de nuevo.",
      });
    } finally {
      setIsQuoting(false);
    }
  };

  // Function to select a shipping service
  const handleSelectService = (service) => {
    setSelectedService(service);
    setActiveStep(2); // Move to confirmation step
  };

  // Function to confirm the shipping order
  const handleConfirmShipping = () => {
    // In a real app, this would send the final order to your backend
    alert(
      `Su cotización ha sido confirmada. Recibirá un correo con los detalles de su envío con ${selectedService.partnerName}.`
    );
    // You could also navigate to a different page or reset the form
  };

  // Function to navigate back a step
  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
  };

  // Function to reset the process
  const handleReset = () => {
    setActiveStep(0);
    setSelectedService(null);
    setQuoteResults(null);
  };

  // Function to format address for display
  const formatAddressForDisplay = (address) => {
    if (!address) return "No seleccionada";

    return (
      <>
        <Typography variant="body2">
          {address.calle} {address.numeroExterior}
          {address.numeroInterior ? `, Int. ${address.numeroInterior}` : ""}
        </Typography>
        <Typography variant="body2">
          Col. {address.colonia}, {address.ciudad}
        </Typography>
        <Typography variant="body2">
          {address.estado}, CP {address.cp}
        </Typography>
        {address.referencia && (
          <Typography variant="body2" color="textSecondary">
            Ref: {address.referencia}
          </Typography>
        )}
      </>
    );
  };

  {
    console.log(destinationAddress);
  }

  const formatAddressDestinationForDisplay = (destinationAddress) => {
    if (!destinationAddress) return "No seleccionada";

    return (
      <>
        <Typography variant="body2">
          {destinationAddress.calle} {destinationAddress.numeroExterior}
          {destinationAddress.numeroInterior
            ? `, Int. ${destinationAddress.numeroInterior}`
            : ""}
        </Typography>
        <Typography variant="body2">
          Col. {destinationAddress.cp.colonia}, {destinationAddress.cp.ciudad}
        </Typography>
        <Typography variant="body2">
          {destinationAddress.cp.estado}, CP {destinationAddress.cp.cp}
        </Typography>
        {destinationAddress.referencia && (
          <Typography variant="body2" color="textSecondary">
            Ref: {destinationAddress.referencia}
          </Typography>
        )}
      </>
    );
  };

  // Render step content based on active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Origin Address */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardHeader title="Dirección de Origen" />
                <Divider />
                <CardContent>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField
                      select
                      label="Seleccionar dirección de origen"
                      value={originAddress?.id || ""}
                      onChange={handleOriginAddressChange}
                      fullWidth
                    >
                      {availableAddresses.map((address) => (
                        <MenuItem key={address.id} value={address.id}>
                          {address.calle} {address.numeroExterior},{" "}
                          {address.ciudad} ({address.addressType})
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>

                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    {formatAddressForDisplay(originAddress)}
                  </Box>

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                      margin: "auto",
                      mt: 2,
                      textTransform: "none",
                      borderRadius: "20px",
                      display: "flex",
                    }}
                    onClick={() => handleOpenAddressDialog("origin")}
                  >
                    Agregar Nueva Dirección
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Destination Address */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardHeader
                  title="Dirección de Destino"
                  action={
                    destinationAddress && (
                      <IconButtonWithTooltip
                        tooltipTitle="Editar dirección de destino"
                        iconColor="#2196F3"
                        IconComponent={<EditIcon />}
                        onIconClick={() =>
                          handleOpenAddressDialog(
                            "destination",
                            destinationAddress
                          )
                        }
                      />
                    )
                  }
                />
                <Divider />
                <CardContent>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      bgcolor: "#f5f5f5",
                      mb: 2,
                    }}
                  >
                    {formatAddressDestinationForDisplay(destinationAddress)}
                  </Box>

                  <Button
                    variant={!destinationAddress ? "outlined" : "outlined"}
                    startIcon={<AddIcon />}
                    color="primary"
                    sx={{
                      width: "fit-content",
                      textTransform: "none",
                      margin: "auto",
                      display: "flex",
                      borderRadius: "20px",
                    }}
                    onClick={() => handleOpenAddressDialog("destination")}
                    fullWidth
                  >
                    {!destinationAddress
                      ? "Agregar Dirección de Destino"
                      : "Cambiar Dirección de Destino"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Package Details */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Detalles del Paquete" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Número de Bultos"
                        name="numberOfPackages"
                        type="number"
                        value={packageDetails.numberOfPackages}
                        onChange={handlePackageDetailsChange}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Peso Total"
                        name="weight"
                        type="number"
                        value={packageDetails.weight}
                        onChange={handlePackageDetailsChange}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0, step: 0.1 },
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Contenido"
                        name="contents"
                        value={packageDetails.contents}
                        onChange={handlePackageDetailsChange}
                        fullWidth
                        placeholder="Describa el contenido del envío"
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Valor Declarado"
                        name="declaredValue"
                        type="number"
                        value={packageDetails.declaredValue}
                        onChange={handlePackageDetailsChange}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0, step: 100 },
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Special Services */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Servicios Especiales" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="insurance"
                            checked={specialServices.insurance}
                            onChange={handleSpecialServicesChange}
                            color="primary"
                          />
                        }
                        label="Seguro de Envío"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            name="RAD"
                            checked={specialServices.RAD}
                            onChange={handleSpecialServicesChange}
                            color="primary"
                          />
                        }
                        label="Retorno de Acuse de Recibo (RAD)"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Tipo de Entrega
                      </Typography>
                      <RadioGroup
                        name="deliveryType"
                        value={specialServices.deliveryType}
                        onChange={handleSpecialServicesChange}
                      >
                        <FormControlLabel
                          value="home"
                          control={<Radio />}
                          label="Entrega a Domicilio"
                        />
                        <FormControlLabel
                          value="branch"
                          control={<Radio />}
                          label="Entrega en Sucursal"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Quote Request Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleRequestQuote}
                  disabled={isQuoting || !destinationAddress}
                  sx={{
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    width: "fit-content",
                    borderRadius: "20px",
                  }}
                >
                  {isQuoting ? "Procesando..." : "Solicitar Cotización"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {/* Quote Results with Alliance Selection */}
            {quoteResults && quoteResults.success ? (
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Resultados de la Cotización"
                    subheader={`Cotización #${quoteResults.quoteId}`}
                  />
                  <Divider />
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Seleccione una de nuestras alianzas de envío:
                    </Typography>

                    <Grid container spacing={2}>
                      {quoteResults.options.map((option, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 3,
                              },
                            }}
                            onClick={() => handleSelectService(option)}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  height: 60,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mb: 2,
                                }}
                              >
                                {/* In a real app, this would be the partner's logo */}
                                <Typography variant="h6" color="primary">
                                  {option.partnerName}
                                </Typography>
                              </Box>

                              <Typography
                                variant="body1"
                                color="primary"
                                gutterBottom
                              >
                                {option.serviceType}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="textSecondary"
                                gutterBottom
                              >
                                Entrega estimada: {option.estimatedDelivery}
                              </Typography>

                              <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
                                ${option.price.toFixed(2)} MXN
                              </Typography>

                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                              >
                                Seleccionar
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography color="error">
                      {quoteResults?.error ||
                        "Error al obtener cotizaciones. Intente nuevamente."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Back Button */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
              >
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
                  Regresar a Datos de Envío
                </Button>
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {/* Confirmation Step */}
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Confirmación de Envío"
                  subheader="Revise los detalles de su envío antes de confirmar"
                />
                <Divider />
                <CardContent>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <CheckCircleIcon
                      color="success"
                      sx={{ fontSize: 64, mb: 2 }}
                    />
                    <Typography variant="h5" gutterBottom>
                      ¡Servicio seleccionado!
                    </Typography>
                    <Typography variant="body1">
                      Ha seleccionado el servicio de{" "}
                      {selectedService?.partnerName} (
                      {selectedService?.serviceType})
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${selectedService?.price.toFixed(2)} MXN
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tiempo estimado de entrega:{" "}
                      {selectedService?.estimatedDelivery}
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Dirección de Origen
                        </Typography>
                        {formatAddressForDisplay(originAddress)}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Dirección de Destino
                        </Typography>
                        {formatAddressDestinationForDisplay(destinationAddress)}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Detalles del Paquete
                        </Typography>
                        <Typography variant="body2">
                          Número de Bultos: {packageDetails.numberOfPackages}
                        </Typography>
                        <Typography variant="body2">
                          Peso Total: {packageDetails.weight} kg
                        </Typography>
                        <Typography variant="body2">
                          Contenido:{" "}
                          {packageDetails.contents || "No especificado"}
                        </Typography>
                        <Typography variant="body2">
                          Valor Declarado: $
                          {packageDetails.declaredValue.toFixed(2)} MXN
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Servicios Adicionales
                        </Typography>
                        <Typography variant="body2">
                          Seguro de Envío:{" "}
                          {specialServices.insurance ? "Sí" : "No"}
                        </Typography>
                        <Typography variant="body2">
                          Retorno de Acuse (RAD):{" "}
                          {specialServices.RAD ? "Sí" : "No"}
                        </Typography>
                        <Typography variant="body2">
                          Tipo de Entrega:{" "}
                          {specialServices.deliveryType === "home"
                            ? "A Domicilio"
                            : "En Sucursal"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Al confirmar, recibirá un correo electrónico con los
                      detalles de su envío y las instrucciones para proceder con
                      el pago.
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<MailOutlineIcon />}
                      sx={{ mt: 2, px: 4 }}
                      onClick={handleConfirmShipping}
                    >
                      Confirmar Envío
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Back Button */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
                  Regresar a Selección de Servicio
                </Button>

                <Button color="inherit" onClick={handleReset}>
                  Iniciar Nuevo Envío
                </Button>
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 0 }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {getStepContent(activeStep)}

      {/* Address Dialog */}
      <AddressDialog
        open={openAddressDialog}
        onClose={handleCloseAddressDialog}
        onSubmit={handleSubmitAddress}
        initialValues={addressFormData}
        isEditing={isEditingAddress}
        title={
          isEditingAddress
            ? `Editar Dirección de ${addressDialogPurpose === "origin" ? "Origen" : "Destino"}`
            : `Registro de Dirección de ${addressDialogPurpose === "origin" ? "Origen" : "Destino"}`
        }
      />
    </Box>
  );
};

export default Cotizaciones;

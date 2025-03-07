import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import DialogContentText from "@mui/material/DialogContentText";
import CustomDialog from "@/Components/Custom/CustomDialog";
import { useNavigate } from "react-router-dom";
import "./ClickableAvatar.css";
import { Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ClickableAvatar(props) {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [nombreEmpleado, setNombreEmpleado] = useState("Jesus Armando Estrada Aramburo");
  const [iniciales, setIniciales] = useState("");
  const navigate = useNavigate();

  const handleAvatarClick = () => setIsPromptOpen(true);

  const handlePromptClose = () => setIsPromptOpen(false);

  useEffect(() => {
    // Obtener el dato del localStorage
    const datoGuardado1 = localStorage.getItem("nombreEmpleado");
    if (datoGuardado1) {
      setNombreEmpleado(datoGuardado1);
    }
  }, []);

  useEffect(() => {
    setIniciales(obtenerIniciales(nombreEmpleado));
  }, [nombreEmpleado]);

  const obtenerIniciales = (nombre) => {
    const partes = nombre.split(" ");
    if (partes.length > 1) {
      return partes[0].charAt(0) + partes[1].charAt(0);
    } else {
      return nombre.charAt(0);
    }
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    setIsPromptOpen(false);

    // Espera un pequeño tiempo antes de redirigir para asegurarse de que se actualice el estado
    setTimeout(() => {
      navigate("/sign-in");
    }, 100);
  };

  return (
    <>
      <Tooltip
        arrow
        title="Cerrar Sesión"
        placement="top"
        onClick={handleAvatarClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="clickable-avatar"
      >
        <Avatar style={{ width: 40, height: 40, cursor: "pointer" }}>
          {hover ? (
            <LogoutIcon sx={{ color: "red" }} />
          ) : (
            <p
              style={{
                fontSize: "1rem",
                textShadow: `
                -1px -1px 0 #000,  
                 1px -1px 0 #000,
                -1px  1px 0 #000,
                 1px  1px 0 #000`,
              }}
            >
              <strong>{iniciales}</strong>
            </p>
          )}
        </Avatar>
      </Tooltip>

      <CustomDialog
        open={isPromptOpen}
        onClose={handlePromptClose}
        title="CERRANDO SESIÓN"
        onSubmit={handleConfirmLogout}
        submitLabel="Cerrar sesión"
        width="xs"
      >
        <DialogContentText sx={{ textAlign: "center" }}>
          ¿Estas seguro de querer cerrar sesión?
        </DialogContentText>
      </CustomDialog>
    </>
  );
}

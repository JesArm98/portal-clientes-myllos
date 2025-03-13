import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout"; // Import the new dashboard layout
import Error500Page from "../Pages/errorPages/500/Error500Page";
import NewPassPage from "../Pages/Admin/NewPassPage";
import MatchPass from "../Pages/Admin/MatchPass/MatchPass";
import NotFound from "../Pages/errorPages/400/NotFound404";
import SignInPage from "../Pages/Admin/SignIn/SignInPage";
import ComplementosFacturas from "../Pages/Sistema/Contabilidad/Facturas/Complementos/ComplementosFacturas";
import Egresos from "../Pages/Sistema/Contabilidad/Facturas/Egresos/Egresos";
import Gastos from "../Pages/Sistema/Contabilidad/Facturas/Gastos/Gastos";
import Traslados from "../Pages/Sistema/Contabilidad/Facturas/Traslados/Traslados";
import Ingresos from "../Pages/Sistema/Contabilidad/Facturas/Ingreso/Ingresos";
import Manual from "../Pages/Admin/Manual/Manual";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <DashboardLayout />, // Use the new DashboardLayout instead of Layout
      children: [
        { index: true, element: <Manual /> },
        { path: "direcciones", element: <ComplementosFacturas /> },
        // Uncomment these routes when needed
        // { path: "egresos", element: <Egresos /> },
        // { path: "gastos", element: <Gastos /> },
        // { path: "ingresos", element: <Ingresos /> },
        // { path: "traslados", element: <Traslados /> },
      ],
    },
    { path: "/500", element: <Error500Page /> },
    { path: "/sign-in", element: <SignInPage /> },
    { path: "/rc-contraseña", element: <NewPassPage /> },
    { path: "/pass-new", element: <MatchPass /> },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true, // Enable the future flag
    },
  }
);

export default function Router() {
  return <RouterProvider router={router} />;
}
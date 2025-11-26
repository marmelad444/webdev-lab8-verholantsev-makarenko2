import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Logout from "../pages/Logout";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />
        },
        {
            path:"/signup",
            element: <SignUp  />
        },
        {
            path:"/signin",
            element: <SignIn />
        },
                {
            path:"/logout",
            element: <Logout  />
        },

    ]
)
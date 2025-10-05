import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PageNotFound from "./Pages/Page404/PageNotFound";
import SinglePostPage from "./Pages/Post/SinglePostPage";
import RequiredRoute from "./RequiredRoute";

const Home = lazy(() => import("./Pages/Home/Home"));
const Follow = lazy(() => import("./Pages/Follow/Follow"));
const Login = lazy(() => import("./Pages/Auth/Login/Login"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const Signup = lazy(() => import("./Pages/Auth/Login/Signup"));
const Admin = lazy(() => import("./Admin/Pages/Home/Admin"));
const VerifyEmail = lazy(() => import("./Pages/Auth/verification/VerifyEmail"));
const OthersProfilePage = lazy(
  () => import("./Pages/Profile/OthersProfilePage")
);
const SendVerificationEmail = lazy(
  () => import("./Pages/Auth/verification/SendVerificationEmail")
);

function Application() {
  const authWrapper = (children: React.ReactNode) => {
    return <RequiredRoute>{children}</RequiredRoute>;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/post/:id" element={<SinglePostPage />} />
      <Route path="/user/:id" element={authWrapper(<OthersProfilePage />)} />
      <Route path="/messages" element={authWrapper(<Home />)} />
      <Route path="/notifications" element={authWrapper(<Home />)} />
      <Route path="/profile" element={authWrapper(<Profile />)} />
      <Route
        path="/sendverifyemail"
        element={authWrapper(<SendVerificationEmail />)}
      />
      <Route path="/verifyemail" element={<VerifyEmail />} />
      <Route
        path="/admin/*"
        element={authWrapper(<Admin children={undefined} />)}
      />
      <Route path="/follow/:id" element={authWrapper(<Follow />)} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Application;

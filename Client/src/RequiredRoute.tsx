import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "./Redux/store";

interface IChildren {
  children: ReactNode;
}

function RequiredRoute({ children }: IChildren) {
  const { pathname } = useLocation();
  var user = sessionStorage.getItem("user");
  let data = user ? JSON.parse(user) : null;
  const { userCredential } = useSelector((store: RootState) => store.auth);
  const isEmailVerified = userCredential.isVerified;

  if (data == null) {
    return <Navigate to={"/login"} />;
  }

  if (!isEmailVerified && pathname != "/sendverifyemail") {
    return <Navigate to={"/sendverifyemail"} />;
  }

  if (pathname == "/sendverifyemail" && isEmailVerified) {
    return <Navigate to={"/"} />;
  }

  return <>{children}</>;
}

export default RequiredRoute;

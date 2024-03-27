import Check from "../Admin";
import Header from "../Header";
import Logout from "../Logout";
import ShowAllQR from "../ShowAllQR";
import ShowFile from "../ShowFile/ShowFile";
import Signin from "../Sign-in";
import SignUp from "../Sign-up";
import Notify from "../SnackBar";
import UpdateForm from "../UpdateForm/UpdateForm";
import UploadForm from "../UploadForm";
import Chat from "../components/Chatapp";
import ShowQrCode from "../showQrCode";

const publicRoutes = [

  {path:"/signUp", component: SignUp},
  {path:"/signIn", component: Signin},
  {path:"/:id", component: ShowQrCode},
  {path:"/:id/:file_name", component: ShowFile},
  {path:"/", component: ShowAllQR},
  {path:"/chat",component: Chat}
]
const privateRoutes = [
  {path:"/upload", component: UploadForm, layout: Header},
  {path:"/admin", component: Check},
  {path:"/logOut", component: Logout},
  {path:"/update/:id", component: UpdateForm}
]
export { publicRoutes, privateRoutes }
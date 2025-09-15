import { auth } from "../../services/firebase/config";
import { useNavigate } from "react-router-dom";
import notifIcon from "../../assets/images/notification.png";
import helpIcon from "../../assets/images/help.png";
import homeIcon from "../../assets/images/home.png";
import Projects from "./Projects/page";
import { useAuth } from "../../services/firebase/auth-context";
import NavDropdown from "../../components/nav-dropdown";

export default function Home() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  if (!auth.currentUser) {
    navigate("/");
  }

  if (!user) {
    console.log("No user logged in");
    navigate("/");
  }

  return (
    <div className="h-screen [background:#E6E6E6]">
      <nav className=" col-span-2">
        <div className="grid [grid-template-columns:50px_auto_1fr] text-black">
          <div>
            <img src={homeIcon} className="p-3" />
          </div>
          <div className="font-semibold pt-3 p-1">AutoProject</div>
          <div className="flex justify-end space-x-5 m-3 [&>div]:bg-transparent [&>div]:hover:bg-gray-300  [&>div]:rounded-full [&>div]:cursor-pointer [&>div]:p-1 [&>div>img]:w-6">
            <div>
              <img src={notifIcon} />
            </div>
            <div>
              <img src={helpIcon} />
            </div>
            <NavDropdown actions={{ Logout: () => logout() }}>
              <img src={user?.photoURL || ""} className="rounded-xl h-6" />
            </NavDropdown>
            {/* <div>
              <img src={user?.photoURL || ""} className="rounded-xl" />
            </div> */}
          </div>
        </div>
      </nav>
      <main>
        <div className="container mx-auto max-w-5/10 mt-7">
          <Projects user={user} />
        </div>
      </main>
    </div>
  );
}

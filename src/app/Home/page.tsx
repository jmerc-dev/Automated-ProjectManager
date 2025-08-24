import { auth } from "../../config/firebase/config";
import { useNavigate } from "react-router-dom";
import notifIcon from "../../assets/images/notification.png";
import helpIcon from "../../assets/images/help.png";
import homeIcon from "../../assets/images/home.png";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Projects from "./Projects/page";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  if (!auth.currentUser) {
    navigate("/");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // user is null if logged out
    });
    return () => unsubscribe();
  }, [auth]);

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
            <div>
              <img src={user?.photoURL || ""} className="rounded-xl" />
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="container mx-auto max-w-5/10 mt-7">
          <Projects />
        </div>
      </main>
    </div>
  );
}

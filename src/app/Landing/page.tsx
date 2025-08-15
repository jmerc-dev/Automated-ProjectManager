import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase/config.ts";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  async function signIn() {
    await signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <div> </div>
      <div>
        <button onClick={signIn} className="border-1 border-gray-500">
          Login With Google
        </button>
      </div>
    </div>
  );
}

export default Landing;

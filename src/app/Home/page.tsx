import { auth } from "../../config/firebase/config";

export default function Home() {
  return <>Hello: {auth.currentUser?.displayName}</>;
}

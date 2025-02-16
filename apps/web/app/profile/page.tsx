import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const Profile = async() => {
    const session = await getSession();

    return ( 
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="text-6xl text-yellow-400">
            Profile
            </div>
        </div>
     );
}
 
export default Profile;
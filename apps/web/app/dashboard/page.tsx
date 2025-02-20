import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const Dashboard = async() => {
    const session = await getSession();
    console.log(session)
    if(!session || !session.user)return redirect("/auth/signin")
    return ( 
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="text-6xl text-yellow-400">
                Dashboard
            </div>
        </div>
     );
}
 
export default Dashboard;
import getProfile from "@/actions/user/profile";


const Profile = async() => {
    const res = await getProfile();
    

    return ( 
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="text-4xl text-yellow-400">
                {JSON.stringify(res)}
            </div>
        </div>
     );
}
 
export default Profile;
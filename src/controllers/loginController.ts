/*export const loginController=async(email:string,passwod:string)=>{
    try{
        const response = await fetch('http://192.168.100.242:3000/users');
        const users=await response.json();
        console.log(users)
        for (const user of users) {
            if(user.email==email && user.passwod==passwod){
                console.log("coincidence")
                return user;
            }
        }
        console.log("no coincidence")
        return null;
    }catch(err){
        throw err;
    }

};*/
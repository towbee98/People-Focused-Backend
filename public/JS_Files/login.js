import axios from 'axios';
import { displayMessage } from './display';
export const login = async (email,password)=>{
    try {
        const res= await axios({
            method:'POST',
            url: '/api/v1/users/login',
            data:{
                email,
                password
            }
        });
        return displayMessage(res.data.status)
    } catch (err) {
        // console.log(err.message);
        return displayMessage("error");
    }
}

export const signUp =async (firstname,lastName,email,password,passwordConfirm)=>{
    try {
        const res=await axios({
            method:"POST",
            url:"/api/v1/users/signup",
            data:{
                firstname,lastName,email,password,passwordConfirm
            }
        })
       return displayMessage(res.data.status);
    } catch (err) {
        console.log(err)
        return displayMessage("error")
    }
}

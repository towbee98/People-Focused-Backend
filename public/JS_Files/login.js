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
        return displayMessage(res.data.status);
    } catch (err) {
        // console.log(err.message);
        return displayMessage(err.message);
    }
}

export const signUp =async (userDetails)=>{
    try {
        console.log(userDetails);
        const res=await axios({
            method:"POST",
            url:"/api/v1/users/signup",
            data:{
                firstname:userDetails.firstname,
                lastName:userDetails.lastname,
                email:userDetails.email,
                password:userDetails.password,
                passwordConfirm:userDetails.passwordConfirm
            }
        })
       return  displayMessage(res.data.status,res.data.data.message);
    } catch (err) {
        if(err.response){
            console.log(err.response);
            return displayMessage('error',err.response.data.message);
        }
        return displayMessage('error',err.message);
    }
}

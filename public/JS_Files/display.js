export const displayMessage =(status,message)=>{
   // console.log(message)
   if(status==="success"){
       console.log(document.querySelector(".alert-success").firstElementChild);
       document.querySelector(".alert-success").style.display="inline";
       document.querySelector(".alert-danger").style.display="none";
   }else{
    document.querySelector(".alert-success").style.display="none";
    document.querySelector(".alert-danger").style.display="inline";
   }
}
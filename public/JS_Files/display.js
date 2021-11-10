export const displayMessage =(status)=>{
   if(status==="success"){
       document.querySelector(".alert-success").style.display="inline";
       document.querySelector(".alert-danger").style.display="none";
   }else{
    document.querySelector(".alert-success").style.display="none";
    document.querySelector(".alert-danger").style.display="inline";
   }
}
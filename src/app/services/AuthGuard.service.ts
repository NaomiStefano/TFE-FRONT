import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard : CanActivateFn = (route,state)=>{
    const router= inject(Router);
    const id = localStorage.getItem('userConnected');
    if(id){
        return true;
    }else{
        router.navigate(['public/home']);
        return false;
    }
}

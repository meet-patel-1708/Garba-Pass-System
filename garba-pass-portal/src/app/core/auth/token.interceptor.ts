import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("jwt");
  console.log('Token from localStorage:', token); // Add this
  
  if(token){
    req = req.clone({
      setHeaders:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Request headers:', req.headers.get('Authorization')); // Add this
  }
  return next(req);
};
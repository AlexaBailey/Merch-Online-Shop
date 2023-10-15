import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import setUserInfo from '../helpers/token';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';
export default function Navbar() {
  let userinfo;
  if (typeof window!='undefined'){
  if (localStorage.token) {
    const jwt = localStorage.getItem("token");
    setUserInfo(jwt);
    userinfo = jwtDecode(jwt);
    console.log(userinfo)
    console.log(userinfo.id)
  
  }}
  const router = useRouter();
const currentRoute = router.pathname;
console.log(currentRoute)
  return (
    <nav className='navbar'>
      <div style={{display:'flex',alignItems:'center', gap:3}}>
      <img style={{height:48}} src='../planet.png'/>
        <h2 style={{color:'white'}}>LabSpace</h2>
      </div>
   
        <div style={{display:'flex', alignItems:'center', gap:10}}>
        
            <Link  className={currentRoute == "/"
       ? "active" 
       : "non-active"} href="/"><span>Главная</span></Link>
          
       {userinfo?
       <>
        <Link  className={currentRoute == "/materials"
        ? "active" 
        : "non-active"} href="/materials" ><span>Репозиторий</span></Link>
        <Link  className={currentRoute == "/myprojects"
        ? "active" 
        : "non-active"} href="/myprojects" ><span>Мои проекты</span></Link>
           <Link  className={currentRoute == "/favourite"
        ? "active" 
        : "non-active"} href="/favourite" ><span>Любимое</span></Link>
       
             <Link  className={currentRoute == "/logout"
        ? "active" 
        : "non-active"} href={'/logout'}>Выйти</Link>
        <Link  href={`/profile/details/${userinfo.id}`} > <img style={{height:48}} src='../../profile.png'/></Link>
        </>
      
      
      :  <Link  className={currentRoute == "/login"
      ? "active" 
      : "non-active"} href={'/login'}>Войти</Link>
}
             
           
           
        </div>
    </nav>
  )
}

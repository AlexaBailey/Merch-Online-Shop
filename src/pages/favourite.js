import React from 'react'
import Navbar from './components/Navbar'
import { useState,useEffect } from 'react';

import axios from 'axios';
import setUserInfo from './helpers/token';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import Footer from './components/Footer';
import MyCards from './components/MyCards'
import Link from 'next/link';
import ChosenCard from './components/ChosenCard';

export default function Books() {
  const [materials, setMaterials] = useState('');  
  const [disc, setDisc] = useState(null)
const router = useRouter()
  const [mountEvent,setMountEvent]=useState(false)
  const [liked,setLiked]=useState(false)
  const [likedMat,setLikedMat]=useState('')
const [name,setName]=useState('')
let userinfo;

useEffect((userinfo) => {
  setMountEvent(true)
  if (localStorage.token) {
    const jwt = localStorage.getItem("token");
    setUserInfo(jwt);
    userinfo = jwtDecode(jwt);
    console.log(userinfo)
    console.log(userinfo.id)
  
}
  const requestData = async () => {
    


    try {
      console.log("id",userinfo.id)

  
      
      const res = await axios.get(`http://localhost:8800/favourite/${userinfo.id}`, {params:{id:userinfo.id}});
 
      setMaterials(res.data);
      



      console.log(materials)
     

       console.log("Info: ",res.data)
    } catch (err) {
      console.log(err);
    }
  };
  requestData();


}, []); 

const handleSubmit= async (e) => {
  try {
    e.preventDefault()
    console.log("form")
    const res = await axios.post(`http://localhost:8800/favourite/${userinfo.id}`,{params:{id:userinfo.id},name:name});
    setMaterials(res.data);

     console.log("Data form",res.data)
  } catch (err) {
    console.log(err);
  }
};



      axios.defaults.withCredentials = true;
      if (mountEvent){
        if (localStorage.token) {
          const jwt = localStorage.getItem("token");
          setUserInfo(jwt);
          userinfo = jwtDecode(jwt);
          console.log(userinfo)
      }
  return (
    <>
        <Navbar/>
        <div style={{display:'flex', justifyContent:'center',gap:30,marginTop:40}}> 
        
        <img style={{alignSelf:'center'}} className='hero-image' src='./favourite.png'/>


    </div>
    <div id="section" style={{display:'flex',flexDirection:'column'}}  className='all'>
     
        <Link  style={{color:'black', display:'flex',  alignItems:'center',gap:3}} href='/upload'>
          <img style={{height:30}} src="./plus.png"/>
        
        <p>Добавить учебник</p>
        </Link>  

      <div style={{display:'flex',justifyContent:'space-between'}}>

             

              <div style={{display:'flex', alignItems:'center',gap:10}}>
              <form onSubmit={handleSubmit} className='searchform' style={{display:'flex', alignItems:'center', justifyContent:'space-between',gap:10}}>
              <input name='name' onChange={(e)=>setName(e.target.value)} className='searchbar' placeholder='Заголовок учебника'/>
              <button onClick={handleSubmit} style={{border:'none', background:'transparent'}}> <img style={{height:40}} src='./search.png'/></button>

              </form>




        </div>

              
              </div>
              {materials && materials!=''? 
     <div class="book-container">
     <div class="book-box">
       {
materials.map((material)=>{
  
  return(
            <ChosenCard 
            key={material.pid}
            material={material}
           userinfo={userinfo}
            setLikedMat={setLikedMat}
             setMaterials={setMaterials}
             materials={materials}
          />
        )})}</div></div>:<div style={{display:'flex',flexDirection:'column', alignItems:'center',gap:8}}><span>Ничего не найдено</span><img style={{height:300}} src='./empty.jpg'/></div>}
   

  
   </div>
   


   <Footer/>
    </>
    
  )
}
else{
    return null
}
}

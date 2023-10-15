import React from 'react'
import Navbar from './components/Navbar'
import { useState,useEffect } from 'react';

import axios from 'axios';
import setUserInfo from './helpers/token';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import Footer from './components/Footer';
import BookCard from './components/BookCard';
import Link from 'next/link';
import MyCards from './components/MyCards';

export default function Books() {
  const [materials, setMaterials] = useState('');  
  const [disc, setDisc] = useState(null)
const router = useRouter()
  const [mountEvent,setMountEvent]=useState(false)
  const [liked,setLiked]=useState(false)
  const [likedMat,setLikedMat]=useState('')
const [name,setName]=useState('')


  let userinfo;
  const handleCat3 = (disc) => {
    console.log(disc)
    setDisc(disc);
  }
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

      
          
          const res = await axios.get(`http://localhost:8800/mymaterials/${userinfo.id}`,{params:{id:userinfo.id}});
     
          setMaterials(res.data[0]);
          setLikedMat(res.data[1]);

   

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
        const res = await axios.post(`http://localhost:8800/mymaterials/${userinfo.id}`,{params:{id:userinfo.id},name:name});
        setMaterials(res.data[0]);
        setLikedMat(res.data[1]);

         console.log("Data form",res.data)
      } catch (err) {
        console.log(err);
      }
    };
    
    const filterData = async () => {
      try {
        const res = await axios.post(`http://localhost:8800/searchmymaterials/${userinfo.id}`,{params:{id:userinfo.id},disc:disc});
        setMaterials(res.data[0]);
        setLikedMat(res.data[1]);

         console.log("Info: ",res.data)
      } catch (err) {
        console.log(err);
      }
    };
    if (materials){
      var ha = [...new Set(materials.map(c=>{return (c.discipline)}))]
   
    }
 


      axios.defaults.withCredentials = true;
      if (mountEvent){
        if (localStorage.token) {
          const jwt = localStorage.getItem("token");
          setUserInfo(jwt);
          userinfo = jwtDecode(jwt);
          console.log(userinfo)
      }
  return (
    <main>
        <Navbar/>
        <div style={{display:'flex', justifyContent:'center',gap:30}}> 
        
        <h1 style={{alignSelf:'center'}}>Совместное обучение - </h1>
        <img style={{alignSelf:'center'}} className='hero-image' src='./library.jpg'/>
        <h1 style={{alignSelf:'center'}}>умножение знаний</h1>


    </div>
    <div id="section" style={{display:'flex',flexDirection:'column'}}  className='all'>
     
        <Link  style={{color:'black', display:'flex',  alignItems:'center',gap:3}} href='/upload'>
          <img style={{height:30}} src="./plus.png"/>
        
        <p>Добавить учебник</p>
        </Link>  

      <div style={{display:'flex',justifyContent:'space-between'}}>
        
      <div style={{display:'flex', alignItems:'center',gap:12}}>
  
             
              <button onClick={filterData} style={{background:'transparent',border:'none'}}><img style={{height:60}} src="./filter.png"/></button>

              
                <span>Дисциплина</span>
                <div  className="selecti">
      
            
                <label>
              <select  name='disc'  value={disc} onChange={event => handleCat3(event.target.value)}>
              <option id="0"  onClick={()=>setDisc('')} >Не выбрано</option>
      
              {ha ? ha.map(c=>{return(<option onClick={()=>setDisc(c)} >{c}</option>)}) 
                :null}
                 
                </select>
                </label>
                </div>
               
                
               
              </div>
             

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
  var l=likedMat.filter(i=> i.projectid==material.pid)
  
  return(
            <MyCards
            key={material.pid}
            material={material}
           userinfo={userinfo}
            likedMat={l}
            setLikedMat={setLikedMat}
             setMaterials={setMaterials}
             materials={materials}
          />
        )})}</div></div>:<div style={{display:'flex',flexDirection:'column', alignItems:'center',gap:8}}><span>Ничего не найдено</span><img style={{height:300}} src='./empty.jpg'/></div>}
   

  
   </div>
   


   <Footer/>
    </main>
    
  )
}
else{
    return null
}
}

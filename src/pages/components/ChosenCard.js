import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import setUserInfo from '../helpers/token'
import jwtDecode from 'jwt-decode'
export default function ChosenCard({material,userinfo,materials,setMaterials}) {
  const [desc,setDesc]=useState(false)
  const pid=material.pid
  const [count,setCount]=useState(0)
  function toggleShow(){
    setDesc(curr=>!curr)
  }
    useEffect((userinfo) => {
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
        
      
          
          const res = await axios.get(`http://localhost:8800/likes/${material.pid}/${userinfo.id}`,{params:{userid:userinfo.id, id:material.pid}});
     
          setCount(res.data[0].num)
  
   
  
          
         
    
           console.log("Info: ",res.data[0].num)
        } catch (err) {
          console.log(err);
        }
      };
      requestData();
  
  
    }, []); 
   const router =useRouter()
  

   
  const deleteFavourite = async () => {
    try {

    
     
  


      
       const res = await axios.post(`http://localhost:8800/disliked/${material.pid}/${userinfo.id}`,{ id: material.pid, userid:userinfo.id});
       setMaterials(materials.filter(obj=>obj.pid!=material.pid))

    } catch (err) {
      console.log(err);
    }
  };
  return (
  
 <div className='bookcover' style={{display:'flex',flexDirection:'column', alignItems:'center' ,  padding:10, paddingTop:0}}>
  <Link href={material.project}><img style={{height:180}} src='../book.png'/></Link>
  <div style={{display:'flex', alignSelf:'flex-end'}}>

   <button style={{backgroundColor:'transparent', border:'none'}} onClick={()=>deleteFavourite()}><p><img className='book-image' src='../yellowstar.png'/></p></button>
      <p>Понравилось {count} людям</p>


  </div>
  {!desc?
  <div style={{display:'flex',flexDirection:'column',gap:10,margin:10,}}>
    <span style={{fontWeight:'bold',fontSize:18}}>{material.pname}</span>
    <span style={{fontStyle:'italic'}}>{material.authors}</span>
    <span> Предмет: {material.discipline}</span>


  </div>
  
  :    <span style={{fontStyle:'italic'}}>{material.comments}</span>
}
    <div style={{display:'flex', alignSelf:'flex-end'}}>
    <button onClick={()=>toggleShow()} className='book-button'><img className='book-image' src='../more.png'/></button>

    <small  style={{color:'grey', alignSelf:'flex-end',padding:10}}> {material.publish}</small>

  </div>


 </div>
 
  )
}

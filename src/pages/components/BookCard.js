import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import setUserInfo from '../helpers/token'
import jwtDecode from 'jwt-decode'
export default function BookCard({material,userinfo,likedMat,setMaterials,materials}) {
  const [desc,setDesc]=useState(false)
  const pid=material.pid
    const [like, setLike]=useState(false)
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
    if (likedMat.length>0)
    setLike(true)
  
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
   console.log(likedMat)
   const router =useRouter()
  
    const setPref = async () => {
      try {
      
          setLike(true)
          setCount(curr=>curr+1)
        
        
         const res=await axios.post(`http://localhost:8800/liked/${material.pid}/${userinfo.id}/${material.usid}`,{ id: material.pid, userid:userinfo.id, authorid:material.usid});
       
      } catch (err) {
        console.log(err);
      }
    };
    const setPref2 = async () => {
      try {
        setCount(curr=>curr-1)
  
      
       
     setLike(false)
  
  
        
         const res = await axios.post(`http://localhost:8800/disliked/${material.pid}/${userinfo.id}`,{ id: material.pid, userid:userinfo.id});
         
      } catch (err) {
        console.log(err);
      }
    };
   
  return (
  
 <div className='bookcover' style={{display:'flex',flexDirection:'column', alignItems:'center' ,  padding:10, paddingTop:0}}>
  <Link href={material.project}><img style={{height:120}} src='../book.png'/></Link>
  <div style={{display:'flex', alignSelf:'flex-end'}}>
  


  </div>
  {!desc?

    <div style={{display:'flex',flexDirection:'column',gap:10,margin:10,}}>
      <span style={{fontWeight:'bold',fontSize:18}}>{material.pname}</span>
      <span style={{fontStyle:'italic'}}>{material.authors}</span>
      <span> Предмет: {material.discipline}</span>


      <div style={{display:'flex',alignItems:'center', gap:3}}>       <p>Понравилось {count} людям</p>
   {!like ?  <button style={{backgroundColor:'transparent', border:'none'}} onClick={()=>setPref()}><p><img className='book-image' src='../star.png'/></p></button>:<button  style={{backgroundColor:'transparent', border:'none'}} onClick={()=>setPref2()}><p><img className='book-image' src='../yellowstar.png'/>  </p></button>}
  </div>
  
  
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

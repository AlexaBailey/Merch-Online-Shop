import React, { createRef } from 'react'
import Navbar from './components/Navbar';
import { useState,useEffect } from 'react';
import { useRef } from 'react';
import { ChangeEvent } from 'react';
import setUserInfo from './helpers/token';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Add() {
  const [mountEvent, setMountEvent] = useState(false);
  const [imgi, setImage] = useState<File>();

  const [author,setAuthor]= useState("")
  const [disc,setDisc]= useState("")
  const [name,setName]= useState("")
  const [comments,setComments]= useState("")
  let userinfo;

  const [linki,setLinki]= useState("")



      const refInput = useRef<HTMLInputElement | null>(null);
      const clickUpload = () => {
        refInput.current?.click();
       
      };
       

   
  const replaceImgi = (e) => {
    if (e.target.files && e.target.files.length > 0) {
     
      setImage(e.target.files[0]);
      
    }
    setSelectedFile(e.target.files[0]);
  };

  const removeImgi = () => {
    setImage(null);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const router=useRouter()
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile)
    formData.append('user',userinfo.id)

    
    formData.append('author',author)
    formData.append('disc',disc)
    formData.append('name',name) 
    formData.append('comments',comments) 


    formData.append('linki',linki)
    console.log(linki)
    formData.append('publish',new Date().toLocaleDateString())
    



    axios.post('http://localhost:8800/upload', formData)
      .then((response) => {
        console.log(response.data);
        router.push('/materials')
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
useEffect(() => {
  setMountEvent(true)
        if (localStorage.token) {
          const jwt = localStorage.getItem("token");
          setUserInfo(jwt);
          userinfo = jwtDecode(jwt);
          console.log(userinfo)
          console.log(userinfo.id)
      }
}, []);
if (mountEvent){
  if (localStorage.token) {
    const jwt = localStorage.getItem("token");
    setUserInfo(jwt);
    userinfo = jwtDecode(jwt);
    console.log(userinfo)
}
  
  return (
    <div>
        <Navbar/> 
      <div  style={{display:'flex', flexDirection:'column', alignItems:'center',}}>

  
  


    <h2  style={{textAlign:'center'}}>Добавить новый проект</h2>
        <div >

    <div style={{display:'flex',justifyContent:'space-between', gap:100}}>
    
<div>
  
<button id="b" style={{display:imgi&&"none", backgroundColor:'transparent', height:200, border:'none'}}  onClick={clickUpload}>
{!imgi &&  <img style={{height:150}}src='./upload.png'/>}
</button>
<input
type="file"
ref={refInput}
onChange={replaceImgi}
style={{ display: 'none' }}
/>
    {imgi && (
      <div className="image-view">
        <img style={{height:96}} src='./pdf.png'/>
      <p>{imgi.name}</p>
     
      
        <button className='send-button remove' onClick={removeImgi}>
          Удалить файл
        </button>
      </div>
  
    )}
      

</div>
<div style={{display:'flex', flexDirection:'column'}}>
  

  <img style={{height:150}} src="./link.png"/>
  <input name="linki" onChange={(e)=>setLinki(e.target.value)}  className='custom-input'  style={{ width:150,alignSelf:'center'}} />
</div>
      </div>
      </div>
   
<h2>Данные</h2>
  <form className='outer' onSubmit={handleSubmit} style={{display:'flex', gap:20,  flexDirection:'column', alignItems:'center'}}>
  <div>
  <p>Название файла</p>
  <input name="name"   className='custom-input' onChange={(e)=>setName(e.target.value)} placeholder=''/>


    <p>Автор</p>
    <input  name="author" onChange={(e)=>setAuthor(e.target.value)}  className='custom-input' placeholder='ФИО автора'/>
    <p>Дисциплина</p>
    <input className='custom-input'name="disc" onChange={(e)=>setDisc(e.target.value)}  placeholder='КПО, АИСД, ... '/>
    <p>Комментарии</p>
    <textarea className='custom-input'name="comments" onChange={(e)=>setComments(e.target.value)}  placeholder='Комметарий к работе'/>

  </div>
    <button className='send-button'  onClick={handleSubmit}>Сохранить</button>


    
   </form>


      
   </div>


   </div>
      


   
    
  )


}
else{
  return null
}
}
{/*
<div style={{display:'flex', justifyContent:'space-around'}}>
<div className='container'>
{!imgi &&  <div>Загрузить новый файл:</div>}



<button id="b" style={{display:imgi&&"none"}}  onClick={clickUpload}>
{!imgi &&  <img src="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/66/null/external-Upload-File-seo-smashingstocks-flat-smashing-stocks.png"/>}
</button>
<input
type="file"
ref={refInput}
onChange={replaceImgi}
style={{ display: 'none' }}
/>
    {imgi && (
      <div className="image-view">
        <h2>Детали файла</h2>
      <p>Название файла: {imgi.name}</p>
      <p>Тип файла: {imgi.type}</p>
      <p>Размер в байтах: {imgi.size}</p>
      
        <button className='remove-button' onClick={removeImgi}>
          Удалить файл
        </button>
      </div>
  
    )}

  </div>
  <div>

  



  </div>
  
 
  
</div>*/}

  
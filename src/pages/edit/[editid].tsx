import React, { createRef } from 'react'
import Navbar from '../components/Navbar';
import { useState,useEffect } from 'react';
import { useRef } from 'react';
import { ChangeEvent } from 'react';
import setUserInfo from '../helpers/token';
import jwtDecode from 'jwt-decode';
import axios, { AxiosRequestConfig } from 'axios';
import { useRouter } from 'next/router';
import Footer from '../components/Footer'

export default function Add() {

  const [mountEvent, setMountEvent] = useState(false);
  const [imgi, setImage] = useState<File>();
  const [info,setInfo]=useState(null)
  const [author,setAuthor]= useState("")
  const [disc,setDisc]= useState("")
  let userinfo;
  const [name,setName]= useState("")
  const [comments,setComments]= useState("")
  const router=useRouter()
  const {pid} = router.query
  useEffect(() => {
    setMountEvent(true)
    if (localStorage.token) {
      const jwt = localStorage.getItem("token");
      setUserInfo(jwt);
      userinfo = jwtDecode(jwt);
      console.log(userinfo)
  }
  
  
    
  
    const requestData = async () => {
      


      try {
        console.log(pid)
      

        const requestConfig: AxiosRequestConfig = {};
        requestConfig.data = { pid: pid };
        
        const res = await axios.get(`http://localhost:8800/edit/${pid}`, requestConfig);
   
        setInfo(res.data)
        console.log(info)
         console.log("Info: ",res.data)
      } catch (err) {
        console.log(err);
      }
    };
    requestData();
    

  }, []); 
     


  const [linki,setLinki]= useState("")



      const refInput = useRef<HTMLInputElement | null>(null);
      const clickUpload = () => {
        refInput.current?.click();
       
      };


   
  const replaceImgi = (e) => {
    if (e.target.files && e.target.files.length > 0) {
     
      setImage(e.target.files[0]);
      
    }
    setFile(e.target.files[0]);
  };

  const removeImgi = () => {
    setImage(null);
  };

  const [selectedFile, setFile] = useState(null);

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile)
    formData.append('user',userinfo.id)

    if (author==''){
      setAuthor(info.authors)
    }
    formData.append('author',author)
    if (disc==''){
      setDisc(info.discipline)
    }
    formData.append('disc',disc)
    if (name==''){
      setName(info.pname)
    }
    formData.append('name',name) 
    if (comments==''){
      setComments(info.comments)
    }
    formData.append('comments',comments) 


    formData.append('linki',linki)
    console.log(linki)
    formData.append('publish',new Date().toLocaleDateString())
    



    axios.post(`http://localhost:8800/edit/${pid}`, formData)
      .then((response) => {
        console.log(response.data);
        router.push('/materials')
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
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

  
  


    <h2  style={{textAlign:'center'}}>Изменить проект</h2>
        <div >

    <div style={{display:'flex',justifyContent:'space-between', gap:100}}>
    
<div>
  
<button id="b" style={{display:imgi&&"none", backgroundColor:'transparent', height:200, border:'none'}}  onClick={clickUpload}>
{!imgi &&  <img style={{height:150}}src='../upload.png'/>}
</button>
<input
type="file"

ref={refInput}
onChange={replaceImgi}
style={{ display: 'none' }}
/>
    {imgi && (
      <div className="image-view">
        <img style={{height:96}} src='../upload.png'/>
      <p>{imgi.name}</p>
     
      
        <button className='send-button remove' onClick={removeImgi}>
          Удалить файл
        </button>
      </div>
  
    )}
      

</div>
<div style={{display:'flex', flexDirection:'column'}}>
  

  <img style={{height:150}} src="../link.png"/>
  <input name="linki" onChange={(e)=>setLinki(e.target.value)}  className='custom-input'  style={{ width:150,alignSelf:'center'}} />
</div>
      </div>
      </div>
   
<h2>Данные</h2>
  <form className='outer' onSubmit={handleSubmit} style={{display:'flex', gap:20,  flexDirection:'column', alignItems:'center'}}>
  <div>
  {info ? 
  <>
<p>Название файла</p>
<input name="name" defaultValue={info.pname}  className='custom-input' onChange={(e)=>setName(e.target.value)}/>
  <p>Автор</p>
  <input  name="author" defaultValue={info.authors} onChange={(e)=>setAuthor(e.target.value)}  className='custom-input' placeholder='ФИО автора'/>
  <p>Дисциплина</p>
  <input className='custom-input'name="disc" defaultValue={info.discipline} onChange={(e)=>setDisc(e.target.value)}  placeholder='КПО, АИСД, ... '/>
  <p>Комментарии</p>
  <textarea className='custom-input'name="comments" defaultValue={info.comments} onChange={(e)=>setComments(e.target.value)}  placeholder='Комметарий к работе'/>

</>
  :null}

  </div>
    <button className='send-button'  onClick={handleSubmit}>Сохранить</button>


    
   </form>


      
   </div>
   <br/>

<Footer/>
   </div>

  )
}
else{
  return null
}
}

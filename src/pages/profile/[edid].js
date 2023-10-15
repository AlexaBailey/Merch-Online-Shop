import Head from 'next/head'
import axios from 'axios'
import { useEffect,useReducer,useState} from 'react';
import React from 'react'
import setUserInfo from '../helpers/token';
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik'



export default function EditProfile() {

const [details,setDetails]=useState("")




let tokUser;



 const router=useRouter()
 
    const formik = useFormik({

        initialValues: {
          
          email: "",
         
           fio:"",
          username:"",
          bio:""
    
        },
    
        onSubmit: async (values)=> {
    
          try {
            await axios.post(`http://localhost:8800/profile/${tokUser.id}`, values);
            router.push(`/profile/details/${tokUser.id}`)
       
          } catch (err) {
      
            setError(true)
    
        }
      },
      validate:values=>{
        let errors = {};
        const regex1 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regex2 = /^[A-Za-z][A-Za-z0-9_]{3,29}$/i;
        if (values.email){
          if (!regex1.test(values.email)) {
            errors.email = "Invalid email format";
          }
        }
  
        if (values.username) {
        if (values.username.length < 4) {
          errors.username = "Username must be more than 4 characters";
          }
          else if (!regex2.test(values.username)){
          errors.username = "Start with letters, exclude symbols"
          }
        }
        
        return errors;
      }
    
      
      })
    



  

    const [mount,setmount]=useState(false)
    useEffect((tokUser) => {
        setmount(true)
        if (localStorage.token) {
          const jwt = localStorage.getItem("token");
          setUserInfo(jwt);
          tokUser = jwtDecode(jwt);
          console.log(tokUser)
          console.log(tokUser.id)
      }
        const getData = async () => {
          
   

          try {
            console.log("id",tokUser.id)
           
            
            const res = await axios.get(`http://localhost:8800/profile/details/${tokUser.id}`,{params:{id:tokUser.id}});
              setDetails(res.data)  
              console.log("Data",res.data)
          } catch (err) {
            console.log(err);
          }
        };
        getData();
    

      }, []); 
      if (mount){
        if (localStorage.token) {
          const jwt = localStorage.getItem("token");
          setUserInfo(jwt);
          tokUser = jwtDecode(jwt);
          console.log(tokUser)
      }
   
    return (
    
        <div className='profile-body'>
            <div className='profile-box'>
                <div className='profile-left'>
                    <img src='../../profile.png'/>
                    <Link href={`/profile/${tokUser.id}`}><img src='../../edprof.png'/></Link>

                </div>
                {details&& details.map((detail)=>{
                  return(
                    <>

                    <form className='profile-right' onSubmit={formik.handleSubmit}>
                       <div style={{display:'flex', flexDirection:'column'}}>
              
                       <div style={{display:'flex',flexDirection:'column',margin:20}}>
                       <span className='p-f'>Имя пользователя</span>
                       <input placeholder={detail.username}  name='username'  className='custom-input'  onChange={formik.handleChange} onBlur={formik.handleBlur}
       value={formik.values.username}/>
{formik.errors.username ? <p className="error" >
                 {formik.errors.username }
               </p>:null}
               </div>
               <div style={{display:'flex',flexDirection:'column',margin:20}}>
               <span className='p-f'>E-mail</span>
               <input placeholder={detail.email} name='email' className='custom-input' onChange={formik.handleChange}
       value={formik.values.email}/>
{formik.errors.email ? <p className="error" >
                 {formik.errors.email }
               </p>:null}                </div>
               <div style={{display:'flex',flexDirection:'column',margin:20}}>
                       <span className='p-f'>Фамилия Имя</span>
                       <input name='fio' placeholder={detail.fio}  className='custom-input' onChange={formik.handleChange} onBlur={formik.handleBlur}
       value={formik.values.fio}/>
              <Link href={`/profile/details/${detail.id}`}><img  style={{height:40, marginTop:10}} src='../../home.png'/></Link>

                       </div>
             

           
              </div>

                    <div style={{display:'flex',flexDirection:'column',margin:20, }}>
              <span className='p-f'>Био</span>
              <textarea placeholder={detail.bio}  name='bio' className='custom-input'  onChange={formik.handleChange} 
       value={formik.values.bio}/>
              <button style={{marginTop:30}} className='send-button' onSubmit={formik.handleSubmit}>Отправить</button>


                       
                  
             
        

                   </div>
           
              </form>

            
                   
                   
                   </>
               

                  )
                })}

                  
            
                           </div>
        </div>
    
      
    
  )
}
else{
    return null
}
}
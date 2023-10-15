import Link from 'next/link'
import React from 'react'
import axios from "axios";
import { useRouter } from 'next/router'
import { useFormik } from 'formik';
const Login=()=> {


  const router = useRouter()
  axios.defaults.withCredentials =true
  const formik = useFormik({

    initialValues: {

      nickname: '',

      password: '',

    },

    onSubmit: async (values)=> {

      try {
        const {data} = await axios.post("http://localhost:8800/login", values)
        localStorage.setItem("token", data);
      
      
        router.push('/')
        
       
   
      } catch (err) {
  

    }
  },
  validate:values=>{
    let errors = {};
    const regex2 = /^[A-Za-z][A-Za-z0-9_]{3,29}$/i;
    const regex3 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i;
    if (!values.nickname) {
      errors.nickname = "Не может быть пустым";
    } else if (values.nickname.length < 4) {
      errors.nickname = "Слишком короткое имя пользователя";
    }
    else if (!regex2.test(values.nickname)){
      errors.nickname = "Начните с букв. Символы исключите"
    }
    if (!values.password) {
      errors.password = "Не может быть пустым";
    } else if (values.password.length < 7) {
      errors.password = "Слишком короткий пароль";
    }
    else if (!regex3.test(values.password)){
      errors.password = "Используйте заглавные и строчные буквы, цифры и символы";

    }
    return errors;
  }
})


// Creating schema


  
 
  return (
   
          <div className='login'>
        <div className='login-left'>

        </div>
        <div className='login-right'>
        <form className='loginform' onSubmit={formik.handleSubmit} > 
      <h1 className='title'>Войти в аккаунт</h1>
      <h3>Имя пользователя</h3>
      <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
                  value={formik.values.nickname} placeholder='Введите имя' name="nickname"/>
       {formik.errors.nickname ? <p className="error" >
                  {formik.errors.nickname}
                </p> :null}
      <h3>Пароль</h3>
      <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
                  value={formik.values.password} placeholder='Введите пароль' name="password"/>
                  {formik.errors.password ? <p className="error">
                  {formik.errors.password}
                </p> :null} 
      <button className='login-button' type='submit' onClick={formik.handleSubmit}>Отправить</button>
      <div className='yet'>
      <span>Еще не участник? </span>
      <Link style={{color:'#a16a2c'}} href="/signup" >Зарегистрироваться</Link>

      </div>
     
    </form>
        </div>
      </div>

    
  
     

    
     
   
   
    
  )
}
export default Login;

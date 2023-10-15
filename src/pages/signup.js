import Link from 'next/link'
import React, { useState } from 'react'

import axios from 'axios'
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Router, useRouter } from 'next/router';
export default function Signup() {

  axios.defaults.withCredentials = true;


const router=useRouter()
  const formik = useFormik({

    initialValues: {

      nickname: '',

      email: '',

      password: '',
      fio:'',



    },

    onSubmit: async (values)=> {

      try {
        await axios.post("http://localhost:8800/signup", values);
        router.push('/login')
   
      } catch (err) {
  

    }
  },
  validate:values=>{
    let errors = {};
    const regex1 = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regex2 = /^[A-Za-z][A-Za-z0-9_]{3,29}$/i;
    const regex3 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i;
    if (!values.email) {
      errors.email = "Не может быть пустым";
    } else if (!regex1.test(values.email)) {
      errors.email = "Неверный формат почты";
    }
    if (!values.nickname) {
      errors.nickname = "Не может быть пустым";
    } else if (values.nickname.length < 4) {
      errors.nickname = "Слишком короткое имя пользователя";
    }
    else if (!regex2.test(values.nickname)){
      errors.nickname = "Начните с букв. Символы исключите";
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

  
  }
)


  return (
  
    <div className='login'>
    <div className='signup-left'>

    </div>
    <div className='signup-right'>
    <form className='loginform sig' onSubmit={formik.handleSubmit} > 
  <h1 className='title'>Создайте аккаунт</h1>
  <h3>Имя пользователя</h3>
  <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
              value={formik.values.nickname} placeholder='Создайте имя пользователя' name="nickname"/>
   {formik.errors.nickname ? <small className="error" >
              {formik.errors.nickname}
            </small> :null}
            <h3>Фио</h3>
  <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
              value={formik.values.fio} placeholder='Введите ФИО' name="fio"/>
  

            <h3>Email</h3>
  <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
              value={formik.values.email} placeholder='Введите email' name="email"/>
   {formik.errors.email ? <small className="error" >
              {formik.errors.email}
            </small> :null}
  <h3>Пароль</h3>
  <input className='special-input' onChange={formik.handleChange}  onBlur={formik.handleBlur}
              value={formik.values.password} placeholder='Создайте пароль' name="password"/>
              {formik.errors.password ? <small className="error">
              {formik.errors.password}
            </small> :null} 
           
  <button className='login-button sig' type='submit' onClick={formik.handleSubmit}>Отправить</button>
  <div className='yet'>
  <span>Уже участник? </span>
      <Link  style={{color:'#a16a2c'}} href="/login" className='sign'>Войти</Link>
     

  </div>
 
</form>
    </div>
  </div>
   
    
  )
}

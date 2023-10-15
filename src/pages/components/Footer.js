import React from 'react'

export default function Footer() {
  return (
    <div className='footer'>
        <div style={{display:'flex',alignItems:'center', gap:3}}>
      <img style={{height:36}} src='../planet2.png'/>
        <h3 style={{color:'white'}}>LabSpace</h3>
      </div>
      <h2>Погрузись в мир знаний вместе с нами!</h2>
      <small>LabSpace.All rights reserved.Developed by Buvin&Veigandt</small>
    </div>
  )
}

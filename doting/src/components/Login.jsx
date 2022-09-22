import React from 'react'
import './Login.scss'
import {Container,Button,Card,Input} from '@mui/material'
const Login = () => {

  const submitHandle = () =>{

         
  }


  return (
       <div className="main">
        <span>Doting</span>
        <Card className='container'>
              <div className="forms">
                    <h3>Login</h3>
                     <form action="">
                        <Input placeholder='Email' onSubmit={(e)=>submitHandle(e.target.value)}></Input>
                        <br/>
                        <Input placeholder='Password'></Input>
                        <Button>login</Button>
                     </form>

              </div>
         
        </Card>
          <span><a href="">forget Password?</a></span>

     </div>
  )
}

export default Login
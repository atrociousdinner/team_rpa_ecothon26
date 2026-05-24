import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
const Logout = () => {
  const {setUser} = useAuthContext()
  const navigate = useNavigate()
  useEffect(()=>{
    const handleLogout = async ():Promise<void> => {
      try{
        await fetch('/api/logout')
        await signOut(auth)
        
        setUser({
          isLoggedIn:false,
          userId:'',
          email:'',
          photoURL:'',
          displayName:'',
          gender:'',
          createdAt:'',
          dob:''
        })

        navigate('/login')
      }
      catch(err){
        console.error(err)
      }
    }
    handleLogout()
  },[])

  return <div></div>
}

export default Logout

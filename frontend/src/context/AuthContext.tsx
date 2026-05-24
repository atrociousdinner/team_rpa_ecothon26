import { onAuthStateChanged } from 'firebase/auth'
import type { Unsubscribe } from 'firebase/auth'
import { auth } from '../firebase'
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  isLoggedIn:boolean,
  userId:string,
  email:string,
  photoURL:string,
  displayName:string,
  gender:string,
  createdAt:Date|string,
  dob:Date|string
  //more to add
}

type UserContext = {
  user:User,
  setUser:React.Dispatch<React.SetStateAction<User>>,
  loading:boolean
}

const AuthContext = createContext<UserContext|null>(null)

export const useAuthContext = ():UserContext|null => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({children}:{children:React.ReactNode}) => {

  const [user,setUser] = useState<User>(
    {
      isLoggedIn:false,
      userId:'',
      email:'',
      photoURL:'',
      displayName:'',
      gender:'',
      createdAt:'',
      dob:''
    })
  const [loading,setLoading] = useState<boolean>(true)

  useEffect(()=>{
    let unsubscribe:Unsubscribe
    let count =0
    const checkAuth = async ():Promise<void> => {
      try{
        const response = await fetch('/api/auth',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // empty JSON body
        }) 
        const data = await response.json()
        if(data.login){
          setUser(
            {
              isLoggedIn:true,
              userId:data.userId,
              email:data.email,
              photoURL:data.photoURL,
              displayName:data.displayName,
              gender:data.gender,
              createdAt:data.createdAt,
              dob:data.dob
            })
        }
        else{
          count=1
          unsubscribe = onAuthStateChanged(auth,async (currUser) => {
            if(currUser?.email){
              const token = await currUser.getIdToken()
              const response = await fetch('/api/auth',{
                method:'POST',
                headers:{
                  'Content-type':'application/json'
                },
                body:JSON.stringify({token})
              }) 
              const data = await response.json()
              if(data.login){
                 setUser({
                  isLoggedIn:true,
                  userId:data.userId,
                  email:data.email,
                  photoURL:data.photoURL,
                  displayName:data.displayName,
                  gender:data.gender,
                  createdAt:data.createdAt,
                  dob:data.dob
                })
              }else{
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
              } 

            }else{
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
            }
          })
        }
      }
      catch(err){
        console.error(err)
      }
      finally{
        setLoading(false)
      }
    }
    checkAuth()
    if(count) return ()=>unsubscribe()
  },[user.isLoggedIn])


  return <AuthContext.Provider value={{user,setUser,loading}}>
    {children}
  </AuthContext.Provider>
}
const generateOTP = ():number => {
  let random:number = Math.random() 
  
  random = 100000 + Math.floor(random*900000)

  return random
}

export default generateOTP

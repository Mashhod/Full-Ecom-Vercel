// import React, { createContext, useReducer } from 'react'
// import { reducer } from './Reducer';


// export const GlobalContext = createContext("Initial Value");
// console.log(
//     'initial'
// )

// let data = {
//     user: {},
//     isLogin: null,
//     baseUrl: 'http://localhost:5004/api/v1'
// }

// export default function ContextProvider({ children }) {
//     const [state, dispatch] = useReducer(reducer, data)
//     return (
//         <GlobalContext.Provider value={{ state, dispatch }}>
//             {children}
//         </GlobalContext.Provider>
//     )
// }

import React, { createContext, useEffect, useReducer } from 'react'
import { reducer } from './Reducer';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'


console.log(
    'initial'
)

let data = {
    user: {},
    isLogin: null,
    isLoading:true,
    baseUrl: 'http://localhost:5004/api/v1'
}

export const GlobalContext = createContext(data);
console.log('global ', GlobalContext);

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)

    // useEffect(()=>{
    //     dispatch("IS_LOADING")
    //     let token = Cookies.get("Token")
    //     console.log(token)
    // }, [])

     useEffect(() => {
        dispatch({type: "IS_LOADING"})
        const token = localStorage.getItem("Token")
        if(token){
            try{
                const decoded = jwtDecode(token)
                if (decoded.exp * 1000 > Date.now()) {
                    console.log("Hello", decoded);
                    dispatch({
                        type: "USER_LOGIN",
                        payload: { user:decoded, isLogin: true, isLoading: false }
                    })
                }
                else{
                localStorage.removeItem('Token')
                dispatch({
                    type: 'USER_LOGOUT',
                    payload: { isLoading: false }
                })
              }
            }
            catch(error){
                localStorage.removeItem("Token")
                dispatch({type:"USER_LOGOUT", payload: { isLoading: false }})
            }
        }
        else{
            localStorage.removeItem("Token")
            dispatch({type: "USER_LOGOUT", payload: { isLoading: false }})
        }

        
    // const isLoggedIn:isLoggedIn  = (localStorage.getItem("isLoggedIn") === "1")
        
    // }
  }, []) 
  

    // if(state.isLoading) {
    //     return <div className="h-screen flex justify-center items-center">Loading...</div>
    // }
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}
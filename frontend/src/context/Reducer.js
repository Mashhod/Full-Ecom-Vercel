export const reducer = (state, action) => {
  console.log('action: ', action)
  console.log(':state: ', state)
    switch (action.type) {
      case "IS_LOADING":{
        return { ...state, isLoading:true}
      }
      case "STOP_LOADING":{
        return { ...state, isLoading:false}
      }
      case "USER_LOGIN": {
        // return {
        //   ...state, isLogin:true, user: action.user,
          
        //   isLoading: action.isLoading ?? false
        // }
         const _action = action?.payload || action; 
         console.log(_action, ' action USERLOGIN');
         
        return {
          ...state,
           user: _action.user,
           isLogin: _action.isLogin ?? true,
           isLoading: _action.isLoading ?? false,
        }
      }
      case "USER_LOGOUT": {
        return {
          ...state, isLogin: false , user: {}, 
           isLoading: action.payload?.isLoading ?? false,
      }
      }
      default: {
        return state
      }
    }
}
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch  } from './src/redux/store';
import StackNavigator from './src/router/StackNavigator';
import { restoreAuthState } from './src/redux/slices/auth/authThunk';
//import { useSelector } from 'react-redux';

export const Main = () => {
  //const { user,status } = useSelector((state: RootState) => state.auth);
    
  const dispatch = useDispatch<AppDispatch>()
    

  useEffect(() => {
    dispatch(restoreAuthState());    
  }, [dispatch]);
  
  return <StackNavigator />;

};

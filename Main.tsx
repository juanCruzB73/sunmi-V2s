import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './src/redux/store';
import { restoreAuthState } from './src/redux/slices/authThunk';
import StackNavigator from './src/router/StackNavigator';
import { useSelector } from 'react-redux';

export const Main = () => {
const { user,status } = useSelector((state: RootState) => state.auth);
    
    const dispatch = useDispatch<AppDispatch>()
    

    useEffect(() => {
      dispatch(restoreAuthState());
    }, [user,status]);
  
    return <StackNavigator />;
}

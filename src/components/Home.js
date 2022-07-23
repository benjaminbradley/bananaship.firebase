import Box from '@mui/material/Box';
import { useUserContext } from '../lib/UserContext';
import Motd from './Motd';

const Home = () => {
  const { userState } = useUserContext();
  console.log("Home: userState", userState)
  return (
    <Box>
      <Motd/>
      {userState?.currentUser ?
        `You are logged in as ${userState?.currentUser?.email}`
      :
        `you need to sign in`
      }
    </Box>
  )
};
export default Home;
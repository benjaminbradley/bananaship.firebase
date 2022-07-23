import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RocketIcon from '@mui/icons-material/Rocket';
import { useUserContext } from '../lib/UserContext';
import { cleanEmail } from '../lib/myFireDB';
import Motd from './Motd';

const Home = () => {
  const { userState } = useUserContext();
  console.log("Home: userState", userState)
  return (
    <Box>
      <Motd/>
      <Box sx={{
        display: 'inline-block',
        border: '2px solid black',
        marginTop: '50px',
      }}>
      <List>
        <ListItem disablePadding>
          <Link to={`/users/${cleanEmail(userState?.currentUser?.email || '')}/navy`}>
            <ListItemButton>
              <ListItemIcon>
                <RocketIcon />
              </ListItemIcon>
              <ListItemText primary="My Navy" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      </Box>
    </Box>
  )
};
export default Home;
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import RocketIcon from '@mui/icons-material/Rocket';
import { useUserContext } from '../lib/UserContext';
import { cleanEmail } from '../lib/myFireDB';
import Motd from './Motd';

function MyListItem({path, label, icon}) {
  return <ListItem disablePadding>
    <Link to={path}>
      <ListItemButton>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </Link>
  </ListItem>;
}

const Home = () => {
  const { userState } = useUserContext();
  return (
    <Box>
      <Motd/>
      <Box sx={{
        display: 'inline-block',
        border: '2px solid black',
        marginTop: '50px',
      }}>
      <List>
        <MyListItem
          path={`/users/${cleanEmail(userState?.currentUser?.email || '')}/navy`}
          label={'My Navy'}
          icon={<RocketIcon/>}
        />
        <MyListItem
          path={`/users/${cleanEmail(userState?.currentUser?.email || '')}/fleets`}
          label={'My Fleets'}
          icon={<ConnectingAirportsIcon/>}
        />
      </List>
      </Box>
    </Box>
  )
};
export default Home;
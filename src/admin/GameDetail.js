import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { set, ref, get, child } from 'firebase/database';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { db } from '../lib/myFirebase';
import { useUserContext } from '../lib/UserContext';

const GameDetail = () => {
  const { userState } = useUserContext();
  const [isEditMode, setEditMode] = useState(false);
  const [turnNum, setTurnNum] = useState(null);

  const currentTurnPath = `/games/default/currentTurn`;

  function reloadData() {
    get(child(ref(db), currentTurnPath)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("DEBUG: got data", data)
        if (data) {
          setTurnNum(data?.public?.turnNum)
        }
      }
    }).catch((error) => {
      console.error('Error reading currentTurn:', error);
    });
  }

  useEffect(() => {
    reloadData();
  }, []);

  function saveCurrentTurn() {
    setEditMode(false);
    set(ref(db, currentTurnPath), {
      public: {
        turnNum,
      }
    })
    .then(() => {
      toast.success("Successfully updated current turn.");
    })
    .catch((error) => {
      console.log("Error updating currentTurn:", error);
    });
  }

  return (
    <Box className="GameDetail">
      <Typography variant="h6" component="h4">
        Current game state
      </Typography>
      <List>
        <ListItem disablePadding>
          {isEditMode ?
            <>
              <TextField id="turnNum" label="Current turn number" variant="outlined"
                value={turnNum}
                onChange={e => setTurnNum(e.target.value)}
                sx={{width: 500}}
              />
              <ListItemButton>
                <Button onClick={() => {setEditMode(false);reloadData();}} startIcon={<CancelIcon/>}>Cancel</Button>
              </ListItemButton>
              <ListItemButton>
                <Button onClick={saveCurrentTurn} startIcon={<CheckIcon/>}>Save</Button>
              </ListItemButton>
            </>
          :
            <>
              <ListItemText primary={`Turn number: ${turnNum}`}/>
              {userState?.admin &&
                <ListItemButton>
                  <ListItemIcon>
                    <EditIcon onClick={() => setEditMode(true)}/>
                  </ListItemIcon>
                </ListItemButton>
              }
            </>
          }
        </ListItem>
      </List>
    </Box>
  )
};
export default GameDetail;
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { set, ref, get, child } from 'firebase/database';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { db } from '../lib/myFirebase';
import { getCurrentTurn, currentTurnPath, turnPath, getTurnDetail } from '../lib/myFireDB';
import { useUserContext } from '../lib/UserContext';

const TURNSTATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
};

const GameDetail = () => {
  const { userState } = useUserContext();
  const [isEditMode, setEditMode] = useState(false);
  const [turnNum, setTurnNum] = useState(null);
  const [turnStatus, setTurnStatus] = useState('');

  function reloadCurrentTurn() {
    getCurrentTurn({admin: true})
    .then((currentTurn) => {
      if (currentTurn)
        setTurnNum(currentTurn.public.turnNum);
      else console.log("Warning: no currentTurn");
    }).catch((error) => {
      console.error('Error reading currentTurn:', error);
    });
  }

  useEffect(() => {
    reloadCurrentTurn();
  }, []);

  function reloadTurnDetail() {
    if (!turnNum) return;
    getTurnDetail({admin: true, turnNum})
    .then((turnDetail) => {
      if (turnDetail)
        setTurnStatus(turnDetail?.public?.status);
      else console.log(`No turnDetail for turn ${turnNum}`);
    }).catch((error) => {
      console.error('Error reading turn detail:', error);
    });
  }

  useEffect(() => {
    reloadTurnDetail();
  }, [turnNum]);


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

  function saveTurnDetail() {
    setEditMode(false);
    set(ref(db, turnPath(turnNum)), {
      public: {
        status: turnStatus,
      }
    })
    .then(() => {
      toast.success(`Successfully updated turn #${turnNum}.`);
    })
    .catch((error) => {
      console.log("Error updating turn:", error);
    });
  }

  function cancelEdit() {
    setEditMode(false);
    reloadCurrentTurn();
    reloadTurnDetail();
  }

  return (
    <Box className="GameDetail">
      <Typography variant="h6" component="h4">
        Current game state
        {isEditMode ?
          <>
            <Button onClick={cancelEdit} startIcon={<CancelIcon/>}>Cancel</Button>
            <Button onClick={() => {saveCurrentTurn(); //TODO: break up, turn switcher vs editing turn detail
              saveTurnDetail();}} startIcon={<CheckIcon/>}>Save</Button>
          </>
        :
          userState?.admin &&
            <EditIcon onClick={() => setEditMode(true)}/>
        }
      </Typography>
      <List>
        <ListItem disablePadding>
          {isEditMode ?
            <TextField id="turnNum" label="Current turn number" variant="outlined"
              value={turnNum}
              onChange={e => setTurnNum(e.target.value)}
              sx={{width: 500}}
            />
          :
            <ListItemText primary={`Turn number: ${turnNum}`}/>
          }
        </ListItem>
        <Divider component="li" />
        <ListItem disablePadding>
          <ListItemText primary={`Details for turn number: ${turnNum}`}/>
        </ListItem>
        <ListItem disablePadding>
          {isEditMode ?
            <FormControl fullWidth>
              <InputLabel id="turnStatus-select-label">Turn status</InputLabel>
              <Select id="turnStatus-select" label="Turn status" labelId="turnStatus-select-label"
                value={turnStatus}
                onChange={(e) => setTurnStatus(e.target.value)}
              >
                <MenuItem value="">-unset-</MenuItem>
                {Object.entries(TURNSTATUS).map(([value, label]) =>
                  <MenuItem value={value} key={`turn${turnNum}_status_${value}`}>{label}</MenuItem>
                )}
              </Select>
            </FormControl>
          :
            <ListItemText primary={`Turn status: ${TURNSTATUS[turnStatus] ?? ''}`}/>
          }
        </ListItem>
      </List>
    </Box>
  )
};
export default GameDetail;
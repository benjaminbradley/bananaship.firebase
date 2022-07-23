import { useState } from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { addUser } from '../lib/myFireDB';

const UserForm = ({
  closeModal,
  onSuccess,
} = {}) => {
  const [email, setEmail] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const doSave = () => {
    setIsSaving(true);
    console.log("doing save...");
    addUser({
      email,
      userData: {
        adminonly: {
          adminAddedAt: Math.floor((new Date()).getTime() / 1000),
        }
      },
      onSuccess: () => {
        setIsSaving(false);
        closeModal();
        onSuccess();
      },
    });
  };

  return (
    <Box className='UserForm'>
      <TextField id="email" label="Enter the Email" variant="outlined"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <LoadingButton loading={isSaving} variant="outlined" onClick={doSave}>
        Save
      </LoadingButton>
    </Box>
  )
};
export default UserForm;

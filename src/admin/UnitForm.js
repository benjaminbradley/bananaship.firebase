import { useState } from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { v4 as uuid } from 'uuid';
import { saveUnit } from '../lib/myFireDB';

const UnitForm = ({
  userId,
  formData,
  closeModal,
  onSuccess,
} = {}) => {
  const [name, setName] = useState(formData?.name);
  const [position, setPosition] = useState(formData?.position);
  const [isSaving, setIsSaving] = useState(false);

  const doSave = () => {
    setIsSaving(true);
    console.log("doing save...");
    saveUnit({
      userId,
      unitId: formData?.id || uuid(),
      unitData: {
        name,
        position,
      },
      onSuccess: () => {
        setIsSaving(false);
        closeModal();
        onSuccess();
      },
    });
  };

  return (
    <Box className='UnitForm'>
      <TextField id="name" label="Unit name" variant="outlined"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <TextField id="position" label="Position" variant="outlined"
        value={position}
        onChange={e => setPosition(e.target.value)}
      />
      <LoadingButton loading={isSaving} variant="outlined" onClick={doSave}>
        {formData?.id ? 'Save' : 'Add'}
      </LoadingButton>
    </Box>
  )
};
export default UnitForm;

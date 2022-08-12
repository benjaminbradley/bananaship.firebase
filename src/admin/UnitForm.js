import { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { v4 as uuid } from 'uuid';
import { useGameContext } from '../lib/GameContext';
import { saveUnit } from '../lib/myFireDB';

const UnitForm = ({
  userId,
  formData,
  closeModal,
  onSuccess,
  nameEditable = true,
  showPosition = true,
  overrideSaveUnit = null,
} = {}) => {
  const {gameState} = useGameContext();
  const [name, setName] = useState(formData?.name);
  const [position, setPosition] = useState(formData?.position);
  const [fleetId, setFleetId] = useState(formData?.fleetId || '');
  const [isSaving, setIsSaving] = useState(false);

  const doSave = () => {
    setIsSaving(true);
    const unitData = {
      name,
      position,
    };
    if (fleetId !== '')
      unitData.fleetId = fleetId;
    const saveParams = {
      userId,
      unitId: formData?.id || uuid(),
      unitData,
      onSuccess: () => {
        setIsSaving(false);
        closeModal();
        onSuccess();
      },
    };
    if (overrideSaveUnit) {
      overrideSaveUnit(saveParams);
    } else {
      saveUnit(saveParams);
    }
  };

  return (
    <Box className='UnitForm'>
      <TextField id="name" label="Unit name" variant="outlined"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={!nameEditable}
      />
      {showPosition &&
        <TextField id="position" label="Position" variant="outlined"
          value={position}
          onChange={e => setPosition(e.target.value)}
        />
      }
      <FormControl fullWidth>
        <InputLabel id="fleet-select-label">Fleet</InputLabel>
        <Select id="fleet-select" label="Fleet" labelId="fleet-select-label"
          value={fleetId}
          onChange={(e) => setFleetId(e.target.value)}
        >
          <MenuItem value="">-None-</MenuItem>
          {Object.entries(gameState?.fleets?.[userId] || {}).map(([fleetId, fleetData]) =>
            <MenuItem key={fleetId} value={fleetId}>{fleetData.name}</MenuItem>
          )}
        </Select>
      </FormControl>
      <LoadingButton loading={isSaving} variant="outlined" onClick={doSave}>
        {formData?.id ? 'Save' : 'Add'}
      </LoadingButton>
    </Box>
  )
};
export default UnitForm;

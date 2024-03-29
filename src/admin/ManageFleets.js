import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useGameContext, refreshFleets } from '../lib/GameContext';
import { useUserContext } from '../lib/UserContext';
import { saveFleet, getFleetsPath } from '../lib/myFireDB';
import DataManager from './DataManager';

const FleetForm = ({
  userId,
  formData,
  closeModal,
  onSuccess,
} = {}) => {
  const { gameDispatch } = useGameContext();
  const { userState } = useUserContext();
  const [name, setName] = useState(formData?.name);
  const [position, setPosition] = useState(formData?.position);
  const [isSaving, setIsSaving] = useState(false);

  const doSave = () => {
    setIsSaving(true);
    saveFleet({
      userId,
      id: formData?.id || uuid(),
      data: {
        name,
        position,
      },
      onSuccess: () => {
        setIsSaving(false);
        closeModal();
        onSuccess();
        refreshFleets({
          email: userId,
          gameDispatch,
        });
      },
    });
  };

  return (
    <Box className='FleetForm'>
      <TextField id="name" label="Fleet name" variant="outlined"
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


const ManageFleets = ({
} = {}) => {
  const { userId } = useParams();

  const convertDataToRows = (data) => {
    const rowData = [];
    for (const [unitGuid, unitData] of Object.entries(data)) {
      rowData.push({
        ...unitData,
        id: unitGuid
      });
    }
    return rowData;
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'position', headerName: 'Current Position', width: 150 },
  ];

  return (
    <Box>
      <Typography variant="h6" component="h2">
        {userId}'s Fleets
      </Typography>
      <DataManager
        rowType="fleet"
        getRowLabel={(row) => `fleet (${row.name})`}
        columns={columns}
        getDataPath={getFleetsPath({userId})}
        convertDataToRows={convertDataToRows}
        deleteRow={null}
        userId={userId}
        EditForm={FleetForm}
      />
    </Box>
  )
};

export default ManageFleets;

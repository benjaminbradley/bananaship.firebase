import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getNavyPath, deleteUnit } from '../lib/myFireDB';
import { useGameContext } from '../lib/GameContext';
import DataManager from './DataManager';
import UnitForm from './UnitForm';

const ManageNavy = ({
} = {}) => {
  const {gameState} = useGameContext();
  const { userId } = useParams();

  function getFleetName(fleetId) {
    const fleetName = gameState?.fleets?.[userId]?.[fleetId]?.name || fleetId;
    return fleetName;
  }

  const convertDataToRows = (data) => {
    const rowData = [];
    for (const [unitGuid, unitData] of Object.entries(data)) {
      rowData.push({
        ...unitData,
        fleetName: getFleetName(unitData.fleetId),
        id: unitGuid,
      });
    }
    return rowData;
  };

  const deleteRow = (row, context) => {
    deleteUnit({
      userId,
      unitId: row.id,
      onSuccess: context.onSuccess,
    })
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'position', headerName: 'Current Position', width: 170 },
    { field: 'fleetName', headerName: 'Fleet', width: 170 },
  ];

  return (
    <Box>
      <Typography variant="h6" component="h2">
        {userId}'s Navy
      </Typography>
      <DataManager
        rowType="unit"
        getRowLabel={(row) => `unit (${row.name})`}
        columns={columns}
        getDataPath={getNavyPath({userId})}
        convertDataToRows={convertDataToRows}
        deleteRow={deleteRow}
        userId={userId}
        EditForm={UnitForm}
      />
    </Box>
  )
};
export default ManageNavy;

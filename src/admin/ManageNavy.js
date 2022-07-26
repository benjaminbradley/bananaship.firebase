import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { deleteUnit } from '../lib/myFireDB';
import DataManager from './DataManager';
import UnitForm from './UnitForm';

const ManageNavy = ({
} = {}) => {
  const { userId } = useParams();
  const dbPaths = {
    list: `games/default/${userId}/navy`,
  }

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

  const deleteRow = (row, context) => {
    deleteUnit({
      userId,
      unitId: row.id,
      onSuccess: context.onSuccess,
    })
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'position', headerName: 'Current Position', width: 170 },
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
        dbPaths={dbPaths}
        convertDataToRows={convertDataToRows}
        deleteRow={deleteRow}
        userId={userId}
        EditForm={UnitForm}
      />
    </Box>
  )
};
export default ManageNavy;

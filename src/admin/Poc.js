import { useState } from 'react';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';

const Poc = () => {
  const [isEditable, setIsEditable] = useState(false);
  return <div>
    <input type="button" onClick={() => setIsEditable(true)} value="break me"/>
    <DataGrid experimentalFeatures={{ newEditingApi: isEditable }}
    columns={[{
      field: 'id', headerName: 'ID'
    }]}
    rows={[{
      id: 1
    }]}
  />
  </div>
}
export default Poc;
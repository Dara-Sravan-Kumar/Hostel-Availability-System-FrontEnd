import { Button, Box, Snackbar } from '@blotoutio/ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalState } from '../../../util/useLocalStorage';
import AdminDashboard from '../dashboard/AdminDashboard';
import { Welcome } from '../dashboard/style';
import AdminRoomTypeForm from './AdminRoomTypeForm'; 
import { addRoomTypeInit } from './data';
import { Wrapper } from './style';

const AdminRoomTypeAdd = () => {
  const [roomtypes, setRoomTypes] = useState();
  const [jwt, setJwt] = useLocalState('', 'jwt');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(addRoomTypeInit);
  const [snackbar, setSnackbar] = useState({
    variant: 'success',
    message: '',
  });
  const navigate = useNavigate();

  const isValid = () => {
    let valid = true;
    const notValid = { ...addRoomTypeInit.notValid };

    if (form.roomTypeName.length == 0 || form.roomTypeName.length <=1 || form.roomTypeName.length >=20) {
      notValid.roomTypeName = 'Room Name cannot be empty, should be grater than 1 characters & Less than 20 characters.';
      valid = false;
    }

    if (form.roomTypeFee.length == 0 || form.roomTypeFee === 0) {
      notValid.roomTypeFee = 'Fee cannot be empty or 0.';
      valid = false;
    }

    if (form.roomTypeCapacity.length == 0 || form.roomTypeCapacity === 0) {
      notValid.roomTypeCapacity = 'Capacity cannot be empty or 0.';
      valid = false;
    }


    setForm({ ...form, notValid });
    return valid;
  };


  const handleAdd = async () => {
    if (!isValid()) {
      console.log(form)
      return;
    }

    try {
      setLoading(true);
      // const roomTypePayload = {
      //   roomTypeName: form.roomName,
      //   roomTypeFee: form.roomFee,
      //   roomTypeCapacity: form.roomCapacity,
      // };


      // console.log(JSON.stringify(hostelPayload))
      
      await fetch(`/warden/addRoomType/${form.roomTypeName}, ${parseInt(form.roomTypeFee)}, ${parseInt(form.roomTypeCapacity)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        // body: JSON.stringify(roomTypePayload),
      });



      navigate('/admin/roomType');
    } catch (e) {
      console.error(e);
      setSnackbar({
        message: e,
        variant: 'error',
      });
    }

    setLoading(false);
  };

  return (
    <AdminDashboard>
      <Wrapper>
        {loading ? (
          <Welcome>Loading....</Welcome>
        ) : (
          <>
            <Box
              title='Add RoomType'
              loading={loading}
            >
              <AdminRoomTypeForm form={form} setForm={setForm} />
              <Button
                  color='secondary'
                  onClick={handleAdd}
                  isDisabled={loading}
                  size='S'
                >
                  Save
                </Button>
            </Box>
            {snackbar && snackbar.message && (
              <Snackbar
                message={snackbar.message}
                variant={snackbar.variant}
                onClose={() => setSnackbar(null)}
              />
            )}
          </>
        )}
      </Wrapper>
    </AdminDashboard>
  );
};

export default AdminRoomTypeAdd;

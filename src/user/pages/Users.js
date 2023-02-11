import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../shared/components/Api/UserApi';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import UsersList from '../components/UsersList';

const Users = () => {
  const [loadedUsers, setloadedUsers] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);


  const request = async () => {
    setloading(true);
    const response = await getAllUsers();
    setloading(false);
    response.statusCode !== 200 && setError(response.message);
    return (
      await response.data.users,
      setloadedUsers(response.data.users))
  }
  useEffect(() => {
    request();
  }
    , [])
  const errorHandler = () => setError(null);


  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />

      {
        loading && (
          <div className='center'>
            <LoadingSpinner />
          </div>
        )
      }
      {
        loadedUsers &&
        <UsersList items={loadedUsers} />
      }
    </>
  )
};

export default Users;

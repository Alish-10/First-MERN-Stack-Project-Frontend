import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/HttpHook';
import { API_URL } from '../Api';
import Button from '../FormElements/Button';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import Modal from '../UIElements/Modal';
import './NavLinks.css';


const NavLinks = props => {
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const showDeleteWarningHandler = () => {
    setModal(true);
  }
  const cancelDeleteHandler = () => {
    setModal(false);
  }
  const confirmDeleteHandler = async () => {
    setModal(false);
    try {
      const response = await sendRequest(API_URL + `/users/${auth.userId}`,
        'DELETE'
      );
      auth.deleteUser();
      history.push('/');

    } catch (err) {

    }
  }

  return (
    <>
      {isLoading && <div className='center'><LoadingSpinner asOverlay /></div>}
      <ErrorModal error={error} onClear={clearError} />
      <ul className='nav-links'>
        <li>
          <NavLink to="/" exact>ALL USERS</NavLink>
        </li>

        {auth.isLoggedIn && (
          <>
            <li>
              <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
            </li>
            <li>
              <NavLink to="/places/new">ADD PLACES</NavLink>
            </li>
          </>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button className='delete' onClick={showDeleteWarningHandler}>DELETE ACCOUNT</button>
          </li>
        )}

      </ul>
      {setModal &&
        <Modal
          show={modal}
          onCancel={cancelDeleteHandler}
          header="Are you sure?"
          footerClass="place-item__modal-actions"
          footer={
            <React.Fragment>
              <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
              <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
            </React.Fragment>
          }>
          <p>Do you want to delete this User?
            Please note that it can't be undone thereafter.
          </p>
        </Modal>
      }
    </>
  )
}



export default NavLinks
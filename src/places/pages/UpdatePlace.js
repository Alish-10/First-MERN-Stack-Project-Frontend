import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/Util/Validators';
import { useForm } from '../../shared/hooks/form-hooks';
import './PlaceForm.css';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/HttpHook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { API_URL } from '../../shared/components/Api';
import { AuthContext } from '../../shared/context/auth-context';


const UpdatePlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const DUMMY_PLACES = [{}]
  const history = useHistory()
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlces = async () => {
      try {
        const response = await sendRequest(API_URL + `/places/${placeId}`)
        setLoadedPlace(response.place)
        console.log(response.place)
        setFormData(
          {
            title: {
              value: response.place.title,
              isValid: true
            },
            description: {
              value: response.place.description,
              isValid: true
            }
          },
          true
        );
      } catch (error) {

      }
    }
    fetchPlces();
  }, [sendRequest, placeId]);



  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      const response = await sendRequest(
        API_URL + `/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token

        },
      )
      history.push('/' + auth.userId + '/places')
    } catch (error) {

    }
  };
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }



  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true} />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true} />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
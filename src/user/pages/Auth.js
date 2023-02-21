import React, { useContext, useState } from 'react'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useForm } from '../../shared/hooks/form-hooks'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/Validators';
import { useHttpClient } from '../../shared/hooks/HttpHook';


import './Auth.css'
import { API_URL } from '../../shared/components/Api'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'


const Auth = () => {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  })

  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined,
        image: undefined
      },
        formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }

      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };


  const authSubmitHandler = async event => {
    const formData = new FormData();
    let data;

    if (isLoginMode) {
      data = JSON.stringify({
        email: formState.inputs.email.value,
        password: formState.inputs.password.value
      })
    } else {
      formData.append('email', formState.inputs.email.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('image', formState.inputs.image.value);
    }


    event.preventDefault();
    try {
      let response =
        isLoginMode ? (

          await sendRequest(
            API_URL + '/users/login',
            'POST',
            data,
            {
              'Content-Type': 'application/json'
            }
          ),
          auth.login(response.user.id)

        ) : (

          await sendRequest(
            API_URL + '/users/signup',
            'POST',
            formData,
          ),
          auth.login(response.user.id)
        )

    } catch (error) {

    }
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode &&
            <Input
              element="input"
              id="name"
              label="Your Name"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name."
              onInput={inputHandler} />}
          {!isLoginMode &&
            <ImageUpload
              id='image'
              center
              onInput={inputHandler}
              errorText="Please provide an image."


            />
          }
          <Input
            id='email'
            element='input'
            type='email'
            label='Email'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler} />
          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password, at least 6 characters'
            onInput={inputHandler} />
          <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>

      </Card></>
  )
}

export default Auth
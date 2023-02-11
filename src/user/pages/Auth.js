import React, { useContext, useState } from 'react'
import { LoginApi, SignUpApi } from '../../shared/components/Api/UserApi'
import Button from '../../shared/components/FormElements/Button'
import Input from '../../shared/components/FormElements/Input'
import Card from '../../shared/components/UIElements/Card'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useForm } from '../../shared/hooks/form-hooks'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/Util/Validators';


import './Auth.css'

const Auth = () => {

  const auth = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        name: undefined
      },
        formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }

      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    const data = isLoginMode ? {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    } : {
      name: formState.inputs.name.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    }
    setLoading(true);
    event.preventDefault();
    const response = isLoginMode ? await LoginApi(data) : await SignUpApi(data);
    setLoading(false);
    console.log(response, "res");
    (response.statusCode !== 201 || response.statusCode !== 200) &&
      setError(response.data.message
        || 'Something went wrong, please try again.');

    (response.statusCode === 201 || response.statusCode === 200) && auth.login();
  }
  const errorHandler = () => {
    setError(null);
  }
  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
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
            errorText='Please enter a valid password, at least 5 characters'
            onInput={inputHandler} />
          <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>

      </Card></>
  )
}

export default Auth
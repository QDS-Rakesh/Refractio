import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Checkbox,
  Button,
  Form,
  Message,
  Container,
  Header,
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  authLoginSelector,
  loginUser,
} from '../../features/auth/authLoginSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const { register, setValue, handleSubmit, errors, trigger } = useForm({
    mode: 'onBlur',
  });
  // set up dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // fetch data from our store
  const { loading, error, userLogin } = useSelector(authLoginSelector);

  const handleLogin = ({ email, password, rememberMe }) => {
    dispatch(loginUser(email, password, rememberMe));
  };

  const handleChange = (e) => {
    e.persist();
    setValue(e.target.name, e.target.value);
  };

  const handleBlur = (e) => {
    trigger(e.target.name);
  };

  const handleChangeCheckBox = (e) => {
    e.persist();
    setValue(e.target.name, e.target.checked);
    trigger(e.target.name);
  };

  const loginOptions = {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
        message: 'Invalid Email. Must include “@” and “.”',
      },
    },

    password: {
      required: 'Password is required',
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        message:
          'Invalid password. Password length should be min 8 symbols. Password should contain numbers, letters, special characters.',
      },
    },
    rememberMe: {},
  };

  useEffect(() => {
    register({ name: 'email' }, loginOptions.email);
    register({ name: 'password' }, loginOptions.password);
    register({ name: 'rememberMe' }, loginOptions.rememberMe);
  }, []);

  useEffect(() => {
    if (userLogin) {
      if (userLogin.isSuperAdmin === true) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [userLogin]);

  return (
    <Container>
      <Header size='medium' className='primary-dark-color'>
        Log In
      </Header>
      <p className='mt-3 mb-4'>
        Enter your email address and password to access account.
      </p>
      {error && (
        <Message color='red' className='error-message mb-3'>
          {error}
        </Message>
      )}
      <Form onSubmit={handleSubmit(handleLogin)} loading={loading} error>
        <Form.Field className='mb-3'>
          <label>Email Address</label>
          <Form.Input
            name='email'
            fluid
            placeholder='Enter your Email'
            onBlur={handleBlur}
            onChange={handleChange}
            error={!!errors.email}
            tabIndex='1'
          />
          {errors && errors.email && (
            <Message error content={errors.email.message} />
          )}
        </Form.Field>
        <Form.Field className='mb-3'>
          <label className='d-inline-block'>Password</label>
          <Link className='float-end' to='/auth/password-recover'>
            Forget your password?
          </Link>
          <Form.Input
            name='password'
            type='password'
            fluid
            placeholder='Enter your Password'
            onBlur={handleBlur}
            onChange={handleChange}
            error={!!errors.password}
            tabIndex='2'
          />
          {errors && errors.password && (
            <Message error content={errors.password.message} />
          )}
        </Form.Field>
        <Form.Field>
          <Checkbox
            label='Remember me'
            name='rememberMe'
            onBlur={handleChangeCheckBox}
            tabIndex='3'
          />
        </Form.Field>
        <Button type='submit' fluid primary className='mt-3 btn' tabIndex='4'>
          Log In
        </Button>
        <div className='backToLogin'>
          Not have an account? <Link to='/auth/register'>Sign up</Link>
        </div>
      </Form>
    </Container>
  );
};

export default Login;

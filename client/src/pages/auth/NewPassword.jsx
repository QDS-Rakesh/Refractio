import React, { useState, useEffect } from 'react';

import { Button, Form, Message, Container, Header } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

const NewPassword = () => {
  const { register, setValue, handleSubmit, errors, trigger,reset,watch,getValues  } = useForm({
    mode: 'onBlur',
  });
  const [toggle1, setToggle1] = useState(false);
const [toggle2, setToggle2] = useState(false);
let password;
password = watch("password", "");

const onSubmit = (data) => {
    
    console.log(data);
    reset();
}

  const [loading, setLoading] = useState(false);

  const handlePasChange = (data) => {
    console.log(data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    reset();
  };
  const handleChange = (e) => {
    e.persist();
    setValue(e.target.name, e.target.value);
    trigger(e.target.name);
  };

  const passwordChange = {
    newPassword: {
      required: 'Password is required',
      pattern: {
        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
        message:
          'Invalid password. Password length should be min 8 symbols. Password should contain numbers, letters, special characters.',
      },
    },

    confirmPassword: {
      required: 'Password is required',
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        message:
          'Invalid password. Password length should be min 8 symbols. Password should contain numbers, letters, special characters.',
      },
    },
  };

  useEffect(() => {
    register({ name: 'newPassword' }, passwordChange.newPassword);
    register({ name: 'confirmPassword' }, passwordChange.confirmPassword);
  }, []);

  return (
    <Container>
      <Header size='medium' className='primary-dark-color'>
        Create New Password
      </Header>
      <Form onSubmit={handleSubmit(handlePasChange)} loading={loading} error>
        <Form.Field>
          <label>Enter New Password</label>
          <i id="passlock" className="fa fa-lock icon"></i>
          <i id="showpass" className="fa fa-eye icon" onClick={() => { setToggle1(!toggle1) }}></i>
          <Form.Input
            name='newPassword'
            placeholder='Enter new password'
            type={toggle1 ? "text" : "password"}
            fluid
            onBlur={handleChange}
            error={!!errors.newPassword}
          />
          {errors && errors.newPassword && (
            <Message error content={errors.newPassword.message} />
          )}
        </Form.Field>
        <Form.Field>
        <i id="passlock" className="fa fa-lock icon"></i>
        <i id="showpass" className="fa fa-eye icon" onClick={() => { setToggle2(!toggle2) }}></i>
          <label>Enter New Password</label>
          <Form.Input
            name='confirmPassword'
            placeholder='Enter confirm password'
            type={toggle2 ? "text" : "password"}
            fluid
            onBlur={handleChange}
            error={!!errors.newPassword}
          />
          {errors && errors.confirmPassword && (
            <Message error content={errors.confirmPassword.message} />
          )}
        </Form.Field>
        <Button type='submit' fluid primary>
          Reset Password
        </Button>
      </Form>
    </Container>
  );
};

export default NewPassword;

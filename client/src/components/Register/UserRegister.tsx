import React, { useState } from 'react';
import Input from '../Input/input';
import Button from '../Button/button';

interface FormState {
  username: string;
  userFullname: string;
  password: string;
  confirmPassword: string;
}

const UserRegister: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    username: '',
    userFullname: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({
        ...errors,
        [name]: undefined
      });
    setForm({
      ...form,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.userFullname) newErrors.userFullname = 'Full name is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log('Form submitted successfully', form);
      
      // Handle form submission, e.g., send data to server
    }
  };

  return (
    <div style={{width:"100%"}}>
      {submitted && <div className="success-message">注册成功！</div>}
      <form className="form-user-register" onSubmit={handleSubmit}>
        <div className='form-item-container'>
          <label>用户名</label>
          <Input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={errors.username?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
        </div>
        <div className='form-item-container'>
          <label>全名</label>
          <Input
            type="text"
            name="userFullname"
            value={form.userFullname}
            onChange={handleChange}
            style={errors.userFullname?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
        </div>
        <div className='form-item-container'>
          <label>密码</label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            style={errors.password?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className='form-item-container'>
          <label>确认密码</label>
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            style={errors.confirmPassword?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
        </div>
        <Button className='form-submiter' type="submit" btnType="green">注册</Button>
      </form>
    </div>
  );
};

export default UserRegister;
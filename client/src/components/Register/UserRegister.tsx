import React, { useState } from 'react';
import Input from '../Input/input';
import Button from '../Button/button';
import { serverIp, serverPort } from '../../utils/config';
import CryptoJS from 'crypto-js';

const keyStr = 'it@glory.com'
const ivStr = 'it@glory.com'
interface FormState {
  username: string;
  userFullname: string;
  password: string;
  confirmPassword: string;
}
function encrypt(data: string, keyS?: string, ivS?: string): string {
  const key = CryptoJS.enc.Utf8.parse(keyS || keyStr);
  const iv = CryptoJS.enc.Utf8.parse(ivS || ivStr);
  const src = CryptoJS.enc.Utf8.parse(data);
  
  const cipher = CryptoJS.AES.encrypt(src, key, {
    iv: iv, // Initialization vector
    mode: CryptoJS.mode.CBC, // Encryption mode
    padding: CryptoJS.pad.Pkcs7, // Padding
  });
  
  const encrypted = cipher.toString();
  return encrypted;
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
    //if (!form.userFullname) newErrors.userFullname = 'Full name is required';
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
      const query=`INSERT INTO user_list (name,userName,pass,auth,userData,isDisabled) VALUES (N'${form.userFullname}',N'${form.username}',N'${encrypt(form.password)}',N'',N'',0);`
      fetch("http://"+serverIp+":"+serverPort+"/saveData",{
        headers:{
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ type: 'mssql',query:query})
      })
      .then(response => response.json())
      .then(data => {
          console.log("saveData",data,query)
          
          console.log('Form submitted successfully', form);

      })
      
      // Handle form submission, e.g., send data to server
    }
  };

  return (
    <div style={{width:"100%"}}>
      {submitted && <div className="success-message">注册成功！</div>}
      <form className="form-user-register" onSubmit={handleSubmit}>
        <div className='form-item-container'>
          <label><span style={{color:"red"}}>*</span>用户名</label>
          <Input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            style={errors.username?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
        </div>
        <div className='form-item-container'>
          <label><span></span>全名</label>
          <Input
            type="text"
            name="userFullname"
            value={form.userFullname}
            onChange={handleChange}
            style={errors.userFullname?{boxShadow:"0 0px 4px rgba(206, 0, 0, 0.8)"}:{}}
          />
        </div>
        <div className='form-item-container'>
          <label><span style={{color:"red"}}>*</span>密码</label>
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
          <label><span style={{color:"red"}}>*</span>确认密码</label>
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
import { useState } from "react";
import style from "./Account.module.scss";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

function Account() {

  const { register, handleSubmit, watch, formState: {errors} } = useForm();
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user.user);

  const submit = async () => {
    setLoading(false);
    const FullName = watch("fullName");
    const Username = watch("username");
    const Email = watch("email");
    const Password = watch("password");
    console.log(FullName);
    console.log(Username);
    console.log(Email);
    console.log(Password);

    axios.put(`http://localhost:4000/users/${user.user_id}/updateProfile`, {
      fullName: FullName,
      email: Email,
      username: Username,
      password: Password,
    }, { withCredentials: true })
    .then((res) => {
      setLoading(true);
      // setLoading(false);
      console.log(res);
      alert('Successfully updated!');
      window.location.reload();
    })
    .catch((err) => {
      setLoading(false);
      alert('User Failed to update');
      console.log(err);
    });
  }

  // const checked = (e) => {
  //   console.log('this is e: ', e);

  //   if (!e.target.nextSibling.value) {
  //     console.log('insert input values');
  //     if (e.target.nextSibling.id === 'fullName') {
  //       e.target.nextSibling.value = user.fullname;
  //       setFullName(user.fullName);
  //     }
  //     else if (e.target.nextSibling.id === 'username') e.target.nextSibling.value = user.username;
  //     else if (e.target.nextSibling.id === 'email') e.target.nextSibling.value = user.email;
  //   }
  //   else {
  //     console.log('delete input values');
  //     e.target.nextSibling.value = ''
  //   }
  // }

  return (
    <div className={style.main}>

      <h1>Welcome to Account settings</h1>
      <br />
      <p>Change your account information</p>

      <div className={style.container}>

        <div className={style.account}>
          <h1> Current Full name: { user.fullname }</h1>
          <h1> Current User name: { user.username }</h1>
          <h1> Current Email: {user.email}</h1>
          <h1> Current Password: {user.password.slice(0,4)}*****</h1>
        </div>

        { loading ? 
          <div className={style.loadingDiv}>
            <div className={style.loader}></div>
          </div>
        :
          <form autoComplete="off" onSubmit={handleSubmit(submit)} className={style.content}>
              <label htmlFor="">Full Name</label>
              
              <input style={errors.fullName ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('fullName', { required: "Full name is required" })} type="text" id='fullName' placeholder="Enter your new name"/>
              { errors.fullName ? <ErrorMessage errors={errors} name='fullName' render={({ message }) => <span>{message}<br/></span>}/> : <><br/><br/></>}

              <label htmlFor="">Username</label>
              
              <input style={errors.username ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('username', { required: true, minLength: 6, maxLength: 20 })} type="text" id='username' placeholder="Enter your new username" />
              { errors.username && errors.username.type === 'required' ? <span>Username is required<br/></span> : errors.username && errors.username.type === 'minLength' ? <span>Username should be at least 6 characters<br/></span> : errors.username && errors.username.type === 'maxLength' ? <span>Username should be at most 20 characters<br/></span> : <><br/><br/></> }

              <label htmlFor="">Email</label>
             
              <input style={errors.email ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('email', { required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} type="text" id='email' placeholder="Enter your new email" />
              { errors.email && errors.email.type === 'required' ? <span>Email is required<br/></span> : errors.email && errors.email.type === 'pattern' ? <span>Please enter a valid email address<br/></span> : <><br/><br/></>}

              <label htmlFor="">Password</label>
              <br />
              <input style={errors.password ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('password', { required: true, minLength: 6 })} type="password" placeholder="Enter your new password" />
              { errors.password && errors.password.type === 'required' ? <span>Please confirm  your password<br/></span> : errors.password && errors.password.type === 'minLength' ? <span>Password should be at least 6 characters<br/></span> : <><br/><br/></> }

              <br />
              <input type='submit' value='Submit Changes' className={style.btn}></input>
          </form>

        }

      </div>
    </div>
  );
}

export default Account;

import React, { Component } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link, BrowserRouter as Router} from "react-router-dom";
import _ from "lodash/fp";
import './Form.css';

const LogIn = (props) => {

    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = data => {
        alert(JSON.stringify(data));
    };
        console.log("hey")
        return (
            <div className="auth-wrapper">
                <div className = "auth-inner">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h3>Sign in</h3>

                        <div className = "form-group">
                        <label>
                            E-mail Address
                        </label>
                        <input type="text" className="form-control"
                            name="email"
                            ref={register({
                            required: true,
                            pattern: /^\S+@\S+$/i,
                            })}
                            placeholder="e-mail"
                        />
                        {_.get("email.type", errors) === "required" && (
                                <p>This field is required!</p>
                        )}
                        {_.get("email.type", errors) === "pattern" && (
                                <p>Wrong email format!</p>
                        )}
                    </div>

                    <div className = "form-group">
                        <label>
                            Password
                        </label>
                        <input type="password" className="form-control"
                            name="password"
                            ref={register({
                                required: true,
                                minLength: 6,
                            })}
                            placeholder="password" />
                            {_.get("password.type", errors) === "required" && (
                                <p>This field is required</p>
                            )}
                            {_.get("password.type", errors) === "minLength" && (
                                <p>Password must contain at least 6 characters!</p>
                            )}
                    </div>
                    <input type="submit" value="Login" />                
                    </form>
                    <Link className="Link" to='/register' style={{ color: 'blue'}}>Don't have an account? Sign up here. </Link>
                </div>
            </div>
        
        );
}

export default LogIn;
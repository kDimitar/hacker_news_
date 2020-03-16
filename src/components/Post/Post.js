import React from 'react';

import './Post.module.css';
import Comment from '../Comment/Comment';

const post = (props) => (
    
        <div className = "post-container">
            <Comment className = "post-items"
                author = {props.author}
                time = {props.time}
                text = {props.text}
            />                
        </div>
   
);

export default post;

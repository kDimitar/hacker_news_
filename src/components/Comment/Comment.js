import React from 'react';

const comment = (props) =>{
  return (
    <React.Fragment>
      <p>
         <a href={`/user?id=${props.author}`}>{props.author}</a> on {props.date}
      </p>
      <p>{props.text}</p>
    </React.Fragment>
  );
}

export default comment;
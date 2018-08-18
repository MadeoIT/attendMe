import React from 'react';

const TodoInput = (props) => {
  return(
    <div>
      <form onSubmit={(e) => props.onFormSubmit(e)} className="todos-form" >
        <input
          className="todos-content" 
          onChange={(e) => props.onChange(e)}
          type="text"
          name="content"
          value={props.content || ''}
        />
        <button type="submit" className="todos-save">Save</button>
      </form>
    </div>
  )
}

export default TodoInput;
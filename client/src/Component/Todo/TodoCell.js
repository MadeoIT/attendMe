import React from 'react';
import { Input } from 'semantic-ui-react';

export default class TodoCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false
    }

    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.textInput = React.createRef();
  }

  onClick() {
    this.setState({ isFocused: !this.state.isFocused }, () => {
      this.textInput.current.focus();
    })
  }

  onBlur() {
    this.setState({ isFocused: !this.state.isFocused })
  }

  render() {

    const { data, updateTodoProperties } = this.props

    return this.state.isFocused ?
      <Input
        onChange={(e) => updateTodoProperties(data.id, {[e.target.name]: e.target.value})}
        className="todos-cell-input"
        type="text"
        name={data.name}
        value={data.value}
        onBlur={() => this.onBlur()}
        ref={this.textInput}
      />
      :
      <div
        className="todos-cell-data"
        onClick={() => this.onClick()}
      >
        {data.value}
      </div>
  }
};

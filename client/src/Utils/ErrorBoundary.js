import React from 'react';

export default class ErrorBoundary extends React.Component{

  state = {
    hasError: false
  }

  componentDidCatch(error, errorInfo){
    this.setState({
      error, errorInfo, hasError: true
    })
  }

  render(){
    return this.state.hasError 
      ? <div className="error">Something went wrong</div> 
      : this.props.children
  }
}
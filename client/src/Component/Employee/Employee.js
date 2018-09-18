import React from 'react';
import { connect } from 'react-redux';
import * as actions from './employee_actions';
import EmployeeTable from './EmployeeTable';
import * as R from 'ramda';
import EmployeeAdd from './EmployeeAdd';

export class Employee extends React.Component {

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onUpload = this.onUpload.bind(this);

    this.state = {};
    this.tenantId = this.props.math.params.tenantId;
  }

  componentDidMount() {
    this.props.getEmployes(this.tenantId);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({[name]: value});
  };

  onFileChange(e) {}

  onClick() {
    const email = R.pick(['email'], this.state);
    this.props.sendEmailInvitation(email, this.tenantId);
  }

  onUpload(e) {
    this.props.sendEmailInvitations({ file: e.target.files[0]}, this.tenantId)
  }

  render() {
    return (
      <div>
        <EmployeeAdd
          onChange={this.onChange}
          onUpload={this.onUpload}
          onClick={this.onClick}
          {...this.state}
        />
        <EmployeeTable
          employes={this.props.employee}
        />
      </div>
    )
  }
};

const mapStateToProps = state => ({
  employee: state.employee
});

export default connect(mapStateToProps, actions)(Employee);
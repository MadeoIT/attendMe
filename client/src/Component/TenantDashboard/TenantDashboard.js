import React from 'react';
import { connect } from 'react-redux';
import * as actions from './tenant_actions';
import { Grid, Container } from 'semantic-ui-react'
import TenantCard from './TenantCard';
import TenantInfo from './TenantInfo';

export class TenantDashboard extends React.Component {

  componentDidMount(){
    this.props.getTenant(this.props.match.params.tenantId);
  }

  render() {
    return (
      <Container>
        <Grid centered celled>
          <Grid.Row>
            <Grid.Column width={3}>
              <TenantCard
                tenant={this.props.tenant}
                loading={this.props.loading}
              />
            </Grid.Column>
            <Grid.Column width={13}>
              <TenantInfo
                tenant={this.props.tenant}
                loading={this.props.loading}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
};

const mapStateToProps = state => ({
  tenant: state.tenant,
  loading: state.loading
});

export default connect(mapStateToProps, actions)(TenantDashboard);
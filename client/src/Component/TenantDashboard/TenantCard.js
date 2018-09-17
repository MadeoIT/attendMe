import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'

const TenantCard = ({ tenant, loading }) => {
  return loading > 0 || Object.keys(tenant).length === 0
    ? (
      <Image
        src='https://react.semantic-ui.com/images/wireframe/image-text.png'
        size='medium'
      />
    )
    : (
      <Card>
        <Image src='/images/avatar/large/matthew.png' />
        <Card.Content>
          <Card.Header className='tenantCard-header'>
            {`${tenant.firstName} ${tenant.lastName}`}
          </Card.Header>
          <Card.Meta>
            <span className='date tenantCard-meta-date'>
              Joined in {tenant.createdAt.split('-')[0]}
            </span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
        </Card.Content>
      </Card>
    )
}

export default TenantCard;
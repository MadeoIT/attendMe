import actionTypes from '../../Actions';

export const baserUrl = '/api/tenants';
export const GET_TENANT = 'GET_TENANT';

export function getTenant(tenantId) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${baserUrl}/${tenantId}`,
        method: 'get'
      },
      onSuccess: (data) => ({
        type: GET_TENANT,
        payload: data
      })
    }
  }  
}
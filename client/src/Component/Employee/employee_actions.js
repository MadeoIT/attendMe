import actionType from '../../Actions';

export const GET_EMPLOYES = 'GET_EMPLOYES';
export const GET_EMPLOYEE = 'GET_EMPLOYEE';
export const baseUrl = '/api/tenant/'
const formData = new FormData();

export function getEmployes(tenantId) {
  return {
    type: actionType.API,
    payload: {
      request: {
        url: `${baseUrl}/${tenantId}/employes`,
        method: 'get'
      },
      onSuccess: (data) => ({
        type: GET_EMPLOYES,
        payload: data
      })
    }
  }
};

export function sendEmailInvitation(body, tenantId) {
  return {
    type: actionType.API,
    payload: {
      request: {
        url: `${baseUrl}/${tenantId}/employes`,
        method: 'post',
        data: body
      },
      onSuccess: (data) => ({
        type: GET_EMPLOYEE,
        payload: body
      }),
      message: {
        header: 'Invitation sent'
      }
    }
  }
};

export function sendEmailInvitations(body, tenantId) {
  return {
    type: actionType.API,
    payload: {
      request: {
        url: `${baseUrl}/${tenantId}/employes`,
        method: 'post',
        data: formData.append('csvEmailList', body.file)
      },
      onSuccess: (data) => ({
        type: GET_EMPLOYES,
        payload: data
      }),
      message: {
        header: 'Invitations sent'
      }
    }
  }
}
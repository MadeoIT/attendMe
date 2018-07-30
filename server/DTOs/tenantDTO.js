exports.tenantToTenantDTO = function (tenant) {
  const { password, ...tenantDTO } = tenant;
  return tenantDTO;
}
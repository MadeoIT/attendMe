const db = require('../models');

module.exports = {
  updateAttendanceByIdAndEmployeeIdAndByTenantId: async (attendanceObj, id, employeeId, tenantId) => {
    const attendance = await db.Attendance.find({ where: {
      id, employeeId, tenantId
    }});
    return attendance.update(attendanceObj);
  },
}
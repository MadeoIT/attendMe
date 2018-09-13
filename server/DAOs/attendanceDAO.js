const db = require('../models');

module.exports = {
  updateAttendanceByEmployeeIdAndByTenantId: async (attendanceObj, employeeId, tenantId) => {
    const attendance = await db.Attendance.find({ where: {
      employeeId, tenantId
    }});
    return attendance.update(attendanceObj);
  },
}
const attendanceHooks = {
  monthArray: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  /**
   * @param {Object} date object from new Date()
   * @returns {Array<String>} Ex: ["2018-09-04", "05:40:36.490Z"]
   */
  getDateTimeArray: (date) => date.toISOString().split('T'),

  /**
   * @param {String} time,
   * @param {Number} timeZone,
   * @returns {Array<Number>} arrray with [ hours, minutes ] 
   * Input: "05:40:36.490Z", +2 => Output: [7, 40]
   * The hours will be adjusted with the timezone of the user
   */
  getHourMinuteArray: (time, timeZone) => {
    const timeArray = time.split(':').slice(0, 2);
    const hourWithTimeZone = Number(timeArray[0]) + Number(timeZone);
    return [hourWithTimeZone, Number(timeArray[1])];
  },

  /**
   * @param {Array<Number>} startTime ex: [5, 50]
   * @param {Array<Number>} finishTime
   * Minutes are converted into hours Ex: 20 mins / 60 mins = 0.4 hours
   */
  getTimeAttended: (startTime, finishTime) => {
    const hours = finishTime[0] - startTime[0];
    const minutes =
      (Math.trunc((finishTime[1] / 60) * 10) / 10) -
      (Math.trunc((startTime[1] / 60) * 10) / 10);

    return hours + minutes;
  },

  /**
   * Upon instantiation the Attendance model will set year, month, day and startTime
   * The only input data needed will be the timeZone which depends from the client
   */
  beforeCreateAttendance: (attendance, options) => {
    const dateTimeArray = attendanceHooks.getDateTimeArray(new Date());
    const date = dateTimeArray[0].split('-');
    const startTime = attendanceHooks.getHourMinuteArray(dateTimeArray[1], attendance.timeZone);

    attendance.month = attendanceHooks.monthArray[Number(date[1]) - 1];
    attendance.day = Number(date[2]);
    attendance.year = Number(date[0]);
    attendance.startTime = startTime;
  },

  /**
   * After update the Attendance model will set the finishTime from the current time
   * and calculate the differce between the finishTime and startTime in hours
   */
  beforeUpdateAttendance: (attendance, options) => {
    const dateTimeArray = attendanceHooks.getDateTimeArray(new Date());
    const finishTime = attendanceHooks.getHourMinuteArray(dateTimeArray[1], attendance.timeZone);
    const timeAttended = attendanceHooks.getTimeAttended(attendance.startTime, finishTime);

    attendance.finishTime = finishTime;
    attendance.timeAttended = timeAttended;
  }
}

module.exports = attendanceHooks;
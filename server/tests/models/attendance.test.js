const attendanceHooks = require('../../models/hooks/attendanceHooks');

describe('hooks', () => {
  let attendance;

  beforeEach(() => {
    attendance = {
      day: null,
      year: null,
      month: null,
      startTime: null, 
      finishTime: null,
      timeZone: -1,
      timeAttendedMinutes: null,
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it(' should get an array of hour and minute with time zone adjustment', () => {
    const timeArray = attendanceHooks.getHourMinuteArray("05:40:36.490Z", +2);

    expect(timeArray.length).toBe(2);
    expect(timeArray[0]).toBe(7);
    expect(timeArray[1]).toBe(40);
  })

  it('beforeCreateAttendance should set correctly year month and time', () => {
    attendanceHooks.getDateTimeArray = jest.fn().mockReturnValue(["2018-09-04", "05:40:36.490Z"]);
    attendanceHooks.beforeCreateAttendance(attendance);

    expect(attendance.day).toBe(4);
    expect(attendance.year).toBe(2018);
    expect(attendance.month).toBe('September');
    expect(attendance.startTime).toEqual([4, 40]);
  });

  it('beforeUpdateAttendance should set correctly the finish time', () => {
    attendanceHooks.getDateTimeArray = jest.fn().mockReturnValue(["2018-09-04", "07:20:36.490Z"]);
    attendance.startTime = [4, 40];
    attendanceHooks.beforeUpdateAttendance(attendance);

    expect(attendance.finishTime).toEqual([6, 20]);
    expect(attendance.timeAttendedMinutes).toBe(1.7);
  });

  it('should get the total attended time', () => {
    const startTime = [9, 40];
    const finishTime = [16, 20];
    const res = attendanceHooks.getTimeAttended(startTime, finishTime);

    expect(res).toBe(6.7); //6 hours and 40 minutes
  });
})
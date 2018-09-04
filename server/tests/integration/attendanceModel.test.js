const db = require('../../models');
const attendanceHooks = require('../../models/hooks/attendanceHooks');

describe('attendance model integration test', () => {

  beforeEach(async () => {
    attendanceHooks.getDateTimeArray = jest.fn().mockReturnValue(["2018-09-04", "05:40:36.490Z"]);
  });

  afterEach( async () => {
    await db.Attendance.destroy({
      where: {}
    })
  });

  it('should set all the properties according to the hook', async() => {
    const res = await db.Attendance.create({
      timeZone: -2
    });

    expect(res.day).toBe(4);
    expect(res.timeZone).toBe(-2);
    expect(res.year).toBe(2018);
    expect(res.month).toBe('September');
    expect(res.startTime).toEqual([3, 40]);
  });

  it('should set the finish time and calculate the total time property', async() => {
    const attendance = await db.Attendance.create({
      timeZone: -2
    });
    const res = await attendance.update({}, {
      where: {
        id: attendance.id
      }
    });
    
    expect(res.finishTime).toEqual([3, 40]);
    expect(res.startTime).toEqual([3, 40]);
    expect(res.timeAttendedMinutes).toBe(0);
  })
})
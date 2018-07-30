const { changeObjectKeyName, changeObjectKeyValue } = require('../factory');


describe('Factory functions', () => {
  it('should substitute key name in objet', () => {
    const oldObject = {
      sub: 1,
      name: 'matteo'
    }
    const newObject = changeObjectKeyName(oldObject, 'sub', 'id');
  
    expect(newObject.id).toBe(1);
    expect(newObject.sub).toBeUndefined();
    expect(newObject.name).toBe('matteo');
    expect(Object.keys(newObject).length).toBe(2);
  });
  
  it('should substitute a property value with another', () => {
    const oldObject = {
      sub: 1,
      name: 'matteo'
    };
    const newObject = changeObjectKeyValue(oldObject, 'name', 'pippo');
  
    expect(newObject.sub).toBe(1);
    expect(newObject.name).toBe('pippo');
    expect(Object.keys(newObject).length).toBe(2);
  })
})

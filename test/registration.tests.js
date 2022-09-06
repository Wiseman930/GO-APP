const assert = require('assert');
const displayAllRegies = require('../registrations');

const pgp = require('pg-promise')()


  const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/test";

  const config = {
    connectionString: DATABASE_URL,
   /* ssl: {
      rejectUnauthorized: false,
    },*/
  };

  const db = pgp(config);

  describe('Greetings function', function(){

    beforeEach(async function(){
    await db.none("delete from reg_plates")
    });

it("should return error message when I insert invalid registration number with extra numbers", async function(){
    let regs = displayAllRegies(db);

    await regs.takentext('CA 1234567')

    assert.equal('Enter a vaild registration number', await regs.returnForEmptyBox());

});

it("should return error message when I insert invalid registration number with less numbers", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 12345')

  assert.equal('Enter a vaild registration number', await regs.returnForEmptyBox());

});
it("should return error message when I insert invalid dahsed registration number with extra numbers", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CK 123-4567')

  assert.equal('Enter a vaild registration number', await regs.returnForEmptyBox());

});
it("should return error message when I insert invalid dahsed registration number with less characters", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-45')

  assert.equal('Enter a vaild registration number', await regs.returnForEmptyBox());

});
it("should return no error message when I insert the correct registration format", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CK 555-555')

  assert.equal('', await regs.returnForEmptyBox());

});

it("should return all the registration entered in textbox from my database", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CJ 223359')
  await regs.takentext('CK 123-455')

  assert.deepEqual([{reg_numbers: 'CL 123-123'},{reg_numbers: 'CL 123456'},{reg_numbers: 'CJ 223359'},{reg_numbers: 'CK 123-455'}], await regs.selectAllregs());

});

it("should an error message when the registration exists in the database", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.errors('CL 123-123')

  assert.equal('Registration number exists', await regs.returnForEmptyBox());

});

it("should return registrations from the database acording to the city selected", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CA 333333')
  await regs.takentext('CJ 222-369')
  await regs.takentext('CK 974613')
  await regs.takentext('CK 459273')


  assert.deepEqual([{reg_numbers: 'CA 333333'}], await regs.dispRegistration('capetown'));
  assert.deepEqual([{reg_numbers: 'CL 123-123'}, {reg_numbers: 'CL 123456'}], await regs.dispRegistration('paarl'));
  assert.deepEqual([{reg_numbers: 'CJ 222-369'}], await regs.dispRegistration('george'));
  assert.deepEqual([{reg_numbers: 'CK 974613'}, {reg_numbers: 'CK 459273'}], await regs.dispRegistration('stellenbosch'));

});

})
const assert = require('assert');
const displayAllRegies = require('../registrations');

const pgp = require('pg-promise')()


  const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pg1999@localhost:5432/test";

  const config = {
    connectionString: DATABASE_URL,
  };

  const db = pgp(config);

  describe('Greetings function', function(){

    beforeEach(async function(){
    await db.none("delete from reg_plates")
    });

it("should return all the registration entered in textbox from my database", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CJ 223359')
  await regs.takentext('CK 123-455')

  assert.deepEqual([{reg_numbers: 'CL 123-123'},{reg_numbers: 'CL 123456'},{reg_numbers: 'CJ 223359'},{reg_numbers: 'CK 123-455'}], await regs.selectAllregs());

});

it("should not add a registration when it exists in the database", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123-123')


  assert.deepEqual([{reg_numbers: 'CL 123-123'}], await regs.selectAllregs())

});

it("should return registrations from the database when cape town city selected", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CA 333333')
  await regs.takentext('CJ 222-369')
  await regs.takentext('CK 974613')
  await regs.takentext('CK 459273')


  assert.deepEqual([{reg_numbers: 'CA 333333'}], await regs.dispRegistration('Cape Town'));


});
it("should return registrations from the database when Paarl city selected", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CA 333333')
  await regs.takentext('CJ 222-369')
  await regs.takentext('CK 974613')
  await regs.takentext('CK 459273')


  assert.deepEqual([{reg_numbers: 'CL 123-123'}, {reg_numbers: 'CL 123456'}], await regs.dispRegistration('Paarl'));


});
it("should return registrations from the database when George city is selected", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CA 333333')
  await regs.takentext('CJ 222-369')
  await regs.takentext('CK 974613')
  await regs.takentext('CK 459273')


  assert.deepEqual([{reg_numbers: 'CJ 222-369'}], await regs.dispRegistration('George'));


});
it("should return registrations from the database when Stellenbosch city is selected", async function(){
  let regs = displayAllRegies(db);

  await regs.takentext('CL 123-123')
  await regs.takentext('CL 123456')
  await regs.takentext('CA 333333')
  await regs.takentext('CJ 222-369')
  await regs.takentext('CK 974613')
  await regs.takentext('CK 459273')


  assert.deepEqual([{reg_numbers: 'CK 974613'}, {reg_numbers: 'CK 459273'}], await regs.dispRegistration('Stellenbosch'));

});

})
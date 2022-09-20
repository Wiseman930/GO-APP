module.exports = function registrationList(db){

    let storeRegs;
    let selectCity;

    async function resetAll(){
        let deleteData = await db.oneOrNone("delete from reg_plates");
        return deleteData;

    }

   async function takentext(takeRegistration){
        let upperReg = takeRegistration;


       storeRegs = await db.oneOrNone('SELECT reg_numbers FROM reg_plates WHERE reg_numbers=$1', [upperReg])

       if(storeRegs == null){

             const first2 = upperReg.slice(0, 2);
             let storedFKey = await db.oneOrNone('SELECT id FROM registration_towns WHERE town_code=$1', [first2])
             await db.none('INSERT INTO reg_plates(reg_numbers, mytown_key) values($1, $2)', [upperReg, storedFKey.id])
        }
    }
    async function dispRegistration(takeCity){
        let storedFKey = await db.oneOrNone("SELECT id FROM registration_towns WHERE my_town_name=$1", [takeCity])
         if(takeCity == 'Cape Town' || takeCity == 'Paarl' || takeCity == 'George' || takeCity == 'Stellenbosch'){

             selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE mytown_key=$1", [storedFKey.id])

         }
         else if(takeCity == 'all'){
             selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates")
         }
         return selectCity
     }

    async function selectAllregs(){
        selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates")
        return selectCity
    }

    return {
        takentext,
        resetAll,
        dispRegistration,
        selectAllregs,
    }
}

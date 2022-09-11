module.exports = function registrationList(db){

    let emptyTextBox;
    let storeRegs;
    let existingReg;
    let selectCity;

    async function resetAll(){
        let deleteData = await db.oneOrNone("delete from reg_plates");
        selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates")
        emptyTextBox = "Registration numbers cleared"

    }

   async function takentext(takeRegistration){
        let upperReg = takeRegistration.toUpperCase()
        let regFormat = /^[CA|CL|CJ|CK]{2}\s[0-9]{3}\-[0-9]{3}$/
        let regFormat2 = /^[CA|CL|CJ|CK]{2}\s[0-9]{6}$/
        let regFormat3 = /^[CA|CL|CJ|CK]{2}\s[0-9]{4}$/
        let regFormat4 = /^[CA|CL|CJ|CK]{2}\s[0-9]{3}\s[0-9]{3}$/


       storeRegs = await db.oneOrNone('SELECT reg_numbers FROM reg_plates WHERE reg_numbers=$1', [upperReg])

       if(storeRegs == null && (regFormat.test(upperReg) == true || regFormat2.test(upperReg) == true || regFormat3.test(upperReg) == true || regFormat4.test(upperReg) == true)){

             const first2 = upperReg.slice(0, 2);
             let storedFKey = await db.oneOrNone('SELECT id FROM registration_towns WHERE town_code=$1', [first2])
             await db.none('INSERT INTO reg_plates(reg_numbers, mytown_key) values($1, $2)', [upperReg, storedFKey.id])
             emptyTextBox = ''
        }
        if(storeRegs == null && !(regFormat.test(upperReg) == true || regFormat2.test(upperReg) == true || regFormat3.test(upperReg) == true || regFormat4.test(upperReg) == true)){
            emptyTextBox = 'Enter a vaild registration number'
        }
    }

    async function errors(takeRegistration){
        let upperReg = takeRegistration.toUpperCase()
        existingReg = await db.oneOrNone('SELECT COUNT(1) FROM reg_plates WHERE reg_numbers=$1', [upperReg])
        if (existingReg.count == 1 && upperReg != ''){
         emptyTextBox = 'Registration number exists'
        }

    }
    async function dispRegistration(takeCity){
        let storedFKey = await db.oneOrNone("SELECT id FROM registration_towns WHERE my_town_name=$1", [takeCity])
         if(takeCity == 'Cape Town'){
             selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE mytown_key=$1", [storedFKey.id])

         }
         else if(takeCity == 'Paarl'){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE mytown_key=$1", [storedFKey.id])
         }
         else if(takeCity == 'George'){
             selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE mytown_key=$1", [storedFKey.id])
         }
         else if(takeCity == 'Stellenbosch'){
             selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE mytown_key=$1",[storedFKey.id])

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
    function returnForEmptyBox(){
        return emptyTextBox;
        }

    return {
        takentext,
        returnForEmptyBox,
        errors,
        resetAll,
        dispRegistration,
        selectAllregs,
    }
}

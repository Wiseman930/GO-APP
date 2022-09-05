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


        let upperReg2 = takeRegistration.toUpperCase()
        let regFormat2 = /^[CA|CL|CJ|CK]{2}\s[0-9]{6}$/


       storeRegs = await db.oneOrNone('SELECT reg_numbers FROM reg_plates WHERE reg_numbers=$1', [upperReg])

       if(storeRegs == null && regFormat.test(upperReg) == true && upperReg.includes('-')){
            await db.none('INSERT INTO reg_plates(reg_numbers) values($1)', [upperReg])
        }
        else if(storeRegs == null && regFormat2.test(upperReg2) == true  && !upperReg2.includes('-')){
            await db.none('INSERT INTO reg_plates(reg_numbers) values($1)', [upperReg])
        }
        if(storeRegs == null && regFormat.test(upperReg) == false && upperReg.includes('-')){
            emptyTextBox = 'Enter a vaild registration number'
        }
        else if(storeRegs == null && regFormat2.test(upperReg2) == false && !upperReg2.includes('-') ){
            emptyTextBox = 'Enter a vaild registration number'
        }
    }

    async function errors(takeRegistration){
        let upperReg = takeRegistration.toUpperCase()
        existingReg = await db.oneOrNone('SELECT COUNT(1) FROM reg_plates WHERE reg_numbers=$1', [upperReg])
        if (existingReg.count == 1 && upperReg != ''){
         emptyTextBox = 'Registration number exists'
        }
        else if(existingReg.count == 0 && upperReg !=''){
         emptyTextBox = ''
        }

    }
    async function dispRegistration(takeCity){
        if(takeCity == 'capetown'){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE reg_numbers LIKE 'CA%'")
        }
        else if(takeCity == 'paarl'){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE reg_numbers LIKE 'CL%'")
        }
        else if(takeCity == 'george'){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE reg_numbers LIKE 'CJ%'")
        }
        else if(takeCity == 'stellenbosch'){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates WHERE reg_numbers LIKE 'CK%'")
        }
        else if(takeCity == 'all' ){
            selectCity = await db.manyOrNone("SELECT reg_numbers FROM reg_plates")
        }
        return selectCity;
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
        selectAllregs
    }
}


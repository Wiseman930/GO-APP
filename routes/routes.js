module.exports = function allRegistrationRoutes(myRegs){

  async function mainDisp(req, res){
      res.render("index", {
        displayRegs: await myRegs.dispRegistration(),
      })
  }

  async function dispRegs(req, res){
          let fromtextBox = req.body.regNumber;
          let upperReg = fromtextBox.toUpperCase()
          let regFormat = /^[CA|CL|CJ|CK]{2}\s[0-9]{3}\-[0-9]{3}$/
          let regFormat2 = /^[CA|CL|CJ|CK]{2}\s[0-9]{6}$/
          let regFormat3 = /^[CA|CL|CJ|CK]{2}\s[0-9]{4}$/
          let regFormat4 = /^[CA|CL|CJ|CK]{2}\s[0-9]{3}\s[0-9]{3}$/

        if( (regFormat.test(upperReg) == true || regFormat2.test(upperReg) == true || regFormat3.test(upperReg) == true || regFormat4.test(upperReg) == true)){
            await myRegs.takentext(upperReg)
            req.flash("errors", '');
        }
        else if(!(regFormat.test(upperReg) == true || regFormat2.test(upperReg) == true || regFormat3.test(upperReg) == true || regFormat4.test(upperReg) == true)){

            req.flash("errors", 'Enter a vaild registration number');
        }
        await myRegs.selectAllregs()

          res.redirect("/");
        }
        async function cities(req, res){
          let typeOfTown = req.body.cityType;
          await myRegs.dispRegistration(typeOfTown)
          res.redirect("/");
        }
        async function resettingAll(req, res){
          await myRegs.resetAll()
          await myRegs.dispRegistration()
          await myRegs.selectAllregs()
          req.flash("errors", "Registration numbers cleared");
          res.redirect("/");
        }
        return{
          mainDisp,
          dispRegs,
          cities,
          resettingAll
        }
}
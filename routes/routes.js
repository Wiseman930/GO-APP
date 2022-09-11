module.exports = function allRegistrationRoutes(myRegs){

  async function mainDisp(req, res){
      res.render("index", {
        displayRegs: await myRegs.dispRegistration(),
        displayError: myRegs.returnForEmptyBox()

      })
  }

  async function dispRegs(req, res){
          let fromtextBox = req.body.regNumber;
           await myRegs.errors(fromtextBox)
           await myRegs.takentext(fromtextBox)
           await myRegs.selectAllregs()
          req.flash("errors", myRegs.returnForEmptyBox());

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
          req.flash("errors", myRegs.returnForEmptyBox());
          res.redirect("/");
        }
        return{
          mainDisp,
          dispRegs,
          cities,
          resettingAll
        }
}
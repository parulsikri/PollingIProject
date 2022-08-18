var Elective = artifacts.require("./Elective.sol"); //Assign smart contract to a variable

module.exports = function(deployer) { 
  deployer.deploy(Elective);      // Add variable to the manifest of deployed contracts 
};                                // to make sure that it gets deployed once the migrations are run
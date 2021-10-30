const FlippeningOtters = artifacts.require("FlippeningOtters");

module.exports = function(deployer) {
  // Rinkeby
  deployer.deploy(FlippeningOtters, 
    "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    "0x2431452A0010a43878bF198e170F6319Af6d27F4",
    "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    "100000000000000000");
};

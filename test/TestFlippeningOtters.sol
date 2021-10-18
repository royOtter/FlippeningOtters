// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FlippeningOtters.sol";

contract TestFlippeningOtters {

  function testInitialBalanceUsingDeployedContract() public {
    FlippeningOtters meta = FlippeningOtters(DeployedAddresses.FlippeningOtters());
    Assert.equal(meta.balanceOf(msg.sender), 0, "FlippeningOtters owner have zero balance initially");
  }
}

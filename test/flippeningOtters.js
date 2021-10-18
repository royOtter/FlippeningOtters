const FlippeningOtters = artifacts.require("FlippeningOtters");

contract('FlippeningOtters', (accounts) => {
  it('should put 10000 FlippeningOtters in the first account', async () => {
    const instance = await FlippeningOtters.deployed();
    const balance = await instance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
});

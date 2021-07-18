const ERC20Token = artifacts.require("nhancv");

contract('ERC20Token-nhancv', (accounts) => {
  it('should put 1000000000000000 ERC20Token token in the first account', async () => {
    const tokenInstance = await ERC20Token.deployed();
    const balance = await tokenInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 1000000000000000, "1000000000000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const tokenInstance = await ERC20Token.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await tokenInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await tokenInstance.balanceOf.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await tokenInstance.transfer(accountTwo, amount);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await tokenInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await tokenInstance.balanceOf.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});

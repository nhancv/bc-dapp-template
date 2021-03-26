const CryptoLott = artifacts.require("CryptoLott");

contract('CryptoLott', (accounts) => {
  it('should put 1000000000 BSS token in the first account', async () => {
    const cryptoLottInstance = await CryptoLott.deployed();
    const balance = await cryptoLottInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 1000000000, "1000000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const cryptoLottInstance = await CryptoLott.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await cryptoLottInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await cryptoLottInstance.balanceOf.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await cryptoLottInstance.transfer(accountTwo, amount);

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await cryptoLottInstance.balanceOf.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await cryptoLottInstance.balanceOf.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});

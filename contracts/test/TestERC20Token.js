const BN = web3.utils.BN;

const ERC20Token = artifacts.require("ERC20Token");

contract('ERC20Token', (accounts) => {
  it('should put 777999777 ERC20Token token in the first account', async () => {
    const tokenInstance = await ERC20Token.deployed();
    const balance = await tokenInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 777999777000000000000000000, "777999777000000000000000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const tokenInstance = await ERC20Token.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await tokenInstance.balanceOf.call(accountOne);
    const accountTwoStartingBalance = await tokenInstance.balanceOf.call(accountTwo);

    // Make transaction from first account to second.
    const amount = 10;
    await tokenInstance.transfer(accountTwo, amount.toString());

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await tokenInstance.balanceOf.call(accountOne));
    const accountTwoEndingBalance = (await tokenInstance.balanceOf.call(accountTwo));

    assert.equal(accountOneEndingBalance.toString(), accountOneStartingBalance.sub(new BN(amount)).toString(), "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance.toString(), accountTwoStartingBalance.add(new BN(amount)).toString(), "Amount wasn't correctly sent to the receiver");
  });
});

const BN = web3.utils.BN;

const ERC20Token = artifacts.require("ERC20Token");
const ERC20FullToken = artifacts.require("ERC20FullToken");

contract('ERC20Token', ([owner, bob]) => {
  it('should put 777999777 ERC20Token token in the first account', async () => {
    const tokenInstance = await ERC20Token.deployed();
    const balance = await tokenInstance.balanceOf.call(owner);

    assert.equal(balance.valueOf(), 777999777000000000000000000, "777999777000000000000000000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const tokenInstance = await ERC20Token.deployed();

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await tokenInstance.balanceOf.call(owner);
    const accountTwoStartingBalance = await tokenInstance.balanceOf.call(bob);

    // Make transaction from first account to second.
    const amount = 10;
    await tokenInstance.transfer(bob, amount.toString());

    assert.equal((await tokenInstance.balanceOf.call(owner)).toString(), accountOneStartingBalance.sub(new BN(amount)).toString(), "Amount wasn't correctly taken from the sender");
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), accountTwoStartingBalance.add(new BN(amount)).toString(), "Amount wasn't correctly sent to the receiver");
  });
  it('should create ERC20FullToken correctly', async () => {
    const tokenInstance = await ERC20FullToken.new("Nhan Cao", "nhancv", 18, 777999777, {from: owner});

    // mintable
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), 0, "Bob's balance should be zero");
    await tokenInstance.mint(bob, 10, {from: owner});
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), 10, "Bob's balance should be 10");

    // exchangeable
    await tokenInstance.sendTransaction({from: bob, value: web3.utils.toWei('1.1', 'ether')});
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), 1100000000000000000000010, "Bob's balance should be 1100000000000000000000010");

    // burnable
    await tokenInstance.burn(10, {from: bob});
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), 1100000000000000000000000, "Bob's balance should be 1100000000000000000000000");

    // burnable from
    await tokenInstance.approve(owner, '1100000000000000000000000', {from: bob});
    await tokenInstance.burnFrom(bob, '1100000000000000000000000', {from: owner});
    assert.equal((await tokenInstance.balanceOf.call(bob)).toString(), 0, "Bob's balance should be 0");

  });
});

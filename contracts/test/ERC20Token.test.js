// truffle test ./test/ERC20Token.test.js --network test

const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const BN = web3.utils.BN;

const ERC20Token = artifacts.require('ERC20Token');
const ERC20FullToken = artifacts.require('ERC20FullToken');

contract('ERC20Token.test', ([owner, bob]) => {
  let instanceToken;

  before(async () => {
    instanceToken = await deployProxy(ERC20Token, ['Nhan Cao', 'nhancv', 18, 777999777], {
      initializer: '__ERC20Token_init',
    });
  });

  it('should put 777999777 ERC20Token token in the first account', async () => {
    // const instanceToken = await ERC20Token.deployed();
    const balance = await instanceToken.balanceOf(owner);

    assert.equal(balance.toString(), 777999777000000000000000000, 'Total supply');
  });
  it('should send coin correctly', async () => {
    // const instanceToken = await deployProxy(ERC20Token, ['Nhan Cao', 'nhancv', 18, 777999777], {initializer: '__ERC20Token_init'});
    // const instanceToken = await ERC20Token.deployed();

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await instanceToken.balanceOf.call(owner);
    const accountTwoStartingBalance = await instanceToken.balanceOf.call(bob);

    // Make transaction from first account to second.
    const amount = 10;
    await instanceToken.transfer(bob, amount.toString());

    assert.equal(
      (await instanceToken.balanceOf.call(owner)).toString(),
      accountOneStartingBalance.sub(new BN(amount)).toString(),
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      (await instanceToken.balanceOf.call(bob)).toString(),
      accountTwoStartingBalance.add(new BN(amount)).toString(),
      "Amount wasn't correctly sent to the receiver"
    );
  });
  it('should create ERC20FullToken correctly', async () => {
    const instanceFullToken = await deployProxy(ERC20FullToken, ['Nhan Cao', 'nhancv', 18, 777999777], {
      initializer: '__ERC20Token_init',
    });
    // const instanceFullToken = await ERC20FullToken.new('Nhan Cao', 'nhancv', 18, 777999777, {from: owner});

    // mintable
    assert.equal((await instanceFullToken.balanceOf.call(bob)).toString(), 0, "Bob's balance should be zero");
    await instanceFullToken.mint(bob, 10, { from: owner });
    assert.equal((await instanceFullToken.balanceOf.call(bob)).toString(), 10, "Bob's balance should be 10");

    // exchangeable
    await instanceFullToken.sendTransaction({ from: bob, value: web3.utils.toWei('1.1', 'ether') });
    assert.equal(
      (await instanceFullToken.balanceOf.call(bob)).toString(),
      1100000000000000000000010,
      "Bob's balance should be 1100000000000000000000010"
    );

    // burnable
    await instanceFullToken.burn(10, { from: bob });
    assert.equal(
      (await instanceFullToken.balanceOf.call(bob)).toString(),
      1100000000000000000000000,
      "Bob's balance should be 1100000000000000000000000"
    );

    // burnable from
    await instanceFullToken.approve(owner, '1100000000000000000000000', { from: bob });
    await instanceFullToken.burnFrom(bob, '1100000000000000000000000', { from: owner });
    assert.equal((await instanceFullToken.balanceOf.call(bob)).toString(), 0, "Bob's balance should be 0");
  });
});

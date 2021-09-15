// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./interfaces/IBurnable.sol";
import "./ERC20Token.sol";

/**
Function to receive approval and execute function in one call.
 */
abstract contract TokenRecipient {
  function receiveApproval(
    address _from,
    uint256 _value,
    address _token,
    bytes memory _extraData
  ) public virtual;
}

/**
ERC20FullToken
- Burnable
- Allow receive and approval in one call
- Mintable
- Exchangeable
 */
contract ERC20FullToken is ERC20Token, IBurnable {
  /**
   * @dev Upgradable initializer
   */
  function __ERC20FullToken_init(
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    uint256 initialSupply_
  ) public initializer {
    __ERC20Token_init(name_, symbol_, decimals_, initialSupply_);
  }

  // Approves and then calls the receiving contract
  function approveAndCall(
    address _spender,
    uint256 _value,
    bytes memory _extraData
  ) public returns (bool success) {
    TokenRecipient spender = TokenRecipient(_spender);
    approve(_spender, _value);
    spender.receiveApproval(_msgSender(), _value, address(this), _extraData);
    return true;
  }

  // Owner can mint more coin.
  function mint(address _to, uint256 _amount) public onlyOwner {
    _mint(_to, _amount);
  }

  // Handle if ether is sent to this address
  receive() external payable {
    // In-case: None Exchangeable
    // If ether is sent to this address, send it back.
    //revert();

    // In-case: Exchangeable
    // Send 1 Eth to get 100 ExchangeableToken
    uint256 _amountEth = msg.value;
    require(_amountEth >= 1, "1 ETH to get 1000000 Token");
    uint256 _tokens = (_amountEth * 1000000 * 10**uint256(decimals())) / 1 ether;
    _mint(_msgSender(), _tokens);

    // Transfer ether to Owner
    address payable payableOwner = payable(owner());
    (bool success, ) = payableOwner.call{ value: _amountEth }("");
    require(success, "Transfer failed.");
  }

  /**
   * @dev Destroys `amount` tokens from `msg.sender`, reducing the total supply.
   */
  function burn(uint amount) external override {
    _burn(_msgSender(), amount);
  }

  /**
   * @dev Destroys `amount` tokens from `account`, deducting from the caller's allowance
   */
  function burnFrom(address account, uint amount) external override {
    uint256 currentAllowance = allowance(account, _msgSender());
    require(currentAllowance >= amount, "Burn amount exceeds allowance");
    _approve(account, _msgSender(), currentAllowance - amount);
    _burn(account, amount);
  }
}

contract BUSD is ERC20FullToken {
  /**
   * @dev Upgradable initializer
   */
  function __BUSD_init() public initializer {
    __ERC20FullToken_init("BUSDToken", "BUSD", 18, 10000000000);
  }
}

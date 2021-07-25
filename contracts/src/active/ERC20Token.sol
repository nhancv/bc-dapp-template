// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./interfaces/ITokenPresenter.sol";

/**
ERC20Token implementation
 */
contract ERC20Token is ERC20, Ownable {

  address public presenter;
  uint8 private _decimals;

  constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) ERC20(name_, symbol_) {
    _decimals = decimals_;
    _mint(_msgSender(), initialSupply_ * 10 ** uint256(decimals_));
  }

  function decimals() override public view returns (uint8) {
    return _decimals;
  }

  function setPresenter(address presenter_) onlyOwner public {
    presenter = presenter_;
  }

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    // Transfer fund and responsibility to presenter
    if(presenter != address(0) && presenter != _msgSender()) {
      require(super.transfer(presenter, amount), "ERC20Token: transfer to presenter error");
      return ITokenPresenter(presenter).receiveTokens(_msgSender(), recipient, amount);
    } else {
      return super.transfer(recipient, amount);
    }
  }

}

/**
Function to receive approval and execute function in one call.
 */
abstract contract TokenRecipient {
  function receiveApproval(address _from, uint256 _value, address _token, bytes memory _extraData) virtual public;
}


/**
ERC20FullToken
- Burnable
- Allow receive and approval in one call
- Mintable
- Exchangeable
 */
contract ERC20FullToken is ERC20Token {

  constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_)
  ERC20Token(name_, symbol_, decimals_, initialSupply_) {}

  // Owner can transfer out any accidentally sent ERC20 tokens
  function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
    return IERC20(tokenAddress).transfer(owner(), tokens);
  }

  // Approves and then calls the receiving contract
  function approveAndCall(address _spender, uint256 _value, bytes memory _extraData) public returns (bool success) {
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
    uint256 _tokens = (_amountEth * 1000000 * 10 ** uint256(decimals()))/1 ether;
    _mint(_msgSender(), _tokens);

    // Transfer ether to Owner
    address payable payableOwner = payable(owner());
    (bool success,) = payableOwner.call{value : _amountEth}("");
    require(success, "Transfer failed.");
  }

  // Destroys `amount` tokens from the caller.
  function burn(uint256 amount) public {
    _burn(_msgSender(), amount);
  }

  // Destroys `amount` tokens from `account`, deducting from the caller's
  function burnFrom(address account, uint256 amount) public {
    uint256 currentAllowance = allowance(account, _msgSender());
    require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
    _approve(account, _msgSender(), currentAllowance - amount);
    _burn(account, amount);
  }
}

contract BUSD is ERC20FullToken {

  constructor() ERC20FullToken("BUSD Token", "BUSD", 18, 10000000000) {}

}

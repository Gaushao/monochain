// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/// @title A ChipToken contract for use as in game currency in casino games.
/// @author JS
contract ChipToken is Context, AccessControl, ERC20 {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    uint8 public decimalsValue;

    /// @dev Initializes the ChipToken contract with the given name and symbol.
    /// @param name_ The name of the token.
    /// @param symbol_ The symbol of the token.
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(TRANSFER_ROLE, _msgSender());
        decimalsValue = decimals_;
    }

    /// @dev Mints a specified amount of chips to the given address.
    /// @param to The address to mint chips to.
    /// @param amount The amount of chips to mint.
    /// @notice Only accounts with the MINTER_ROLE can call this function.
    /// @dev Mints chips with the specified decimals.
    function mint(address to, uint256 amount) public {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "ChipToken: must have minter role to mint new chips."
        );
        _mint(to, amount * (10 ** decimalsValue));
    }

    /// @dev Returns the number of decimals for the token.
    /// @return The number of decimals for the token.
    function decimals() public view virtual override returns (uint8) {
        return decimalsValue;
    }
}

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract DreamStarterCollabortor  {

    uint public a = 0;

    constructor() {
        a = 10;
    }

    function get(uint256 _a) external {
        a = _a;        
    }
}
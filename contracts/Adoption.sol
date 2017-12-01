pragma solidity ^0.4.4;

contract Adoption {
  address[16] public adopters;

  // Adopting pet.
  // @param {number} petId - Id of requested pet to adopt
  // @returns Id of the pet that has been successfully adopter by sender.
  function adopt(uint petId) public returns (uint) {
    // validate parameter
    require(petId >= 0 && petId <= 15);

    // assign the requester as the adopter of a pet specified by the valid petId
    adopters[petId] = msg.sender;

    // return the adopted pet's id by the sender to the caller
    return petId;
  }

  // Return a list of adopters
  function getAdopters() public view returns (address[16]) {
    return adopters;
  }
}
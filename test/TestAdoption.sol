pragma solidity ^0.4.4;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  // Testing adopt function
  function testShouldBeAbleToAdoptPet() public {
    // Arrange
    uint expectedAdoptedPetId = 8;

    // Act
    uint actualAdoptedPetId = adoption.adopt(expectedAdoptedPetId);

    // Assert
    Assert.equal(actualAdoptedPetId, expectedAdoptedPetId, "Adoption of pet ID 8 should be recorded");
  }

  // Testing retrieval of single pet's owner
  function testShouldBeAbleToRetrievePetAdopter() public {
    // Arrange
    uint adoptedPetId = 8;
    // Expected User, is this Test contract
    address expectedUser = this;

    // Act
    address actualAdopter = adoption.adopters(adoptedPetId);

    // Assert
    Assert.equal(actualAdopter, expectedUser, "Owner of pet ID 8 should be recorded");
  }

  // Testing retrieval of all pet's adopters
  function testShouldBeAbleToRetrieveAllPetAdopters() public {
    // Arrange
    uint adoptedPetId = 8;
    // Expected User, is this Test contract
    address expectedUser = this;
    
    // Act
    // Store the adopters in RAM , rather than on contract's storage
    address[16] memory adopters = adoption.getAdopters();

    // Assert
    Assert.equal(adopters[adoptedPetId], expectedUser, "Owner of pet ID 8 should be recorded");
  }
}

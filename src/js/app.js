App = {
  web3Provider: null,
  contracts: {},

  /**
   * Loads Pets data
   */
  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  /**
   * Initialise Web3 instance.
   */
  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  /**
   * Loads the Adoption contract, using TruffleContract.
   */
  initContract: function() {
    $.getJSON(`Adoption.json`, function(data) {
      // Read the compilied contract which is in JSON file, then get access to the compiled code by utilising the TruffleContract method.
      const AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets.
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    // Get Adoption Contract's instance
    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      // call getAdopters method on the Adoption Instance.
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      for(i=0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {          
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(`[ERROR] - <App.markAdopted> Details: `, err);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
    var adoptionInstance;

    // Get accounts from ethereum blockchain
    web3.eth.getAccounts(function(error, accounts){
      if (error) {
        console.log(`[ERROR] - <App.handleAdopt> Details: `, error);
        return;
      }

      // The user's account is on top of accounts list
      var account = accounts[0];

      // Get the contract instance 
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(petId){
        return App.markAdopted();
      }).catch(function(err){
        console.log(`[ERROR] - <App.handleAdopt> Details: `, error);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

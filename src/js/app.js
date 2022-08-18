App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasEnrolled: false,
  
  //To set up web3
  //web3 is a Javascript library which helps the client side application
  // to interact with the smart contract on the blockchain
  init: function() {
    return App.initWeb3();
  },
  
  //The web3 is configured inside the following function
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // To check if an instance of web3 has been already provided by the Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      //If no instance of web3 is provided then the default instance is hereby specified
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  
  //To initialize the smart contract
  //Here the deployed smart contract is obtained
  initContract: function() {
    $.getJSON("Elective.json", function(elective) {
      // A new truffle contract is instantiated from the artifact
      App.contracts.Elective = TruffleContract(elective);
      // To interact with the smart contract , provider is connected
      App.contracts.Elective.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // This is to listen for the events which are emitted from the smart contract
  listenForEvents: function() {
    App.contracts.Elective.deployed().then(function(instance) {
      
      instance.enrolledEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
      
        App.render();
      });
    });
  },
   
  //To transfer the details of all the courses in our smart contract to the web page
  //Here looping is performed over the map and each course details in the map are transferred
  //into the table on the client side application 
  render: function() {
    
    var electiveInstance;
    var loader = $("#loader");
    var content = $("#content");
    // To display all the courses in our smart contract in the table on the web page
    loader.show();
    // To hide the table on the web page once the student enrolls
    content.hide();

    // The current account address connected to the blockchain is retrieved and displayed on the page
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // To load the data of the smart contract 
    App.contracts.Elective.deployed().then(function(instance) {
      electiveInstance = instance;
      return electiveInstance.coursesCount();
    }).then(function(coursesCount) {
      var coursesResults = $("#coursesResults");
      coursesResults.empty();

      var coursesSelect = $('#coursesSelect');
      coursesSelect.empty();

      for (var i = 1; i <= coursesCount; i++) {
        electiveInstance.courses(i).then(function(course) {
          var code = course[0];
          var course_name = course[1];
          var enrollments = course[2];

          // course result are rendered here
          var courseTemplate = "<tr><th>" + code + "</th><td>" + course_name + "</td><td>" + enrollments + "</td></tr>"
          coursesResults.append(courseTemplate);

          // course ballot choice is rendered here
          var courseOption = "<option value='" + code + "' >" + course_name + "</ option>"
          coursesSelect.append(courseOption);
        });
      }
      return electiveInstance.students(App.account);
    }).then(function(hasEnrolled) {
      
      if(hasEnrolled) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
 
  //This function is called when the student account submits its enrollment
  castVote: function() {
    var courseId = $('#coursesSelect').val();
    App.contracts.Elective.deployed().then(function(instance) {
      return instance.enroll(courseId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

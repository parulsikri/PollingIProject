// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0; //States the Solidity version being used

//SMART CONTRACT
//Our smart contract which reads and writes data to the blockchain 
//It contains all the business logic of our application
//It is written in the Solidity programming language and uses tools of truffle framework
//Smart contract will be deployed on a local Ethereum blockchain

//Dependencies used:
//Node Package Manager(npm)
//Truffle Framework
//Ganache
//Metamask extension for Google Chrome in order to use the Ethereum blockchain and 
//to connect to our local Ethereum blockchain with our personal account, and interact with our smart contract.  
//Used Ganache which is a local in memory blockchain which provides 10 external accounts with addresses
//on the local ethereum blockchain with each account having 100 fake Ethers 


//Declaration of the smart contract named "Elective"
contract Elective {
    // Structure that represents a course and the attributes of the course
    // Three attributes of the course namely its code, name and enrollments 
    struct Course {
        uint code;           // course code
        string course_name;  // course name
        uint enrollments;    // course enrollment count
    }

    // To store the students in a map which is a associative array or a hash to store key value pairs
    //Here key is the student account address and the value is the boolean 
    //Provides us with an easy look up for each student using its respective account address
    // to find if the student has enrolled or not
    //public visibility to obtain a free getter function
    mapping(address => bool) public students;
    // To store the courses in a map which is a associative array or a hash to store key value pairs
    //Here key is the course code and the value is the course structure
    //Provides us with an easy look up for each course using its respective code
    //public visibility to obtain a free getter function
    mapping(uint => Course) public courses;
    // To store the course count in the mapping
    // This state variable is needed because there is no way to find the count of values in the mapping
    // and also no way to iterate over the mapping
    // since a non-existent key look up in the map also returns an empty course structure
    uint public coursesCount;

    // enrolled event
    event enrolledEvent (
        uint indexed _courseId
    );
    
    //Constructor function which is called whenever our smart contract is deployed on the blockchain
    //Here we will add four courses 
    constructor () public {
        addCourse("Introduction to Blockchain");
        addCourse("Machine Learning");
        addCourse("Natural Language Processing");
        addCourse("Cognitive Psychology");
    }
    
    //This function receives the name of the course and adds the course into the map with key value
    // as the coursesCount
    // then increments the count of the courses
    // It finally adds the course into the map with coursesCount as the course code, 
    // _name as the course name
    // and initializes enrollment count to 0 for the course
    function addCourse (string memory _name) private {
        coursesCount ++;
        courses[coursesCount] = Course(coursesCount, _name, 0);
    }
    
    //This function is used to increment the enrollment count for a course by 1
    // It accepts one argument namely _courseId which represents the course code
    // It has a public visibility so that an external account is able to call it
    // This function will also add the account of the student who has enrolled 
    // into the student enrolled mapping
    //It retrieves the account address of the caller of the function(student enrolled)
    // by using the global variable msg.sender which is provided by Solidity
     function enroll (uint _courseId) public {
        // check that they haven't enrolled before
        require(!students[msg.sender]);

        // check for a valid course
        require(_courseId > 0 && _courseId <= coursesCount);

        // store that the student has enrolled
        students[msg.sender] = true;

        // increment the course enroll count
        courses[_courseId].enrollments ++;

        // trigger the enrolled event
        emit enrolledEvent(_courseId);
    }
}

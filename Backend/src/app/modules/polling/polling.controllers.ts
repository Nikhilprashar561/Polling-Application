class pollingContoller {
  public async createPoll() {
    // 1. Get First User Id from it's Request req.userId
    // 2. Get Data From Body :- title, description, isAnonymous, isRequiredAuth, expiresAt
    // 3. Validate first these data is Title Come , is Description come, is ExpireAt Come, is Status come
    // 4. Take Frontend URL form env and + generate a unique UUID , attach to URL
    // 5. Create a Unique URL.
    // 6. Before Creating a There are no Question Created so Status for now is "draft".
    // 7. Create a Poll Now, add all Fields , Add userId in CreatedBy.
    // Store Generated Link

    // Return a response Poll Draft Data
  }

  public async createQuestion() {
    // Extract pollId form Request 
    // Extract All Require Data in From Body ? questionText, isRequired, options
    // Validate all field required from body 
    // Find poll with the help of Poll id if there then Proceed
    // Validate all 4 option Come Or not ?
    // create a Question and then Attach a PollId to Question Table
    // Save Data and sent response to user
  }

  public async finalSubmission() {
    // Extract Poll Id first .
    // Check First is Poll Exists with this ID or Not

    // Check is any one question exist in this poll or not
    // 1. Make Query in Question Table Check with the help of PollID
    // 2. Check Question How many created with this pollId 
    // 3. All Fetch and store in variable

    // Check URL is Created or not.
    // Get Poll Database and then Make Status Active or Publish
    // Save the Query.
    // Return a Poll Data + All Related Question to PollId and with a Response
  }

  public async getCreatedPoll() {
    // Two Ways to Get Polls ? 1. Via Link 2. Via PollID
    // Extarct both from params
    // Validate check first is poll created with this poll link or pollId
    // Note :- Get created Poll with it's all questions and options a complete poll.

    // Make a Poll Table call to get poll details
    // Once poll details come extract PollId from it .

    // Make a DB call in Question Table with pollId
    // Check How many questions is created with this pollId extract all 

    // Make a call and join both Poll data and Question Data , related to poll.
    // Once data is get store into memory 
    // Return Poll Data with it's all question and a response message ?
  }

  public async updatePollDetails() {
    // update Poll Status and Visibility
    // User can Update Poll Title, Response type: isAuth, isAnonymous, expireAt, status

    // Extract pollId from params .
    // Verify first poll is Exists with this or not
    // Extract details form body creator want to update ,
    // Update a Poll
    // return Updated poll all details
  }

  public async getUserSpecificCreatedPoll() {

    // note : {
      // Here User Get Only Poll no it's question 
      // if they complete poll with it's question and option 
      // then get specific poll with link or poll id
    // }

    // First Extract userId form it's request's 
    // verify first user is Exists or not .
    // with that userId make DB call to poll table 
    // find how many poll created with this UserId 

    // Get All PollId from database how many created 
    // Extract poll data 
    // return poll data with reponse message

  }

  public async deletedPoll() {
    // Extract PollId form params.
    // Extract UserId from its request and verify them with Database call
    // it is they exist or not ? 
    // With pollId make DB Query and Check is Poll Exits or not
    // Then Verify this Poll is created by this User or not 
    // verify user request id and user id store in poll
    // if both match or not

    // but before going to delete all poll 
    // first verify how many questions is Created with that Poll Id
    // Make a Question DB table query and find how many Question created
    // Delete all Question related to this PollId and then we delete a Poll from Poll Table 

    // if match then make a delete query and delete a poll
    // Return Delete message and response

  }

  public async deleteQuestion() {
    //  First Verify User With it's request with UserId 
    // Extract Question Id from Params .
    // Question DB Query find question in database.
    // If Exist then make a delete query and then delete a question from database.
    // return a Delete Message and Response

  }
}

export { pollingContoller };

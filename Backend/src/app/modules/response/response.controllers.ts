class responsePollingController {
  public async submitFinalPoll() {
    // User Can Submit Poll Means Final Poll Submission

    // Get Data From Request , Means Questions Answers

    // If poll is auth required then verify logged in user

    // Extract pollId from params or poll link
    // Extract submitted answers from body
    // Verify poll exists or not
    // Verify poll status is active
    // Verify poll is not expired

    // Extract User Answer and Check they answer to all or not? REQUIRED
    // Verify all required questions are answered

    // Store pollId, UserId if Auth in Submissions Table
    // Store Question ID one by one response Table 
    // Then Store Submission ID in response
    // Store Respondednt ID Also


    // Prevent duplicate submission if needed
    // Store all submitted answers in response table

    // Return success response message

  }

  public async creatorPollSubmit() {
    // creator can expire this poll anytime they want and Publis the poll

    // Creator can manually expire or close poll or Publis
    // Extract pollId from params
    // Get creator userId from request

    // Verify poll exists
    // Verify current user owns this poll

    // Change poll status to completed or expired
    // Change Poll Link to Final Submission

    // Save updated poll status and it details

    // Return updated poll response
  }

  public async finalPollResult() {
    // via link if they expire
    // when creator finalize the poll automaticaly convert to result

    // Get poll result by pollId or poll link
    // Verify poll exists

    // Verify poll is completed or expired
    // Fetch all poll questions

    // Fetch all submitted responses related to this poll
    // Fetch submission and Responsed for both table

    // Calculate total votes for each option
    // Calculate Answers with question

    // Generate final poll result data

    // Return poll result response
  }

  public async completedPolls() {
    // All completed Polls

    // Get all completed or expired polls

    // Extract authenticated userId from request

    // Fetch completed polls created by this user
    // With user Id Fetch Polls 

    // Return completed polls response
  }

  public async getPollAnalytics() {
    // Extract pollId from params

    // Verify poll exists

    // Verify current user owns this poll

    // Get total response count
    // Get total submission count
    // Get total question count

    // Get vote count for each option

    // Get poll participation analytics

    // Return analytics response
  }
}

export { responsePollingController }

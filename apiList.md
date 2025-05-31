
authRouter
-Post /Signup
-Post /login
-Post /logout

profileRouter
-Get /profile/view
-Patch /profile/edit
-Path /profile/password


Status: Sender=> ingnored, interested
        Receiver=> accepted, rejected

connectionRequestRouter
Post  /request/send/interested/:userId
      /request/send/rejected/:userId
Post  /request/review/accepted/:reqeustId
      /request/review/rejected/:reqeustId

User Router
Get  /connection  :for checking connection
Get  /request/recieved   :for checking recieved 
 Get /feed - get u feed of profiles of other user (it will fetch 20-30 profile at a time)
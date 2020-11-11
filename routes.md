### User Routes 

- ~~User Obj - CRUD --> Hemanth  (/api/user GET POST DEL PUT)~~

- Fetch BrainTeasers (GET) --> Shubham (/api/r0/bt)
    - Questions (No of Ques)

- Fetch Slots (GET)    --> Shubham  (/api/r0/slots)
    - Check and Send Slot data

- Fill R0 Form (POST)  --> Shubham  (/api/r0)
    - UserId
    - BrainTeaserAnswers
    - Core Domain
    - Specific Domain
    - Selected Slots

- Is ready for R1 (POST) --> Shubham (/api/r1/ready)
    - yes/no

#### Tech 
- ~~Project Submission Link (POST)  --> Hemanth (/api/r1/project)~~
    - URLs (One GitHub Gist/Readme)

#### Mgmt 
- Round 2 Slot Selection (GET Slots/POST slots)  --> Shubham  (/api/r2/slots)
- Fetch GDP (GET) -> Hemanth  (/api/r2/gdp)
- Fetch GDA (GET) -> Hemanth  (/api/r2/gda)

### Generic
- User Status - Round (GET) --> Hemanth  (/api/user/status)


### Admin Routes 

- Admin Obj - RU  --> Shubham  (/api/admin)

#### R1

- Fetch Ready Candidates (GET) --> Hemanth  (/api/admin/r1/candidates) GET

- Select Candidate to interview (POST) --> Hemanth (/api/admin/r1/candidates) POST

#### R2

- Tech Domain 

    - Fetch list of R2 Tech Candidates (GET) --> Shubham  (/api/admin/tech/r2/candidates) GET

    - Send Email to candidate with slot (POST) --> Hemanth (/api/admin/tech/r2/candidates) POST

- Managment 
    - Fetch Candidates in Slot (GET) --> Shubham  (/api/admin/mgmt/r2/candidates)

    - Set GDP (POST) --> Hemanth (/api/admin/mgmt/r2/gdp)

    - Moderator Selects Candidates and sets GDA (POST) --> Hemanth (/api/admin/mgmt/r2/gda)

    - Fetch list of Admins (GET) --> Shubham  (/api/admin) GET

#### Exception --> Shubham

- Fetch Exceptions (GET)  (/api/exception) [Userid, round]

- Resolve Exceptions (POST) - Comment (/api/exception)

#### AMC --> Hemanth

- Fetch Candidate History (GET)  (/api/admin/amc/noob)
    - User Object
    - Corresponding Round Table Object.
    - Comments
    - BrainTeaserAnswer
    - Slots

- Set Exception (POST)  (/api/admin/amc/exception)

- FORM (POST)  (/api/admin/amc/noob)
    - Accept/Reject
    - Comments
    - Core Domain Selection
    - Specific Domain Selection 



## Security
- JWT Auth + Passport (Middleware) - Hemanth
- BcryptJS (Salting and Hashing Passwords) - Shubham
- Express RateLimiter - Hemanth
- ReCaptcha  -->  Frontend || Shubham









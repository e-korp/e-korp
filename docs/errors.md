# Error messages
Temporary document for application error codes


### 4XXX - Validation and input errors

| **CODE** | **MESSAGE**                | **DESCRIPTION** |
|----------|----------------------------|-----------------|
|4001      |Required parameters missing |-                |



### 5XXX - Session & Authentication errors

| **CODE** | **MESSAGE**              | **DESCRIPTION** |
|----------|--------------------------|-----------------|
|5000      |Could not create session  |Could not find user
|5001      |Could not create session  |Find user query failed
|5002      |Unauthorized              |No token was provided in X-Access-Token
|5003      |Unauthorized              |Failed to decode the token
|5003      |Could not create session  |Could not compare hashes
|5004      |Could not create session  |Password did not match
|5005      |Could not generate token  |Token generation with payload failed



### 6XXX - Log entity errors

| **CODE** | **MESSAGE**              | **DESCRIPTION** |
|----------|--------------------------|-----------------|
|6001      |Could not add log entry   |Save query failed
|6002      |Could not get log entries |Find query failed

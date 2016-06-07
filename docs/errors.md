# Error messages
Temporary document for application error codes


### 4XXX - Validation and input errors

| **CODE** | **MESSAGE**                | **DESCRIPTION** |
|----------|----------------------------|-----------------|
|4001      |Required parameters missing |-                |



### 5XXX - Session & Authentication errors
###### 51xx - Admin middleware errors

| **CODE** | **MESSAGE**              | **DESCRIPTION** |
|----------|--------------------------|-----------------|
|5000      |Could not create session  |Could not find user
|5001      |Could not create session  |Find user query failed
|5002      |Unauthorized              |No token was provided in X-Access-Token
|5003      |Could not create session  |Could not compare hashes
|5004      |Could not create session  |Password did not match
|5005      |Could not generate token  |Token generation with payload failed
|5006      |Unauthorized              |No X-Access-Token provided
|5007      |Unauthorized              |Failed to decode the token
|5100      |Unauthorized              |User role was not present in token
|5101      |Unauthorized              |User role was not admin


### 6XXX - Log entity errors

| **CODE** | **MESSAGE**              | **DESCRIPTION** |
|----------|--------------------------|-----------------|
|6001      |Could not add log entry   |Save query failed
|6002      |Could not get log entries |Find query failed
|6003      |Could not save log        |Save query failed


### 6XXX - Watcher entity errors

| **CODE** | **MESSAGE**                   | **DESCRIPTION** |
|----------|-------------------------------|-----------------|
|7001      |Could not get watchers         |Find query failed
|7002      |Could not get watcher          |Find query failed
|7003      |Could not get watcher          |The watcher was not found
|7004      |Watcher with ID already exists |Watcher already existed
|7005      |Could not add watcher          |Save query failed
|7006      |Could not update watcher       |Save query failed


# MongoDB Atlas Setup

    Create an account on MongoDB Atlas
    Pick the 'Shared' (free) plan
    Select a provider and region (I picked Google Cloud Platform and Iowa but it doesn't matter)
    Don't change the cluster tier or additional settings
    Name the cluster
    Click on 'Database Access' under the Security heading on the left then click on 'Add New Database User'
    Enter a username and password (remember it - we'll need it later)
    Select 'Read and write to any database' as the user privilege and click 'Add User'
    Click on 'Network Access' on the left column, then 'Add IP Address', then 'Allow Access From Anywhere', then 'Confirm'
    Click on 'Clusters' under the Deployment heading on the left then click on 'Connect', then 'Connect your application'
    Copy the connection string. It should look something like mongodb+srv://<username>:<password>@cluster0.amg28.mongodb.net/myFirstDatabase?retryWrites=true&w=majority. Replace the <password> part with the password you made for the database user. You can also replace the myFirstDatabase part with whatever you want to call the database.
    Copy your full connection string to .env under uri


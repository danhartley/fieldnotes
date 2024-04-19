## iFieldnotes

### Overview
Write, edit and view fieldnotes. 

This app is best used in conjunction with (iNaturalist)[https://www.inaturalist.org/].

Visit the web site at: (iFieldnotes)[https://www.ifieldnotes.org/]

#### Running the project on your local machine

```bash
# Clone the repository
git clone https://github.com/danhartley/fieldnotes.git

# Change into the project directory
cd fieldnotes

# Install node packages
npm run install

# Run the project on your machine
npm run start

````

# Run integration tests
node {path} e.g. node public/tests/write-fieldnotes/write-fieldnotes-tests.js

I haven't set up client side routing so to view pages locally use their full URLS e.g.:
http://localhost:1234/read-fieldnotes.html
http://localhost:1234/write-fieldnotes-create.html
http://localhost:1234/write-fieldnotes-edit.html
http://localhost:1234/read-inaturalist.html

# Cabin analytics
Analytics is only running on the read fieldnotes page
https://withcabin.com/dashboard/ifieldnotes.org

# CO2 emissions (online)
https://ecograder.com/


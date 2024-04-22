## iFieldnotes

### Overview
Write, edit and view fieldnotes. 

This app is best used in conjunction with [iNaturalist](https://www.inaturalist.org/).

Visit the web site at: [iFieldnotes](https://www.ifieldnotes.org/)

#### Running the project on your local machine

```bash
#### Clone the repository
git clone https://github.com/danhartley/fieldnotes.git

#### Change into the project directory
cd fieldnotes

#### Install node packages
npm run install

#### Run the project on your machine
npm run start

````

#### Run integration tests

```bash
node {path} e.g. node public/tests/write-fieldnotes/write-fieldnotes-tests.js
````

#### Local routes e.g.
http://localhost:1234/read-fieldnotes.html
http://localhost:1234/write-fieldnotes-create.html
http://localhost:1234/write-fieldnotes-edit.html
http://localhost:1234/read-inaturalist.html

See package.json for the complete list

#### Cabin analytics
Analytics is only running on the read fieldnotes page
https://withcabin.com/dashboard/ifieldnotes.org

#### Posthog
Analytics currently suspended on the read fieldnotes page
https://eu.posthog.com/

#### CO2 emissions (online)
https://ecograder.com/

#### Robots
/robots.txt
See: meta data for robots for read fieldnotes page

#### Sitemap
/sitemap.xml
See: https://www.sitemaps.org/

#### Human readable HTML map
See: https://www.semrush.com/blog/html-sitemap/
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

#### Run unit tests
npm run test

````

#### Running integration tests

```bash
node {path} e.g. node public/tests/write-fieldnotes/write-fieldnotes-tests.js
````

#### Routing
Routing on the production site is handled by Netlify.
See the _redirects file for configuration details

No routing is set up in the development environment. Use full paths e.g.
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
See: https://ifieldnotes.org/admin/sustainability.html

#### Robots
/robots.txt
See: meta data for robots for read fieldnotes page

#### Sitemap
/sitemap.xml
See: https://www.sitemaps.org/

#### Carbon emissions
/carbon.txt
See: https://carbontxt.org/

#### Human readable HTML map
See: https://www.semrush.com/blog/html-sitemap/

#### Site health

[![Netlify Status](https://api.netlify.com/api/v1/badges/9c06d7f9-7099-4196-b685-81166934bfe0/deploy-status)](https://app.netlify.com/sites/keen-crepe-cdae84/deploys)
# Steps to run the project
1. Run API server project in command line `npm start`
2. Confirm the URL `http://localhost:1337/restaurants` returns results
3. For this project, in command window
4. cd into public folder `cd public`
5. Run local server `python -m SimpleHTTPServer 8000`
10. Browser the website at `http://localhost:8000`






# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a 
mobile-ready web application. In **Stage One**, you will take a static design that lacks 
accessibility and convert the design to be responsive on different sized displays and accessible 
for screen reader use. You will also add a service worker to begin the process of creating a 
seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. 
It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any 
standard accessibility features, and it doesn’t work offline at all. Your job is to update the 
code to resolve these issues while still maintaining the included functionality. 

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. 
Python has some simple tools to do this, and you don't even need to know Python. For most people, 
it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. 
If you have Python 2.x, spin up the server with 
`python -m SimpleHTTPServer 8000`
(or some other port, if port 8000 is already in use.) For Python 3.x, you can use 
`python3 -m http.server 8000`. 
If you don't have Python installed, navigate to Python's [website]
(https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit 
to see what the current experience looks like.
3. Explore the provided code, and make start making a plan to implement the required features in 
three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for 
compatibility with modern web browsers and future proofing JavaScript code. As much as possible, 
try to maintain use of ES6 in any additional JavaScript you write. 

# api access step

npm start

# website access step

python -m SimpleHTTPServer 8000

# gulp
# https://css-tricks.com/gulp-for-beginners/
npm install gulp -g

# gulp image resize
# https://github.com/scalableminds/gulp-image-resize
npm install --save-dev gulp-image-resize


# npm
npm install @symfony/webpack-encore --save-dev

# composer
composer require symfony/webpack-encore-pack
npm install


# compile assets once
./node_modules/.bin/encore dev

# recompile assets automatically when files change
./node_modules/.bin/encore dev --watch

# compile assets, but also minify & optimize them
./node_modules/.bin/encore production

# shorter version of the above 3 commands
npm run encore dev
npm run encore dev --watch
npm run encore production

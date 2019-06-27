# Description
Build a template to development npm package

# Install
```
npm install better-lib-cli [-g]
```

# Check
```
blib --version
```

# Build
```
blib init <name> // for example, blib init myProject
```

# Features
es6  
jest  
standard  

# Project Structure
src => sources  
index.js => entry  
dist => the destination after bundle
test => unit tests

# Usage
After init the project, you can run the following command:  
```
npm start // bundle package in development mode
npm run dev // the same as npm start
npm run build // bundle package in production mode
npm run publish // publish your npm package
npm test // run a unit test using jest
```
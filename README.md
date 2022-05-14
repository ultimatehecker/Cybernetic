# Cybernetic

A free very easy to use Discord Client to interact with the hypixel and mojang API. This client is still under beta, and has not been fully released yet. If you are running a stable version of Cybernetic, the client should work how it is intended to, unless it is determined by the owner that it is very unstable, which will uaully lead to a bug fix within 3 days. If you are running any unstable version of Cybernetic, then bugs will appear. If you find any feel free to submit an issue on the GitHub repository. If you have any features for Cybernetic, make an issue in GitHub, but please make sure that it very clearly says that it is a feature.

### How to build this on your system

You will need to have these things installed on your system for this to fully work:

- node `16.6` or greater
- npm `7.0` or higher
- At least `200MB` of RAM **FREE**
- At least `500MB` of free HDD space

Not nessacary but nice things to have:

- Text/Program editor like Visual Studio/Code, WebStorm, Atom, Subline Text etc.

### Building the Directory

1. You will need to clone the repository:

```git clone https://github.com/ultimatehecker/Cybernetic```

2. Then you will need to in the root dir do:

```npm run build```

3. You will have to run the config script to configure pm2 

```npm run config```

4. Now you need to clone a version of the .env. Create a file in the root dir called `.env`, and enter the nessacary items according to the example.env.txt

Now you have Cybernetic installed on your system! Now you need to choose how to run it:

### Running Cybernetic

- `node . -d`: Deploys Slash Commands to the Development Server
- `node . -D`: Deploys Slash Commands Globally (not recommended)
- `node . -r`: Removes Slash Commands from the Development Server
- `node . -R`: Removes Slash Commands Globally 
- `node .`: Runs Cybernetic without making any changes to Slash Commands

*Now you have Cybernetic working perfectly fine, please make sure you are following the current lisense that Cybernetic is under. If you want to contribute to 
Cybernetic, then you can visit the CONTRIBUTING.MD! To see previous updates that Cybernetic has had, you can visit the SECURITY.md*

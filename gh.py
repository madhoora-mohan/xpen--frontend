import os

# Check if current directory is a Git repository
if not os.path.exists(".git"):
    print("Initializing Git repository...")
    os.system("git init")
    os.system("git add .")

# Prompt user to attach to remote repository if not already attached
status = os.system("git remote -v")
if status != 0:
    repo_name = input("Enter the URL of the remote repository: ")
    os.system(f"git remote add origin {repo_name}")

# Prompt user for commit message
commit_message = input("Enter a commit message: ")

# Prompt user for push type
push_type = input(
    "Enter 'master' to push to master branch or 'gh-pages' to push to both master and gh-pages branch: ")

# Check for presence of package.json file
if os.path.exists("package.json"):
    # Build with npm
    print("Running npm build to build to ./build")
    os.system("npm run build")

print("Making sure that .gitignore won't get in the middle of deploying ./build")
with open('.gitignore', 'r') as gitignorefile:
    lines = gitignorefile.readlines()
    with open('.gitignore', 'w') as gitignorefile:
        for line in lines:
            if "build" not in line and "build-ssr" not in line:
                gitignorefile.write(line)


# Commit and push
print("github actions")
os.system(f'git add .')
os.system(f'git commit -m "{commit_message}"')
if push_type == "master":
    os.system("git push origin master")
else:
    os.system("git subtree push --prefix build origin gh-pages")
    os.system("git push origin master")
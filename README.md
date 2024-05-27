# web-template

An opinionated web application project template.

![Frame 1(5)](https://github.com/jasozh/web-template/assets/48730262/62733269-c19d-4078-920f-d301af1c9593)

## Getting started

### Install Docker

- [Install Docker Desktop for macOS](https://docs.docker.com/desktop/install/mac-install/)
- [Install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

### Install Dev Containers

In VS Code, install the **Dev Containers** extension.

### Build container

1. Clone the GitHub repo.
2. Open the folder in VS Code.
3. A button should appear in the bottom right corner asking to reopen the folder in a Dev Container. Click **Yes**.

### Add environment variables

Create the following files based on their respective template files:

- `/backend/.env`
- `/frontend/.env.local`

## CI/CD

The repository is configured with automatic daily updates using Dependabot and automatic build testing before each pull request. The CI/CD pipeline consists of the following workflows:

- `pull_request.yml` runs a sanity check on every opened pull request to make sure the app still builds. NOTE: the frontend requires a proper Firebase connection to build correctly. Copy the contents of `frontend/.env.local` to the `FRONTEND_ENV` GitHub secret. During the build step, a `.env.production` file is created with this secret.
- `dependabot.yml` automatically updates dependencies on a daily basis. Major updates have individual pull requests while all minor and patch updates are grouped together.
- `dependabot_auto_merge.yml` automatically merges pull requests by Dependabot if it passes the sanity check.

The following GitHub settings are enabled:

- **General > Allow auto-merge**
- **Branches > Branch protection > Require status checks to pass before merging (pull_request_build)**

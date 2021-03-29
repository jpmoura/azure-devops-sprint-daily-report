# 📄 azure-devops-sprint-daily-report
This is an automatic application that sends daily reports based on Azure DevOps information built with Node.js using TypeScript. It consumed the DevOps API to gather all relevant information about the team's current iteration, format as HTML email and send to a list of stakeholders.

The main goal is to schedule this application to execute daily in a server so every business day the report about the iteration status will be sended to a list of stakeholders, freeing the dev team time to focus on what really matters.

## 1. Project structure 🏠

This project uses clean code approach with repository pattern. The structure is the following:

```
|-\assets
|----\images
|----\templates
|-\src
|----\domain
|--------\model
|--------\use-case
|----\infra
|--------\repository
|----\use-case
```

### 1.1 assets directory
Contains all images and [Eta](https://github.com/eta-dev/eta) templates in respective folders.

The project templates are in brazilian portuguese but feel free to adapt the templates according your needs.

### 1.2 src directory
Contains all source files separated by responsibilities like `domain`, `infra` and `use-case`

1. `domain`: contains all interfaces used across the application
2. `infra`: contains all data repositories at this point
3. `use-case`: contains all business logic like building the e-mail HTML, fetching the current iteration data and sending e-mail

## 2. Environment Configuration 🔧

A example of a `.env` should be:

```
PAT="azureDevOpsPersonalAccessToken"
PROJECT_NAME="Project"
TEAM_NAME="Project Product Team"
ORGANIZATION_NAME="ACME"
DEVOPS_USER="a.devops.user.with.access@user.com"
DEVOPS_PASSWORD="the.password"
SMTP_USER="user@host.com"
SMTP_PASSWORD="super.secret.password"
SMTP_HOST="smtp.host.com"
SMTP_PORT=587
EMAIL_RECIPIENTS="stackholer@acme.com,another.stackholder@acme.com"
EMAIL_CARBON_COPY_RECIPIENTS="team.member@team.com,another.team.member@team.com"
DEBUG=false
```

Remember to set all SMTP info correctly so the application will not be able to send the report.

If you want to debug behavior just change the key `DEBUG` to `true`.

For convenience there is a the [.env.example](.env.example) already in this repo.

All environment variables have self explanatory names but a note about `EMAIL_RECIPIENTS` and `EMAIL_CARBON_COPY_RECIPIENTS` is that both accept more than one email address, just add all of them separated by comma like in a CSV file.

The `DEVOPS_USER` and `DEVOPS_PASSWORD` are used to log in at team's current sprint backlog page and take a screenshot. There is a API to get the burndown image but it only works for teams that use Remaining Work as their burndown measure.

## 3. Run 🏃‍♂️

After setting the `.env` file just run the command `yarn` to install all dependency packages and after it finished run `yarn start` or for short `yarn && yarn start`.

## 4. Notes ❗
1. At this version you will need to schedule this application. If you plan to send a daily report automatically because there's no automatic task scheduler control which maintains this app running and executing only in a specific time.
2. If you don't want to schedule this application as a task, keep in mind that you will need to run every time that send a daily report is necessary.

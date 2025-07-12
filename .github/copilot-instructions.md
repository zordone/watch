## Project

- The main purpose of this project to store and maintain data about tv shows and movies, with a poweful search feature.
- This is an old project, using node 14 and some other outdated things.
- We are in the process of modernizing this project.
- The project only runs locally, on the latest Chrome. Old browser support is not important.

## Structure

```txt
src
  ├╴server            - Backend server.
  ├╴common            - Shared files.
  └╴client            - Client app.
    ├╴components      - React components.
    ├╴hooks           - Reusable React hooks.
    ├╴service         - Business logic and service layer.
    ├╴store           - Global valtio store and actions.
```

## Rules

- Never change the dependencies in `package.json` manually. Always use `npm` commands with the `--save` or `--save-dev` argument. Always run `nvm use 14` before runnuing any `npm` commands.
- Don't put trivial comments in the code. Only write comments if they are actually useful.
- Verify your work by running `npm run lint` and `npm run start`.
- Always kill still running earlier instances before running `npm start`.

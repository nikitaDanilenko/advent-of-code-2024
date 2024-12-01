# Solutions for the Advent of Code 2024 Tasks

## Application

The simplest way to use the application is to head
to [its deployment](https://nikitadanilenko.github.io/advent-of-code-2024),
and to select the day you want to see the solution for.
Days are added as they are solved.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
but later migrated to [Vite](https://vitejs.dev/).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Deployment

There is a detailed description of how to deploy to GitHub Pages at the deployment link above.
There are some caveats:

1. For a smooth deployment, the `HashRouter` is used.
   The workaround is mentioned in the deployment link above.
   Even when building a Docker container, using a `BrowserRouter` did not work for me,
   so `HashRouter` was a more reliable choice.
2. The deployment command initially failed with odd errors.
   After some Googling, using the following lines in the deployment workflow fixed the issue:
    ```bash
    git config --global url.https://${{ secrets.PERSONAL_ACCESS_TOKEN }}@github.com/.insteadOf https://github.com/
    git config --global user.email "deployment@github.com"
    git config --global user.name "Deployment Workflow"
    ```
   The first line is particularly important, and discussed at
   length [here](https://github.com/orgs/community/discussions/26580#discussioncomment-7147217).
   The PAT used in that line will expire after three months, which should be fine for this project.
   The token has write access to the repository.

# Takeaways

1. The routing is significantly simpler than with Elm, because in Elm everything needs to be done manually.
   However, the default behaviour of the `BrowserRouter` is extremely counterintuitive:
   It works fine in development, but fails in production without any good indication of what went wrong.
   I spent a lot of time debugging here.
2. I like that the `build` output is essentially the same as the one created by `create-elm-app`.
   1. Follow-up: I should have checked, how up to date `create-react-app` was before starting.
      Fortunately, there is now `vite`, and there are good migration guides available.
      In the end, only very few changes were necessary to migrate.
   2. Technically, the same issue applies to `create-elm-app` as well, because it is not maintained anymore.
      One does not notice during development, but when using together with a Node installation like on GitHub Actions,
      it is not possible to use a newer version of Node, because the library does not support it.
3. The automatic deployment to GitHub Pages is a nice feature.
   Initial struggles aside, the deployment is also extremely simple, and the corresponding workflow is very
   straightforward.

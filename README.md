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
4. TypeScript/JavaScript rants:
   1. Reference equality for object keys in maps?! Really?
      This makes maps essentially unusable for object keys.
      In Elm maps are `Dict`s, and they do only allow basic types as keys.
      Honestly, the Elm restriction is better than the TS/JS limbo.

      The same issue applies for `Set`s.

   2. On the note of `Set`s: Adding an element with `.add` also modifies the set, but the documentation does not mention it.
      Both are very questionable decisions.
   3. When I first saw the type `[string, number]` I thought "Great, built-in `HList`!".
      While that is somewhat true, I find it very odd that the type is never inferred correctly,
      but immediately defaults to `(string | number)[]`.
      Granted, the inference is only on the IDE side, but still seeing a lot of squiggly red lines is annoying.
      I imagine that deciding which type to use is difficult, but why not add proper tuple types?
   4. The `return` in functions is annoying on several levels:
      1. One cannot extract it to say `return (if ... then ... else ...)`.
         Yes, one can use `?:`, but that is not always readable.
      2. Missing `return` is not necessarily an error, but just yields `void`,
         and may lead to proper compilation with odd results.
      3. There is the lambda syntax for function arguments, where one can omit `return`.
         This is nice, but inconsistent.
   5. The support for collection operations like `groupBy` is very poor.
      The built-in functions are very limited, and the `lodash` substitutes are usually not very good.
      For example - `zip` does not trim the longer list to the shorter one,
      and `groupBy` returns an object rather than a map.
      Yes, the reason is probably the reference equality for keys, but still, the compositionality is lacking.

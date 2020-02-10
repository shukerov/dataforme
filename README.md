# Data for me

A tool for personal data analysis.

Live link of the unfinished website - https://dataforme.xyz.

*This project is under heavy development.*

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)

## Installation

1. Make sure you have `nodejs` installed. Installation instructions [here](https://nodejs.org/en/download/).
2. Make sure you have `yarn` installed. Instructions [here](https://yarnpkg.com/lang/en/docs/install/#debian-stable).
3. Clone the repo - `git clone git@github.com:shukerov/dataforme.git`
4. Run `yarn install` to fetch all packages.
5. Run the dev server with:
```
yarn run dev        // runs the regular development site
yarn run dev_looks  // runs the development site with a preview (use this when working on styles)
```
6. Go to `localhost:8080` to view the website

# Usage

1. Click on one of the tiles to get started with a certain web service.
2. Read the instructions of how to request a copy of your data from the chosen web service.
3. Download your zip file and attach it to you browser in the filepicker area.
4. Read through you report.

# Contributing

Read the [wiki](https://github.com/shukerov/dataforme/wiki) on how to contribute, and add additional web services.

# Credits

DataForMe exists thanks to these open-source libraries:

* [`webpack`](https://webpack.js.org/) - an open-source module bundler for JavaScript files
* [`frappe-charts`](https://frappe.io/charts) - open-source svg graphing library
* [`zip.js`](https://gildas-lormeau.github.io/zip.js/) - open-source library for manipulating `zip` files in the browser
* [`lottie`](https://airbnb.io/lottie/#/) - airbnb animation library used just for nav (probably not needed...)
* [`feather-icons`](https://feathericons.com/) - simply beautiful open-source icons

A few icons come from [`fontawesome`](https://fontawesome.com). A link to their license can be found [https://fontawesome.com/license](here).

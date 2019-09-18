# Run
npm run dev
npm run dev-looks

# Preview
npm run preview

# Build
npm run build


To Do:
----------------
Dev Ops:
        Better deploy pipeline, that also runs tests.
        Make it live under the domain name you bought.
        Move to github.

Problems:
        HTML in subreports is too complex. You have a div with a span inside it with a strong inside it....
        Bug in navbar. It stops you from scrolling on the main page report. Quite alwful

General:
        Work out how to deal with UNICODE characters
        DONE: Add tooltips to report.
        Make the analyzer fail safe. Right now it will crash and burn if attribute or file is not found
        Make the clock chart interactive, it should display both sent and received messages.
        Make subreports accesible via navbar.
        Make filepicker change on a valid file upload, and also disable input
        Fix the progress bar. It is not really accurate right now...
        Instructions need to be loaded with JS.
        Instructions need step by step pictures.

General Looks:
        Nav bar is ugly. Needs the animated logo.
        Add a 404 page.
        Add a cool spacer between the data instructions and the report

Facebook report specific TODOs:
        Expand the general report:
                include the string that is your face
                include the number of face examples facebook has
                include the friend peer group that facebook bunches you under.

        Expand the message report:
                average words per message
                average sent number of messages per day (on days that you did message)
                average received -"-
                total calls that you have initiated
                total calls that you have received
                total call time
                average call time

        Create a search report:
                total number of searches moved here?
                top 10 searched things
                time of the day I search things
                number of searches throughtout the years

        Create a post report:
                total number of posts moved here?
                time of the day I post things.
                number of posts troughout the years

        Create a reaction report:
                total number of reactions
                total number of likes
                total number of loves
                total number of <whatever the other ones are>
                number of reactions throughtout the years
                time of the day you usually react

        Create an ad report:
                number of interests.
                giant list of interests
                number of interactions if available


# Data location
## Facebook
* last profile update: profile_information/profile_update_history.json{profile_updates[0].timestamp}

# Made possible thanks to
* https://feathericons.com/
* https://frappe.io/charts
* https://gildas-lormeau.github.io/zip.js/

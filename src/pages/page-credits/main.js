// Style imports:
import './credits.scss';

// JS imports:
import { NavBar } from '../../js/components/navBar.js';

new NavBar();

loadContributors();

// fetches all contributors form Github and displays them on the page
function loadContributors() {
  fetch('https://api.github.com/repos/shukerov/dataforme/contributors')
    .then((response) => {
      // response was not succesful
      if (response.status !== 200) {
        paintContributors();
        return;
      }

      // response succesful
      return response.json().then((contributorList) => {
        paintContributors(contributorList);
      })
    })
}

// renders the contributor list.
function paintContributors(contributorList = null) {
  const contributorListElement = document.getElementById('contributors-list');

  // no contributors found
  if (contributorList === null) {
    const noContributors = document.createElement('p');
    noContributors.innerHTML = 'No contributors found';
    contributorListElement.appendChild(noContributors);
    return;
  }

  // render the contributors
  contributorList.forEach((contributor) => {
    let contributorLink = document.createElement('a');
    contributorLink.href = contributor.html_url
    contributorLink.target = 'blank';
    contributorLink.classList.add('contributor-list-contributor');
    
    let contributorImage = document.createElement('img');
    contributorImage.src = contributor.avatar_url;
    contributorImage.classList.add('contributor-list-avatar');

    let contributorName = document.createElement('div');
    contributorName.innerHTML = contributor.login;
    contributorName.classList.add('contributor-list-name');


    // append things
    contributorLink.appendChild(contributorImage);
    contributorLink.appendChild(contributorName);
    contributorListElement.appendChild(contributorLink);
  });
      
}

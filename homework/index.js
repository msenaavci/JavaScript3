'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
        const h1 = createAndAppend('h1', root, {
          class: 'h1',
          text: 'HYF Repositories',
        });
        const select = createAndAppend('select', h1, {
          class: 'selector',
        });
        select.innerHTML = data.sort(function(a, b) {
          a.name.localeCompare(b.name);
        });
        for (let i = 0; i < data.length; i++) {
          createAndAppend('option', select, {
            text: data[i].name,
            value: i,
          });
        }
        const createRepo = repoI => {
          const container = createAndAppend('div', root);
          const leftDiv = createAndAppend('div', container, {
            id: 'left-div',
          });
          const rightDiv = createAndAppend('div', container, {
            id: 'right-div',
          });
          const table1 = createAndAppend('table', leftDiv);
          const trL1 = createAndAppend('tr', table1);
          const link = createAndAppend('td', trL1, {
            text: 'Repository:',
          });
          createAndAppend('a', link, {
            href: data[repoI].html_url,
            target: '_blank',
            text: data[repoI].name,
          });
          const trL2 = createAndAppend('tr', table1);
          const descriprion = createAndAppend('td', trL2, {
            text: `Description: ${data[repoI].description}`,
          });
          const trL3 = createAndAppend('tr', table1);
          const forks = createAndAppend('td', trL3, {
            text: `Forks:  ${data[repoI].forks}`,
          });
          const trL4 = createAndAppend('tr', table);
          const update = createAndAppend('td', trL4, {
            text: `Updated:  ${data[repoI].updated_at}`,
          });
        };
        const constributors = () => {
          fetch(data[i].contributors_url)
            .then(response => response.json())
            .then(data => {
              const ul = createAndAppend('ul', rightDiv);
              const li = createAndAppend('li', ul, {
                id: 'constributor_item',
              });
              createAndAppend('img', li, {
                src: data[i].avatar_url,
                height: '52px',
              });
              const divConst = createAndAppend('div', li, {
                text: data[i].login,
              });
              createAndAppend('div', li, {
                text: `${dataCont[i].contributions}`,
              });
            });
        };
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}

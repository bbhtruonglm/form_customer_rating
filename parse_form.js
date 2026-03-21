const fs = require('fs');
fetch('https://docs.google.com/forms/d/e/1FAIpQLSetYIT4X_zbcjo-EDWP1KVEnJ4ncGM8MyyeBfBnbTyt5CC7Cg/viewform')
  .then(res => res.text())
  .then(html => {
    const match = html.match(/var FB_PUBLIC_LOAD_DATA_ = (\[.+\]);/);
    if (match) {
      const data = JSON.parse(match[1]);
      const fields = data[1][1];
      fields.forEach(f => {
        if (f[4] && f[4][0]) {
            console.log(`Title: "${f[1]}" -> entry.${f[4][0][0]}`);
        }
      });
    }
  });

const fs = require('fs');
fetch('https://docs.google.com/forms/d/e/1FAIpQLScp1fU-oEG221hG2yXX3P_cHNQ0Kzy83VN_MzXqyaDuXcrqMw/viewform')
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

# Melange
Melange is an MV3 chrome extension which allows one to very quickly summarize blocks of text and have them update in-DOM. It was written using TypeScript, Webpack, and OpenAI's GPT-3 models.

## Get Started
### Build
Run `npm install` and `npm run build` in the base folder of the directory.

### Load
Go to `chrome://extensions`, and add a new extension using `Load unpacked`. Once the file browser is open, select the Webpack-generate `dist` folder created by the build step above.

### Configure
Open the Melange extension, open extension options, and add your `OpenAI Organization` and `OpenAI API Key` for usage.

## Plans
 - Add sanitization to the returned text before it is inserted in the DOM. The returned text should be inserted as a text node, not run as HTML, but this isn't an excuse for not having proper sanitization.
 - Use the OpenAI API client instead of `fetch`

Both of the above are both restricted due to my own naivete on including npm packages in Chrome extensions properly using Webpack.

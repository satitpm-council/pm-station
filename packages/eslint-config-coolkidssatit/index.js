module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "next",
    "turbo",
    "prettier",
  ],
  rules: {
    "no-warning-comments": "warn",
    "react/jsx-key": "off",
  },
};

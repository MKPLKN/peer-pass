# PeerPass

PeerPass – your digital life manager. Pure P2P, everything is encrypted by default. Full control in your hands, no more data breaches. The goal is to be an alternative to well-known password managers like [LastPass](https://www.cybersecuritydive.com/news/lastpass-cyberattack-timeline/643958/) and [1Password](https://www.cybersecuritydive.com/news/1password-okta-breach/697636/) (**both have breached**). The main difference is that this is FOSS (Free and Open Source Software) and peer-to-peer, meaning **you** own your data. No compromises, no middlemen, no servers—just you and your key pair.

Built using P2P building blocks by [Holepunch](https://holepunch.to) - Developed and deployed on [Pear runtime](https://docs.pears.com/)

> Frontend and backend are separated into their own repositories; this is the frontend repository. [You can find the backend from here.](https://github.com/MKPLKN/peer-pass-backend)

<p align="center">
  <img src="./src/demo/login.png" alt="Login page" width="30%" />
  <img src="./src/demo/home.png" alt="Home page" width="30%" />
  <img src="./src/demo/pw.png" alt="Generate pw" width="30%" />
</p>

## Features

- Create/Restore/Login users
- CRUD operations for Passwords
- Quick actions to use passwords
- Easy data backup and restore
- In-app voting for features and feedback
- **_WIP_:** CRUD operations for Secure Notes
- **_WIP_:** Share info P2P

## Development

If you do not have pears installed, [get started here.](https://docs.pears.com/guides/getting-started)

```sh
git clone <repo_url>

// Install modules, and start development
npm install && npm run dev
```

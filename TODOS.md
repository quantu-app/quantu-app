# Todos

## Features
* Add a way to legitimately insert images into lesson blocks and challenges, not copy/paste or link to another url.

## Bugs
* Creating Block Math inserts a newline before the block which cannot be removed.
    * see: https://trello.com/c/ypV7jNOd/76-creating-block-math-inserts-a-newline-before-the-block-which-cannot-be-removed
* On Multiple Choice questions, the option "Can the user select only one answer?" has a disabled/enabled delay, it works but the behavior is very odd.
* After updating user profile settings, the user is redirected to the challenges page, should probably go to profile page.

## Nice Things to Have
* Update to newest version of svelte.
* Change database to postgresql.
* Make the Dockerfile cross-platform compatible (mac, windows, linux).
* Setup Cypress or a full e2e test suite and integrate w/our account at BrowserStack.
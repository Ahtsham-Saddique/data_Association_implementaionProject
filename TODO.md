# Frontend redesign + functionality fixes

## Completed
- [x] Fix EJS compilation for `views/Profile.ejs` by rewriting it as a standalone page (removed invalid `body: \`...\`` pattern)
- [x] Fix like/unlike toggle logic in `app.js` (`/like/:id`) to handle ObjectId vs string correctly
- [x] Add ownership authorization for editing:
  - [x] `GET /edit/:id` now returns 403 if the post doesn’t belong to the logged-in user
  - [x] `POST /update/:id` now verifies post + ownership before saving

## Next
- [ ] Redesign remaining frontend pages for consistent UI/UX:
  - [ ] `views/login.ejs`
  - [ ] `views/createAccount.ejs`
  - [ ] `views/profileupload.ejs`
  - [ ] `views/edit.ejs`
- [ ] Make Tailwind usage consistent across pages (currently mixes CDNs)
- [ ] Optional: reuse `views/partials/layout.ejs` once layout/body passing is corrected
- [ ] Manual test flow after UI + logic changes:
  - [ ] Register → Profile → Create Post
  - [ ] Like/Unlike
  - [ ] Edit own post
  - [ ] Attempt edit someone else’s post
  - [ ] Profile picture upload

